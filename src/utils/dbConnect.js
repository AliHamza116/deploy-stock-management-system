import mongoose from "mongoose";

export default async function dbConnect() {
  if (mongoose.connections[0].readyState) {
    console.log("Using existing connection");
    return;
  }
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
