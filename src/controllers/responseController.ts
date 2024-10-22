import { Request, Response } from "express";
import { Response as ResponseModel } from "../models/Response";
import Joi from "joi";
import { upload } from "../middleware/multerConfig"; // Assuming Multer config is in middlewares

// Define validation schema using Joi
const schema = Joi.object({
  taskId: Joi.string().required().messages({
    "string.base": `"taskId" should be a type of 'text'`,
    "string.empty": `"taskId" cannot be an empty field`,
    "any.required": `"taskId" is a required field`,
  }),
  questionId: Joi.string().required().messages({
    "string.base": `"questionId" should be a type of 'text'`,
    "string.empty": `"questionId" cannot be an empty field`,
    "any.required": `"questionId" is a required field`,
  }),
});

// Helper function for sending error responses
const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({ message });
};

// Create a new response
export const createResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId,userId, questionId, questionTitle, questionType, description, answerType, required, timeLimit, Answer } = req.body;
    console.log(req.body);

    // Parse the Answer string if it's provided
    let parsedAnswer;
    try {
      parsedAnswer = JSON.parse(Answer);
    } catch (error) {
      return sendErrorResponse(res, 400, "Invalid Answer format");
    }

    // Handle response based on question type
    let answerPayload;
    switch (questionType) {
      case "text":
        answerPayload = {
          textInput: parsedAnswer.textInput,
          timeOnScreen: parsedAnswer.timeOnScreen,
          responded: true,
        };
        break;

      case "multipleChoice":
        answerPayload = {
          choices: parsedAnswer.choices.map((choice: any) => ({
            id: choice.id,
            title: choice.title,
            questionId: choice.questionId,
            selected: choice.selected,
          })),
          responded: true,
        };
        break;

      case "fileUpload":
        const files = req.files as Express.Multer.File[];
        answerPayload = {
          files: files.map((file) => ({
            id: file.filename,
            url: `/uploads/${file.filename}`,
            type: file.mimetype,
            name: file.originalname,
            size: file.size.toString(),
          })),
          responded: true,
        };
        break;

      case "rating":
        answerPayload = {
          rating: {
            value: parsedAnswer.rating.value,
            max: parsedAnswer.rating.max,
          },
          responded: true,
        };
        break;

      default:
        return sendErrorResponse(res, 400, "Unsupported question type");
    }

    const response = new ResponseModel({
      taskId,
      questionId,
      questionTitle,
      questionType,
      description,
      answerType,
      userId,
      required,
      timeLimit,
      Answer: answerPayload,
    });

    await response.save();
    res.status(201).json(response);
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    sendErrorResponse(res, 500, "Internal server error");
  }
};

// Edit an answer
export const editAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, questionId } = req.params;
    const { Answer, questionType } = req.body;
    console.log(req.body)

    const response = await ResponseModel.findOne({ taskId, questionId });
    if (!response) {
      return sendErrorResponse(res, 404, "Response not found");
    }

    const answer = response.Answer as NonNullable<typeof response.Answer>;

    switch (questionType) {
      case "text":
        answer.textInput = Answer.textInput;
        response.timeOnScreen = Answer.timeOnScreen;
        response.responded = true;
        break;

      case "multipleChoice":
        answer.choices = Answer.choices.map((choice: any) => ({
          id: choice.id,
          title: choice.title,
          questionId: choice.questionId,
          selected: choice.selected,
        }));
        response.responded = true;
        break;

      case "fileUpload":
        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
          const files = req.files as Express.Multer.File[];
          // answer.files = []; // Reset files array

          files.forEach((file) => {
            answer.files.push({
              id: file.filename,
              url: `/uploads/${file.filename}`,
              type: file.mimetype,
              name: file.originalname,
              size: file.size.toString(),
            });
          });
        }
        response.responded = true;
        break;

      default:
        return sendErrorResponse(res, 400, "Unsupported question type");
    }

    await response.save();
    res.status(200).json({ message: "Answer updated successfully", response });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    if (error.name === "CastError") {
      sendErrorResponse(res, 404, "Response not found");
    } else {
      sendErrorResponse(res, 500, "Internal server error");
    }
  }
};

// Get all responses
export const getResponses = async (req: Request, res: Response): Promise<void> => {
  try {
    const responses = await ResponseModel.find();
    res.json(responses);
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    sendErrorResponse(res, 500, "Internal server error");
  }
};

// Delete response by taskId and questionId
export const deleteResponseByTaskAndQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, questionId } = req.params;
    const response = await ResponseModel.findOneAndDelete({ taskId, questionId });

    if (!response) {
      return sendErrorResponse(res, 404, "Response not found");
    }

    res.status(200).json({ message: "Response deleted successfully" });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    sendErrorResponse(res, 500, "Internal server error");
  }
};

// Fetch response by taskId and questionId
export const getResponseByTaskAndQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = schema.validate(req.params);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const { taskId, questionId } = req.params;
    const response = await ResponseModel.findOne({ taskId, questionId });

    if (!response) {
      return sendErrorResponse(res, 404, "Record not found");
    }

    res.status(200).json(response);
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    if (error.name === "CastError") {
      sendErrorResponse(res, 404, "Record not found");
    } else {
      sendErrorResponse(res, 500, "Internal server error");
    }
  }
};
