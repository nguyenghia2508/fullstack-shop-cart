/* eslint-disable no-useless-escape */

import * as yup from 'yup';

export const schema = (listProduct) => {
    
    return yup.object({
    transaction : yup
        .array() // transaction là một mảng
        .required('* Please select product')
        .test('is-empty', '* Transaction not empty', (value) => {
            return value && value.length > 0
        })
        .test('is-valid-product', '* Invalid Product', value => {
            // Kiểm tra từng phần tử trong mảng có tồn tại trong listProduct không
            return value.every(item => listProduct.map(item => item[0]).includes(item));
        }),
    })
};
