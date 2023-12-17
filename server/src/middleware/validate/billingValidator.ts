import { check } from 'express-validator';
import { RequestHandler } from 'express';

const billingValidator: RequestHandler[] = [
  check('addressBill')
    .exists()
    .withMessage('Please enter your valid address')
    .notEmpty()
    .withMessage('Please enter your address'),

  check('cityBill')
    .exists()
    .withMessage('Please enter your valid city')
    .notEmpty()
    .withMessage('Please enter your city')
    .isIn([
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
      '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',
      '32', '33', '34', '35', '36', '37', '38', '39',
      '40', '41', '42', '43', '44', '45', '46', '47',
      '48', '49', '50', '51', '52', '53', '54', '55',
      '56', '57', '58', '59', '60', '61', '62', '63'
    ])
    .withMessage('Invalid type'),

  check('telBill')
    .exists()
    .withMessage('Please enter your valid phone')
    .notEmpty()
    .withMessage('Please enter your number phone')
    .custom((value) => {
      if (value.match(/(84)+([0-9]{9})\b/g)) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Invalid phone number'),
];

export default billingValidator;
