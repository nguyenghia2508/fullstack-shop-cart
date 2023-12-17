import axiosClient from './axiosClient'

const productApi = {
  getFirstProduct: () => axiosClient.get('api/'),
  // updatePositoin: (params) => axiosClient.put('boards', params),
  getProduct: (id,user,page) => axiosClient.get(`api/product/${id}/page/${page && page}?user=${user}`),

  submitReview: (id,user,reviewText,rating) => axiosClient.post(`api/product/${id}?user=${user}`,{reviewText,rating}),

  getListProduct: ({page,sortBy,perPage,listType,minPrice,maxPrice}) => 
  axiosClient.get(`api/store/page/${page}?sortBy=${sortBy ? sortBy : 0}&perPage=${perPage ? perPage : 3}&listType=${listType && listType.length !== 0 ? JSON.stringify(listType) : []}&minPrice=${minPrice ? minPrice : 0}&maxPrice=${maxPrice ? maxPrice : 0}`),

  filterListProduct : ({listType,minPrice,maxPrice,sortBy,perPage,page}) => 
  axiosClient.post(`api/store/page/${page}`,{listType,minPrice,maxPrice,sortBy,perPage,page}),

  getTypeProduct : () => axiosClient.get(`api/getAllType`),
  
  // delete: (id) => axiosClient.delete(`boards/${id}`),
  // update: (id, params) => axiosClient.put(`boards/${id}`, params),
  // getFavourites: () => axiosClient.get('boards/favourites'),
  // updateFavouritePosition: (params) => axiosClient.put('boards/favourites', params)
}

export default productApi