import mongoose from "mongoose";
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI

  try {
    await mongoose.connect(`${MONGODB_URI}`);

    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};
export default connectDB