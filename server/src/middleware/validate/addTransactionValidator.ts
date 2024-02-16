import { check } from 'express-validator';
import { RequestHandler } from 'express';
import Transactions from '../../models/Transactions';

const transactionValidation: RequestHandler[] = [
  check('transaction')
    .exists()
    .withMessage('Please enter valid transaction')
    .notEmpty()
    .withMessage('Please select transaction')
    // .custom(async (value, { req }) => {
    //   const existingTransaction = await Transactions.findOne({listProduct: value.sort((a: string,b: string) => a.localeCompare(b)).join(', ')});
    //   if (existingTransaction) {
    //     throw new Error('Transaction already exists');
    //   }
    // }),
];

export default transactionValidation;
