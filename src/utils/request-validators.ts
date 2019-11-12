import { body, validationResult, ValidationChain } from 'express-validator';
import { Request } from 'express';

export function validationHandler(req: Request): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors
      .array()
      .map(i => `'${i.param}': ${i.msg}`)
      .join(',\n');
    throw new Error(msg);
  }
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
