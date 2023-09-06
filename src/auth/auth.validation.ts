import * as Joi from 'joi';

/*****************************************************************************************************************************
 *
 **************************************** INPUT VALIDATION WITH JOI **********************************
 *
 ******************************************************************************************************************************
 */

/*************************************** SIGN-UP SCHEMA VALIDATION  ***************************************/
export const signUpSchema = Joi.object({
  first_name: Joi.string().min(3).required().messages({
    'string.base': 'First name must be a string',
    'string.min': 'First name requires at least 3 characters',
    'any.required': 'First name is required',
    'string.empty': 'First name is not allowed to be empty',
  }),
  last_name: Joi.string().min(3).required().messages({
    'string.base': 'Last name must be a string',
    'string.min': 'Last name requires at least 3 characters',
    'any.required': 'Last name is required',
    'string.empty': 'Last name is not allowed to be empty',
  }),
  email: Joi.string().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid Email',
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Last name requires at least 3 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});

/*************************************** LOGIN SCHEMA VALIDATION  ***************************************/
export const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid Email',
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Last name requires at least 3 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});

/*************************************** VERIFICATION SCHEMA VALIDATION  ***************************************/
export const verificationSchema = Joi.object({
  ver_id: Joi.string().required().messages({
    'string.base': 'Verification ID must be a string',
    'any.required': 'Verification ID is required',
    'string.empty': 'Verification ID is not allowed to be empty',
  }),
  email: Joi.string().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid Email',
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});

/*************************************** RESET PASSWORD SCHEMA VALIDATION  ***************************************/
export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password requires at least 3 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password is not allowed to be empty',
  }),
  confirmPassword: Joi.string().required().messages({
    'string.base': 'Confirm Password must be a string',
    'string.min': 'Confirm Password requires at least 3 characters',
    'any.required': 'Confirm Password is required',
    'string.empty': 'Confirm Password is not allowed to be empty',
  }),
  code: Joi.string().required().messages({
    'string.base': 'Code must be a string',
    'any.required': 'Code is required',
    'string.empty': 'Code is not allowed to be empty',
  }),
  email: Joi.string().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid Email',
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
  }),
}).options({
  abortEarly: false,
});
