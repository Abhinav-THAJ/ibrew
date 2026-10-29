import mongoose from "mongoose";

const raw = process.env.MONGODB_URI ?? "";
const MONGODB_URI = raw.trim().replace(/^["']|["']$/g, "");

// Temporary debug line: shows only the first 15 characters
console.log("URI check:", JSON.stringify(MONGODB_URI.slice(0, 15)), "length:", MONGODB_URI.length);

if (!MONGODB_URI) throw new Error("Define MONGODB_URI in .env.local");

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
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI);
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // don't keep a failed attempt
    throw e;
  }
  return cached.conn;
}