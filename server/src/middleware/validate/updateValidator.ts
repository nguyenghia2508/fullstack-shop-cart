import { check } from 'express-validator';
import { RequestHandler } from 'express';
import Categories from '../../models/Categories';
import Product from '../../models/Product';

const productValidator: RequestHandler[] = [
  check('productID')
    .exists()
    .withMessage('Please enter valid product id')
    .notEmpty()
    .withMessage('Please enter product id')
    .custom(async (value, { req }) => {
      const currentProductID = await Product.findOne({ _id: req?.params?.id });
      const existingProductID = await Product.findOne({ productID: value.trim() });
      if (existingProductID && currentProductID?.productID !== req.body.productID) {
        throw new Error('Product id already exists');
      }
    }),

  check('name')
    .exists()
    .withMessage('Please enter valid product name')
    .notEmpty()
    .withMessage('Please enter product name')
    .custom(async (value, { req }) => {
      const currentProductName = await Product.findOne({ _id: req?.params?.id });
      const existingProductName = await Product.findOne({ name: value.trim() });
      if (existingProductName && currentProductName?.name !== req.body.name) {
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
    .withMessage('Please enter valid date of manufacture')
    .notEmpty()
    .withMessage('Please enter date'),

  check('type')
    .exists()
    .withMessage('Please enter valid type')
    .notEmpty()
    .withMessage('Please enter type')
    .custom(async (value, { req }) => {
      const listType = await Categories.find({});
      if (!listType.map(item => item.typeProduct).includes(value)) {
        throw new Error('Invalid type');
      }
    }),
];

export default productValidator;
