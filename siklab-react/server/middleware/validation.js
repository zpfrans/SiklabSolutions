import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

// Chat message validation rules
export const chatMessageValidation = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters')
    .escape(), // Prevent XSS
  body('sessionId')
    .optional()
    .isUUID().withMessage('Invalid session ID format'),
  validate
];

// Session creation validation
export const sessionValidation = [
  body('userId')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 }),
  body('metadata')
    .optional()
    .isObject(),
  validate
];
