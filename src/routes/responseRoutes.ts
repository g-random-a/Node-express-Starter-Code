import { Router } from "express";
import {
  createResponse,
  editAnswer,
  getResponses,
  deleteResponseByTaskAndQuestion,
  getResponseByTaskAndQuestion,
} from "../controllers/responseController";
import { upload } from "../middleware/multerConfig"; // Assuming you use multer for file uploads

const router = Router();

// Route to create a new response
router.post("/responses", upload.array("files"), createResponse);

// Route to edit an existing answer
router.put("/responses/:taskId/:questionId", upload.array("files"), editAnswer);

// Route to get all responses
router.get("/responses", getResponses);

// Route to delete a response
router.delete("/responses/:taskId/:questionId", deleteResponseByTaskAndQuestion);

// Route to fetch a specific response by taskId and questionId
router.get("/responses/:taskId/:questionId", getResponseByTaskAndQuestion);

export default router;