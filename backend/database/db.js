import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Instagram',
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.log('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};
