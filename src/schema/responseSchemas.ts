// responseSchemas.ts
import Joi from 'joi';

export const createResponseSchema = Joi.object({
  taskId: Joi.string().required().messages({
    'string.base': `"taskId" should be a type of 'text'`,
    'string.empty': `"taskId" cannot be an empty field`,
    'any.required': `"taskId" is a required field`,
  }),
  questionId: Joi.string().required().messages({
    'string.base': `"questionId" should be a type of 'text'`,
    'string.empty': `"questionId" cannot be an empty field`,
    'any.required': `"questionId" is a required field`,
  }),
  questionTitle: Joi.string().optional(),
  questionType: Joi.string().valid('text', 'multipleChoice', 'fileUpload').required(),
  description: Joi.string().optional(),
  answerType: Joi.string().optional(),
  required: Joi.boolean().optional(),
  timeLimit: Joi.number().optional(),
  Answer: Joi.object().required(),
});

export const getResponseByTaskAndQuestionSchema = Joi.object({
  taskId: Joi.string().required().messages({
    'string.base': `"taskId" should be a type of 'text'`,
    'string.empty': `"taskId" cannot be an empty field`,
    'any.required': `"taskId" is a required field`,
  }),
  questionId: Joi.string().required().messages({
    'string.base': `"questionId" should be a type of 'text'`,
    'string.empty': `"questionId" cannot be an empty field`,
    'any.required': `"questionId" is a required field`,
  }),
});

export const editAnswerSchema = Joi.object({
  taskId: Joi.string().required(),
  questionId: Joi.string().required(),
  Answer: Joi.object().required(),
  questionType: Joi.string().valid('text', 'multipleChoice', 'fileUpload').required(),
});

export const deleteResponseByTaskAndQuestionSchema = Joi.object({
  taskId: Joi.string().required(),
  questionId: Joi.string().required(),
});
