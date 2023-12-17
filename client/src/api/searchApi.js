import axiosClient from './axiosClient'

const searchApi = {

  searchItem : ({item,category}) => axiosClient.post(`api/search-item`,{item,category}),

  getSearchItem: ({page,item,category}) => axiosClient.get(`api/search/page/${page ? page : 1}?item=${item}&category=${category}`),
}

export default searchApi