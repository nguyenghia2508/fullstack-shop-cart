/* eslint-disable no-useless-escape */

import * as yup from 'yup';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_REGEX = /(84)+([0-9]{9})\b/g;

const cities = [
    "An Giang", "Bắc Giang", "Bắc Kan", "Bạc Lieu", "Bắc Ninh",
    "Bà Rịa-Vũng Tàu", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắc Lắk", "Đắc Nông", "Điện Biên",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hải Dương", "Hà Nam",
    "Hà Tây", "Hà Tĩnh", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa",
    "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai",
    "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuậnn", "Phú Thọ",
    "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngải", "Quảng Ninh",
    "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên-Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái", "Cần Thơ", "Đà Nẵng", "Hải Phòng",
    "Hà Nội", "Hồ Chí Minh"
];

// Use the map function to create an array of option values
const cityOptionValues = cities.map((city, index) => index.toString());

export const schema = (showEmailInput,showCreditPayment) => {
    const emailValidation = showEmailInput
    ? yup.string()
        .required('* Please enter your email')
        .matches(EMAIL_REGEX, '* Invalid email address')
    : yup.string();

    const creditCardValidation = showCreditPayment
    ? yup.string()
        .required('* Please enter your credit card number')
        .length(16, '* Credit card number must be 16 digits')
    : yup.string();

    const cvvValidation = showCreditPayment
    ? yup.string()
        .required('* Please enter your CVV')
        .length(3, '* CVV must be 3 digits')
    : yup.string();

    const monthCreditValidation = showCreditPayment
    ? yup.string()
        .required('* Please enter the expiration month')
        .length(2, '* Month must be 2 digits')
        .test('isValidMonth', '* Invalid month', (value) => {
            const month = parseInt(value, 10);
            return !isNaN(month) && month >= 1 && month <= 12;
        })
    : yup.string();

    const yearCreditValidation = showCreditPayment
    ? yup.string()
        .required('* Please enter the expiration year')
        .length(4, '* Year must be 4 digits')
        .test('isValidYear', '* Invalid year', (value) => {
            const year = parseInt(value, 10);
            return !isNaN(year) && year >= 2000;
        })
    : yup.string();



    return yup.object({
    emailBill: emailValidation,
    creditCardBill : creditCardValidation,
    cvvBill : cvvValidation,
    monthCreditBill : monthCreditValidation,
    yearCreditBill : yearCreditValidation,
    addressBill: yup
        .string()
        .required('* Please enter the address'),
    cityBill: yup
        .string()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('* Please enter the province/city')
        .oneOf(cityOptionValues, '* Please select a province/city from the list'),
    telBill: yup
        .string()
        .required('* Please enter the phone number')
        .matches(PHONE_REGEX, '* Invalid phone number'),
    notesBill : yup
        .string()
    })
};
