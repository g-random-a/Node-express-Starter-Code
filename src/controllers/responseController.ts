import { Request, Response } from "express";
import { Response as ResponseModel } from "../models/Response";
import Joi from "joi";
import { upload } from "../middleware/multerConfig"; // Assuming Multer config is in middlewares

// Define validation schema using Joi
const schema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": `"userId" should be a type of 'text'`,
    "string.empty": `"userId" cannot be an empty field`,
    "any.required": `"userId" is a required field`,
  }),
  taskId: Joi.string().required().messages({
    "string.base": `"taskId" should be a type of 'text'`,
    "string.empty": `"taskId" cannot be an empty field`,
    "any.required": `"taskId" is a required field`,
  }),
});

const singleResponseSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": `"userId" should be a type of 'text'`,
    "string.empty": `"userId" cannot be an empty field`,
    "any.required": `"userId" is a required field`,
  }),
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
  questionType: Joi.string().required().messages({
    "string.base": `"questionType" should be a type of 'text'`,
    "string.empty": `"questionType" cannot be an empty field`,
    "any.required": `"questionType" is a required field`,
  }),
  answers: Joi.array().required().messages({
    "array.base": `"answers" should be an array`,
    "any.required": `"answers" is a required field`,
  }),
});

// Helper function for sending error responses
const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({ message });
};



// Validation schema for bulk responses
const bulkResponseSchema = Joi.array().items(singleResponseSchema);
const constructFileUrl = (req: Request, filename: string): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
};

export const createBulkResponses = async (req: Request, res: Response): Promise<void> => {
  try {
    const responses = JSON.parse(req.body.questionData);
    console.log("Parsed questionData:", responses);

    const { error } = bulkResponseSchema.validate(responses);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const files = req.files as Express.Multer.File[];
    const fileMap = files.reduce((acc, file) => {
      acc[file.originalname] = constructFileUrl(req, file.filename);
      return acc;
    }, {} as Record<string, string>);

    const formattedResponses = responses.map((response: any) => {
      const { userId, taskId, questionId, questionType, answers } = response;
      const formattedAnswers = {
        form: [],
        choices: [],
        files: [],
        Text: [],
        rating: null,
      };

      switch (questionType) {
        case "TEXT":
        case "EMAIL":
        case "NUMBER":
        case "DATE":
        case "TIME":
        case "COLORPICKER":
        case "SLIDER":
        case "LOCATION":
          formattedAnswers.Text = answers.map((answer: any) => ({
            id: answer.id,
            value: answer.value,
          }));
          break;

        case "MULTIPLE_CHOICE":
        case "CHECKBOX":
        case "DROPDOWN":
        case "RADIOBUTTON":
          formattedAnswers.choices = answers.map((answer: any) => ({
            id: answer.id,
            title: answer.title,
            selected: answer.selected,
          }));
          break;
        case "RATING":
          formattedAnswers.Text = answers.map((answer: any) => ({
              id: answer.id,
              value: answer.value,
            }));
          break;

        case "RANGE":
          formattedAnswers.form = answers.map((answer: any) => ({
            id: answer.id,
            startValue: answer.startValue,
            endValue: answer.endValue,
          }));
          break;

        case "FILE":
        case "Media":
          formattedAnswers.files = answers.map((answer: any) => ({
            id: answer.id,
            url: fileMap[answer.fileName] || "",
            type: answer.type,
            name: answer.fileName,
            size: answer.size,
          }));
          break;

        default:
          throw new Error(`Unsupported question type: ${questionType}`);
      }

      return { userId, taskId, questionId, questionType, Answer: formattedAnswers };
    });

    const savedResponses = await ResponseModel.insertMany(formattedResponses);
    res.status(201).json({ message: "Multiple responses saved successfully", savedResponses });
  } catch (error: any) {
    console.error("Error saving responses:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

// Create a new response
export const createResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, questionId, answers, questionType, taskId } = req.body;

    // Validate payload
    const { error } = schema.validate({ userId, questionId });
    if (error) return sendErrorResponse(res, 400, error.details[0].message);

    if (!Array.isArray(answers) || answers.length === 0) {
      return sendErrorResponse(res, 400, "Invalid or missing 'answers' array");
    }

    // Parse answers based on questionType and map to schema structure
    const Answer: any = {};
    switch (questionType) {
      case "TEXT":
      case "EMAIL":
      case "NUMBER":
      case "DATE":
      case "TIME":
      case "COLORPICKER":
      case "SLIDER":
      case "LOCATION":
      case "RATING":
        Answer.Text = answers.map((answer: any) => ({
          id: answer.id,
          value: answer.value,
        }));
        break;

      case "MULTIPLE_CHOICE":
      case "CHECKBOX":
      case "DROPDOWN":
      case "RADIOBUTTON":
        Answer.choices = answers.map((answer: any) => ({
          id: answer.id,
          selected: answer.selected,
          title:answer.title,
          questionId:answer.questionId

        }));
        break;

      case "RANGE":
        Answer.rating = {
          value: answers[0]?.value,
          max: answers[0]?.max,
        };
        break;

      case "FILE":
      case "Media":
        if (!req.files || !(req.files as Express.Multer.File[]).length) {
          return sendErrorResponse(res, 400, "No files uploaded");
        }
        const files = req.files as Express.Multer.File[];
        Answer.files = files.map((file) => ({
          id: answers[0]?.id, // Ensure `answers` include `id`
          url: `/uploads/${file.filename}`,
          type: file.mimetype,
          name: file.originalname,
          size: file.size.toString(),
        }));
        break;

      default:
        return sendErrorResponse(res, 400, "Unsupported question type");
    }

    // Save response
    const response = new ResponseModel({
      taskId,
      questionId,
      userId,
      Answer,
    });

    await response.save();
    res.status(201).json(response);
  } catch (error: any) {
    console.error(error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};



// Fetch responses
export const getResponses = async (req: Request, res: Response): Promise<void> => {
  try {
    const responses = await ResponseModel.find();
    res.status(200).json(responses);
  } catch (error: any) {
    console.error(error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};
export const getResponsesByUserAndTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = schema.validate(req.params);
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const { userId, taskId } = req.params;
    const responses = await ResponseModel.find({ userId, taskId });

    

    res.status(200).json(responses);
  } catch (error: any) {
    console.error(error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};
// Edit response
