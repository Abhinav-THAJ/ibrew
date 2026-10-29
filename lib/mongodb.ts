import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

export default async function connectDB() {
  const raw = process.env.MONGODB_URI ?? "";
  const MONGODB_URI = raw.trim().replace(/^["']|["']$/g, "");

  if (!MONGODB_URI) {
    throw new Error(
      "Define MONGODB_URI in your environment variables (or .env.local / Vercel Environment Variables)"
    );
  }

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset on failure so next call can retry
    throw e;
  }
  return cached.conn;
}

