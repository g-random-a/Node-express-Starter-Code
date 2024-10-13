import express from 'express';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import connectDB from './config/database';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use('/', routes);

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer().catch(error => {
    console.error('Server startup error:', error);
});
