import { check } from 'express-validator';
import { RequestHandler } from 'express';
import User from '../../models/User';

const registerValidator: RequestHandler[] = [
  check('fullname')
    .exists()
    .withMessage('Please enter your valid name')
    .notEmpty()
    .withMessage('Please enter your name'),

  check('username')
    .exists()
    .withMessage('Please enter your valid username')
    .notEmpty()
    .withMessage('Please enter your username')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error('Username already in use');
      }
    }),

  check('email')
    .exists()
    .withMessage('Please enter your email')
    .notEmpty()
    .withMessage('Please enter your email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),

  check('password')
    .exists()
    .withMessage('Please enter your valid password')
    .notEmpty()
    .withMessage('Please enter your password')
    .isLength({ min: 6 })
    .withMessage('Passwords must be at least 6 characters'),

  // check('passwordConfirm')
  //   .exists()
  //   .withMessage('Please enter your valid confirm password')
  //   .notEmpty()
  //   .withMessage('Please confirm your password')
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error('Password confirmation does not match');
  //     }
  //   }),
];

export default registerValidator;
