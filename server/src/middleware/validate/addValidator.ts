import { check } from 'express-validator';
import { RequestHandler } from 'express';
import path from 'path';
import Product from '../../models/Product';

const productValidation: RequestHandler[] = [
  check('name')
    .exists()
    .withMessage('Please enter valid product name')
    .notEmpty()
    .withMessage('Please enter product name')
    .custom(async (value, { req }) => {
      const existingProduct = await Product.findOne({ name: value });
      if (existingProduct) {
        throw new Error('Product already exists');
      }
    }),

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
    .withMessage('Please enter a valid date of manufacture')
    .notEmpty()
    .withMessage('Please enter a date'),

  check('type')
    .exists()
    .withMessage('Please enter a valid type')
    .notEmpty()
    .withMessage('Please enter type')
    .isIn(['Laptop', 'Smartphone', 'Camera'])
    .withMessage('Invalid type'),

  check('myImage')
    .custom((value, { req }) => {
      const img = req.files?.myImage;
      if (img) {
        return true;
      } else {
        throw new Error('Image not empty');
      }
    }),
];

export default productValidation;
