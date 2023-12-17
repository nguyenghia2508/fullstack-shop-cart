// useAddProduct.js
import { toast } from 'react-toastify';
import userApi from '../api/userApi';
import { useDispatch } from 'react-redux';
import {setActionProduct} from '../redux/features/actionProductSlice'

const useDeleteCartProduct = () => {
  const dispatch = useDispatch();

  const deleteCartProduct = async ({ userInfor, item }) => {
    try {
      const actionSubmit = {
        item,
        action: 'delete',
      };

      if(userInfor)
      {
        const res = await userApi.deleteProduct({ userInfor, actionSubmit });

        if (res.state === 'success') {
          dispatch(setActionProduct({item,action:'delete'}));
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

  return { deleteCartProduct };
};

export default useDeleteCartProduct;
