import axios from 'axios'
import queryString from 'query-string'

const baseUrl = 'https://shop-cart-vercel-api.vercel.app'
const getToken = () => localStorage.getItem('token')

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: params => queryString.stringify({ params })
})

axiosClient.interceptors.request.use(async config => {
  if (config.data instanceof FormData) {
    return {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `Bearer ${getToken()}`
      }
    }
  }
  else
  {
    return {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${getToken()}`
      }
    }
  }
})

axiosClient.interceptors.response.use(response => {
  if (response && response.data) return response.data
  return response
}, err => {
  if (!err.response) {
    return alert(err)
  }
  throw err.response
})

export default axiosClient