import { check } from 'express-validator';
import { RequestHandler } from 'express';
import User from '../../models/User';

const loginValidator: RequestHandler[] = [
  check('username')
    .exists()
    .withMessage('Please enter your valid username')
    .notEmpty()
    .withMessage('Please enter your username'),

  check('password')
    .exists()
    .withMessage('Please enter your valid password')
    .notEmpty()
    .withMessage('Please enter your password'),
];

export default loginValidator;
