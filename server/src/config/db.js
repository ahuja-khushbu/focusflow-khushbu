import mongoose from 'mongoose';

const connectDB = async (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI;
  let retries = 5;

  while (retries > 0) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      retries -= 1;
      console.error(`MongoDB connection failed. Retries left: ${retries}`, err.message);
      if (retries === 0) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
};

export default connectDB;
