import { check } from 'express-validator';
import { RequestHandler } from 'express';
import Categories from '../../models/Categories';

const typeValidation: RequestHandler[] = [
  check('type')
    .exists()
    .withMessage('Please enter valid product type')
    .notEmpty()
    .withMessage('Please enter product type')
    .custom(async (value, { req }) => {
      const existingType = await Categories.findOne({ typeProduct: value.trim() });
      if (existingType) {
        throw new Error('Product type already exists');
      }
    }),
];

export default typeValidation;
