import mongoose from "mongoose";
const connectDB = async () => {
  const MONGODB_URI = "mongodb+srv://bishal:bishal123@cluster0.bqsd4.mongodb.net/nodejs-2026823?retryWrites=true&w=majority&appName=Cluster0"

  try {
    await mongoose.connect(`${MONGODB_URI}`);

    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};
export default connectDB