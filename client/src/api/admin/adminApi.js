import axiosClient from "../axiosClient"

const adminApi = {

  getListProduct: ({page}) => axiosClient.get(`api/admin/list-product/${page}`),
  
  getListUser: ({page}) => axiosClient.get(`api/admin/list-user/${page}`),

  getAddTitle : () =>  axiosClient.get(`api/admin/add-product`),

  addProduct: (data) => axiosClient.post(`api/admin/add-product`,data),

  detailProduct: (id) => axiosClient.get(`api/admin/detail-product/${id}`),

  getEditProduct: (id) => axiosClient.get(`api/admin/edit-product/${id}`),

  editProduct: ({id,data}) => axiosClient.post(`api/admin/edit-product/${id}`,data),

  deleteProduct: (id) => axiosClient.post(`api/admin/delete-product/${id}`),
}

export default adminApi