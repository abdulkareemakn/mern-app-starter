import mongoose from "mongoose";

export function connectDatabase(uri: string, dbName?: string) {
  return mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 });
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}
