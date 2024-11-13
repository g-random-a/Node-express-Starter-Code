import { Router } from "express";
import { 
  createResponse, 
  createBulkResponses, 
  getResponses, 
  getResponsesByUserAndTask ,
  deleteAllRecords
} from "../controllers/responseController";
import { upload } from "../middleware/multerConfig";

const router = Router();

// Route to create a single response
router.post("/responses", upload.none(), createResponse);

router.delete('/delete', deleteAllRecords);


// Route to create bulk responses
router.post("/responses/bulk", upload.array("files"), createBulkResponses);

// Route to get all responses
router.get("/responses", getResponses);

// Route to get responses by userId and taskId
router.get("/responses/:userId/:taskId", getResponsesByUserAndTask);

export default router;
