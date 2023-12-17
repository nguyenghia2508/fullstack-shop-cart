/* eslint-disable no-useless-escape */

import * as yup from 'yup';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const schema = () => {
    return yup.object({
        fullname: yup
            .string()
            .required('* Please enter full name'),
        username: yup
            .string()
            .required('* Please enter username'),
        email: yup
            .string()
            .required('* Please enter email address')
            .min(6, '* Please enter at least 6 characters')
            .max(64, '* Please enter a maximum of 256 characters')
            .matches(EMAIL_REGEX, '* Invalid email address'),
        password: yup
            .string()
            .required('* Please enter a password')
            .min(6, '* Please enter at least 6 characters')
    });
};
