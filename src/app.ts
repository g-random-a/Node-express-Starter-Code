import express from "express";
import cors from "cors"; // Import cors
import responseRoutes from "./routes/responseRoutes";
import path from "path";

import { connectDB } from "./utils/db";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
connectDB();

// Use CORS middleware
app.use(cors()); // Enable All CORS Requests

app.use(express.json());
// setupSwagger(app); // Setup Swagger documentation
const uploadsDir = path.join(__dirname, "uploads");

app.use('/api/v1/response/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/response/uploads", express.static(uploadsDir));

app.use("/api/v1/response", responseRoutes);


export default app;