import {
  body,
  query,
  validationResult,
  ValidationChain,
  ValidationError
} from 'express-validator';
import { Request } from 'express';

export function getValidationErrors(req: Request): string[] {
  const errors = validationResult(req);
  const messages: string[] = [];
  if (!errors.isEmpty()) {
    errors.array().forEach((err: ValidationError) => {
      messages.push(err.msg);
    });
  }
  return messages;
}

export function getPostUserValidators(): ValidationChain[] {
  return [
    body('username')
      .exists({ checkFalsy: true })
      .withMessage('Parameter "username" is required.'),
    body('username')
      .isLength({ min: 1, max: 16 })
      .withMessage(
        'Parameter "username" length must be between 1 and 16 characters.'
      ),
    body('displayName')
      .exists({ checkFalsy: true })
      .withMessage('Parameter "displayName" is required.'),
    body('displayName')
      .isLength({ min: 1, max: 16 })
      .withMessage(
        'Parameter "displayName" length must be between 1 and 16 characters.'
      ),
    body('birthDate')
      .exists({ checkFalsy: true })
      .withMessage('Parameter "birthDate" is required.'),
    body('birthDate')
      .custom((birthDate: string) => {
        let isValid = true;
        const now = new Date();
        if (new Date(birthDate).getTime() >= now.getTime()) {
          isValid = false;
        }
        return isValid;
      })
      .withMessage('Parameter "birthDate" cannot be greater than current date.')
  ];
}

export function getFindAllUserValidators(): ValidationChain[] {
  return [
    query('search')
      .optional()
      .isLength({ min: 1, max: 255 })
      .withMessage(
        'Query parameter "search" length must be between 1 and 255 characters.'
      )
  ];
}
