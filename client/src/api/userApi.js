import axiosClient from './axiosClient'
import axiosClientForDjango from './axiosClientForDjango'
const userApi = {
  addProduct: (data) => axiosClient.post(`api/add/${data.userInfor}`,({item : data.actionSubmit.item
    ,action: data.actionSubmit.action
    ,productNumber: data.productNumber})),
  deleteProduct: (data) => axiosClient.post(`api/delete/${data.userInfor}`,(data.actionSubmit)),
  getUserCart: (id) => axiosClient.get(`api/user/user-cart/${id}`),
  recommendProduct: ({id}) => axiosClientForDjango.get(`api/user/recommend-product/${id}/`),
}

export default userApi