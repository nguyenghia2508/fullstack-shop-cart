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

  getTypeTitle : () => axiosClient.get(`api/admin/add-type`),

  addType: (data) => axiosClient.post(`api/admin/add-type`,data),

  getListType: ({page}) => axiosClient.get(`api/admin/list-type/${page}`),

  getEditType: (id) => axiosClient.get(`api/admin/edit-type/${id}`),
  
  editType: ({id,data}) => axiosClient.post(`api/admin/edit-type/${id}`,data),

  deleteType: (id) => axiosClient.post(`api/admin/delete-type/${id}`),

  getListTransaction:  ({page}) => axiosClient.get(`api/admin/list-transaction/${page}`),

  getTransactionTitle : () => axiosClient.get(`api/admin/add-transaction`),

  addTransaction: (data) => axiosClient.post(`api/admin/add-transaction`,data),

  deleteTransaction: (id) => axiosClient.post(`api/admin/delete-transaction/${id}`),

  exportTransaction: ()  => axiosClient.post(`api/admin/export-transaction`),

  testFile: () => axiosClient.get(`api/test/test-file`)
}

export default adminApi