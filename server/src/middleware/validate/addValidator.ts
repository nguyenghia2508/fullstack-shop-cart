import { check } from 'express-validator';
import { RequestHandler } from 'express';
import path from 'path';
import Product from '../../models/Product';
import Categories from '../../models/Categories';

const productValidation: RequestHandler[] = [
  check('productID')
    .exists()
    .withMessage('Please enter valid product id')
    .notEmpty()
    .withMessage('Please enter product id')
    .custom(async (value, { req }) => {
      const existingProductID = await Product.findOne({ productID: value.trim() });
      if (existingProductID) {
        throw new Error('Product id already exists');
      }
    }),

  check('name')
    .exists()
    .withMessage('Please enter valid product name')
    .notEmpty()
    .withMessage('Please enter product name')
    .custom(async (value, { req }) => {
      const existingProduct = await Product.findOne({ name: value.trim() });
      if (existingProduct) {
        throw new Error('Product name already exists');
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
    .custom(async (value, { req }) => {
      const listType = await Categories.find({});
      if (!listType.map(item => item.typeProduct).includes(value)) {
        throw new Error('Invalid type');
      }
    }),

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
