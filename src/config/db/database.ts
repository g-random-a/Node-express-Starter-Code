import mongoose from 'mongoose';
import config from '../configs';

let attempt = 0;
const delay = 5000;
const dbURI = config.mongoDbUrl;

const delayRetry = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (retries = 5) => {
  console.log('');
  console.log('----------------------------------------');
  console.log('🟢 Connecting to MongoDB...');
  while (attempt < retries) {
    try {
      await mongoose.connect(dbURI);
      console.log('Connected to MongoDB\n');
      return;
    } catch (error) {
      attempt++;
      console.error('Database connection failed.');
      if (attempt < retries) {
        console.log(
          `Retrying in ${
            (delay / 1000) * attempt
          } seconds... (${attempt}/${retries})`,
        );
        await delayRetry(delay * attempt);
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1); // Exit after max retries
      }
    }
  }
};

export default connectDB;
