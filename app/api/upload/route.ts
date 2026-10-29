import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== "your_api_secret"
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ images: [] });
    }

    if (isCloudinaryConfigured) {
      try {
        const images = await Promise.all(
          files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: "ibrew" }, (err, result) => {
                  if (err || !result) return reject(err);
                  resolve({ url: result.secure_url, public_id: result.public_id });
                })
                .end(buffer);
            });
          })
        );
        return NextResponse.json({ images });
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to local uploads:", cloudErr);
      }
    }

    // Local storage fallback
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const images = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        await fs.writeFile(filePath, buffer);
        return {
          url: `/uploads/${safeName}`,
          public_id: safeName,
        };
      })
    );

    return NextResponse.json({ images });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
