/* eslint-disable no-useless-escape */

import * as yup from 'yup';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const schema = () => {
    return yup.object({
        // email: yup
        //     .string()
        //     .required('* Vui lòng nhập địa chỉ email')
        //     .min(6, '* Vui lòng nhập tối thiểu 6 ký tự')
        //     .max(64, '* Vui lòng nhập tối đa 256 ký tự')
        //     .matches(EMAIL_REGEX, '* Địa chỉ email không đúng'),
        username: yup
            .string()
            .required('* Please enter username'),
        password: yup
            .string()
            .required('* Please enter a password')
    })
};
