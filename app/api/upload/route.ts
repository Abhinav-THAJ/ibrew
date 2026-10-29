import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

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
}