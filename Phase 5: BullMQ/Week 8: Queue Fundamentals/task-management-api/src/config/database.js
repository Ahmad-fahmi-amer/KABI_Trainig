import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("bufferCommands", false);

export async function connectToDatabase() {
  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
}

export async function disconnectFromDatabase() {
  await mongoose.disconnect();
}
