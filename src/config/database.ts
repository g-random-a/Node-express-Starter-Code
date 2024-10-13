import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || '';
        await mongoose.connect(dbURI, );
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
