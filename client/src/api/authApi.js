import axiosClient from "./axiosClient"

const authApi = {
  register: params => axiosClient.post('api/user/register', params),
  login: params => axiosClient.post('api/user/login', params),
  verifyToken: () => axiosClient.post('api/user/verify-token')
}

export default authApi
