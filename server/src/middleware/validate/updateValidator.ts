import { check } from 'express-validator';
import { RequestHandler } from 'express';

const productValidator: RequestHandler[] = [
  check('name')
    .exists()
    .withMessage('Please enter valid product name')
    .notEmpty()
    .withMessage('Please enter product name'),

  check('number')
    .exists()
    .withMessage('Please enter number')
    .notEmpty()
    .withMessage('Please enter a valid number')
    .isInt({ min: 0 })
    .withMessage('Please enter a valid number'),

  check('price')
    .exists()
    .withMessage('Please enter price')
    .notEmpty()
    .withMessage('Please enter price')
    .isInt({ min: 0 })
    .withMessage('Please enter a valid price'),

  check('dom')
    .exists()
    .withMessage('Please enter valid date of manufacture')
    .notEmpty()
    .withMessage('Please enter date'),

  check('type')
    .exists()
    .withMessage('Please enter valid type')
    .notEmpty()
    .withMessage('Please enter type')
    .isIn(['Laptop', 'Smartphone', 'Camera'])
    .withMessage('Invalid type'),
];

export default productValidator;
