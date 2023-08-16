import { body, param } from 'express-validator';

export const idValidation = () => {
  return param('id')
    .trim()
    .notEmpty()
    .withMessage('id parameter is required')
    .isUUID(4)
    .withMessage('Not a valid user id');
};

export const nameValidation = () => {
  return body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name exceeds maximum character limit of 255');
};

export const emailValidation = () => {
  return body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Not a valid email address');
};

export const passwordValidation = () => {
  return body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long');
};
