import mongoose from "mongoose";

const DB_NAME = "blog"

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.NODE_ENV_MONGOOSE_URL}/${DB_NAME}`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
  }
}

export default connectDB