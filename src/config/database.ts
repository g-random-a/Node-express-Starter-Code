import mongoose from 'mongoose';
import { config } from './configs';

const connectDB = async () => {
    try {
        const dbURI = config.mongoDbUrl;
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
