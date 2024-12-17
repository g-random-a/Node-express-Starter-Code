import express from "express";
import cors from "cors"; // Import cors
import responseRoutes from "./routes/responseRoutes";
import path from "path";

import { connectDB } from "./utils/db";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { connectRabbitMQ } from "./utils/rabbitmq";
import { consumeMessages } from "./utils/rabbitmq/subscriber";

const app = express();

const startApp = async () => {
    try {
      connectDB();
  
      await connectRabbitMQ();
      consumeMessages();
  
      console.log("RabbitMQ connected and consumer started.");
    } catch (error) {
      console.error("Failed to initialize application:", error);
      process.exit(1);
    }
  };
  
startApp();

// Use CORS middleware
app.use(cors()); // Enable All CORS Requests

app.use(express.json());
// setupSwagger(app); // Setup Swagger documentation
const uploadsDir = path.join(__dirname, "uploads");

app.use('/api/v1/response/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/response/uploads", express.static(uploadsDir));

app.use("/api/v1/response", responseRoutes);


export default app;