import axiosClient from './axiosClient'

const productApi = {
  getFirstProduct: () => axiosClient.get('api/'),
  getProduct: (id,user,page) => axiosClient.get(`api/product/${id}/page/${page ? page : 1}?user=${user}`),

  submitReview: (id,user,reviewText,rating) => axiosClient.post(`api/product/${id}?user=${user}`,{reviewText,rating}),

  getListProduct: ({page,sortBy,perPage,listType,minPrice,maxPrice}) => 
  axiosClient.get(`api/store/page/${page}?sortBy=${sortBy ? sortBy : 0}&perPage=${perPage ? perPage : 3}&listType=${listType && listType.length !== 0 ? JSON.stringify(listType) : []}&minPrice=${minPrice ? minPrice : 0}&maxPrice=${maxPrice ? maxPrice : 0}`),

  filterListProduct : ({listType,minPrice,maxPrice,sortBy,perPage,page}) => 
  axiosClient.post(`api/store/page/${page}`,{listType,minPrice,maxPrice,sortBy,perPage,page}),

  getTypeProduct : () => axiosClient.get(`api/getAllType`),
}

export default productApi