/* eslint-disable no-useless-escape */

import * as yup from 'yup';

export const schema = (listType) => {
        
    // Use the map function to create an array of option values
    const typeOptionValues = listType.map((type, index) => type.toString());

    return yup.object({
    productID: yup
        .string()
        .required('* Please enter product ID'),
    name: yup
        .string()
        .required('* Please enter product name'),
    number: yup
        .string()
        .required('* Please enter number')
        .min(0,'* Number must be great than 0'),
    price: yup
        .string()
        .required('* Please enter number')
        .min(0,'* Price must be great than 0'),
    dom : yup
        .string()
        .required('* Please enter a valid date of manufacture'),
    type : yup
        .string()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('* Please enter type')
        .oneOf(typeOptionValues,'* Invalid type'),
    detail : yup
        .string(),
    desc : yup
        .string(),
    myImageEdit: yup
        .mixed()
        .test('is-image', '* Invalid image file', function (value) {
            if (this.parent.myImageEdit && this.parent.myImageEdit.length > 0) {
                return value && value.length > 0 && value[0].type.startsWith('image/');
            }
            return true;
        }),
    })
};
