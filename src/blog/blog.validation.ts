import * as Joi from 'joi';

/*****************************************************************************************************************************
 *
 **************************************** INPUT VALIDATION WITH JOI **********************************
 *
 ******************************************************************************************************************************
 */

/*************************************** CREATE-POST SCHEMA VALIDATION  ***************************************/
export const createPostSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title requires at least 3 characters',
    'any.required': 'Title is required',
    'string.empty': 'Title is not allowed to be empty',
  }),
  content: Joi.string().min(3).required().messages({
    'string.base': 'Content must be a string',
    'string.min': 'Content requires at least 3 characters',
    'any.required': 'Content is required',
    'string.empty': 'Content is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});

/*************************************** EDIT-POST SCHEMA VALIDATION  ***************************************/
export const editPostSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title requires at least 3 characters',
    'any.required': 'Title is required',
    'string.empty': 'Title is not allowed to be empty',
  }),
  content: Joi.string().min(3).required().messages({
    'string.base': 'Content must be a string',
    'string.min': 'Content requires at least 3 characters',
    'any.required': 'Content is required',
    'string.empty': 'Content is not allowed to be empty',
  }),
  post_id: Joi.number().required().messages({
    'number.base': 'Post ID must be a number',
    'any.required': 'Post ID is required',
    'number.empty': 'Post ID is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});

/***************************************  POST-ENGAGEMENT SCHEMA VALIDATION  ***************************************/
export const createEngagementSchema = Joi.object({
  post_id: Joi.number().required().messages({
    'number.base': 'Post ID must be a number',
    'any.required': 'Post ID is required',
    'number.empty': 'Post ID is not allowed to be empty',
  }),

  flag: Joi.string().required().messages({
    'string.base': 'Flag must be a string',
    'any.required': 'Flag is required',
    'string.empty': 'Flag is not allowed to be empty',
  }),

  comment: Joi.string().optional().messages({
    'string.base': 'Comment must be a string',
    'string.empty': 'Comment is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});

/***************************************  DELETE-ENGAGEMENT SCHEMA VALIDATION  ***************************************/
export const deleteEngagementSchema = Joi.object({
  post_id: Joi.number().required().messages({
    'number.base': 'Post ID must be a number',
    'any.required': 'Post ID is required',
    'number.empty': 'Post ID is not allowed to be empty',
  }),

  flag: Joi.string().required().messages({
    'string.base': 'Flag must be a string',
    'any.required': 'Flag is required',
    'string.empty': 'Flag is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});
