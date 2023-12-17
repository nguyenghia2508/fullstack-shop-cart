$(document).ready(function(){
    $("form").submit(function(e){
        const axiosClient = axios.create({
            baseURL: window.location.href,
            paramsSerializer: params => queryString.stringify({ params })
        })
        const getToken = () => localStorage.getItem('token')
        console.log(getToken())
        axiosClient.interceptors.request.use(async config => {
            return {
                ...config,
                headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${getToken()}`
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
    });
});