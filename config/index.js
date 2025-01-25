import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = mongoose.connection;
    conn.on('connected', () => {
      console.log('Connected to MongoDB Server');
    });
    conn.on('error', (error) => {
      console.error('Error connecting to MongoDB Server:', error);
    });
    await mongoose.connect(process.env.NODE_ENV_MONGOOSE_URL);

  } catch (error) {
    console.error('Error connecting to MongoDB Server:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

export default connectDB