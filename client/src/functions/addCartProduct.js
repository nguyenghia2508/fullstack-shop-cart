// useAddProduct.js
import { toast } from 'react-toastify';
import userApi from '../api/userApi';
import { useDispatch } from 'react-redux';
import {setActionProduct} from '../redux/features/actionProductSlice'

const useAddCartProduct = () => {
  const dispatch = useDispatch();

  const addCartProduct = async ({ userInfor, item,productNumber }) => {
    try {
      const actionSubmit = {
        item,
        action: 'add',
      };

      if(userInfor)
      {
        const res = await userApi.addProduct({ userInfor, actionSubmit,productNumber });
        if (res.state === 'success') {
          dispatch(setActionProduct({item,action:'add'}));
          toast.success(res.message, {
            position: 'top-left',
            autoClose: 3000,
            style: { color: '$color-default', backgroundColor: '#fff' },
          });
        } else {
          toast.error(res.message, {
            position: 'top-left',
            autoClose: 3000,
            style: { color: '$color-default', backgroundColor: '#fff' },
          });
        }
      }
      else
      {
        toast.error('Need to login', {
          position: 'top-left',
          autoClose: 3000,
          style: { color: '$color-default', backgroundColor: '#fff' },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { addCartProduct };
};

export default useAddCartProduct;
