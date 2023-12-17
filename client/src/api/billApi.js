import axiosClient from './axiosClient'

const billApi = {
  submitBill: (data,user) => axiosClient.post(`api/user/check-out?user=${user}`, data),
}

export default billApi