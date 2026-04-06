import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env.local')

const globalWithMongoose = global as typeof global & {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (globalWithMongoose.mongoose.conn) return globalWithMongoose.mongoose.conn

  if (!globalWithMongoose.mongoose.promise) {
    globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands:           false,
      serverSelectionTimeoutMS: 8000,  // fail fast instead of 30s default
      connectTimeoutMS:         8000,
      socketTimeoutMS:          10000,
      maxPoolSize:              10,
    })
  }

  try {
    globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise
  } catch (err) {
    // Reset promise so next request retries the connection
    globalWithMongoose.mongoose.promise = null
    throw err
  }

  return globalWithMongoose.mongoose.conn
}
