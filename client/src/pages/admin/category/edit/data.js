/* eslint-disable no-useless-escape */

import * as yup from 'yup';

export const schema = () => {
    return yup.object({
    type : yup
        .string()
        .required('* Please enter type')
    })
};
