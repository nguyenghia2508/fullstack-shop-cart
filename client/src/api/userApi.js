import axiosClient from './axiosClient'

const userApi = {
  addProduct: (data) => axiosClient.post(`api/add/${data.userInfor}`,({item : data.actionSubmit.item
    ,action: data.actionSubmit.action
    ,productNumber: data.productNumber})),
  deleteProduct: (data) => axiosClient.post(`api/delete/${data.userInfor}`,(data.actionSubmit)),
  getUserCart: (id) => axiosClient.get(`api/user/user-cart/${id}`),
  // checkOut: (user) => axiosClient.post(`api/user/check-out?user=${user}`)
}

export default userApi