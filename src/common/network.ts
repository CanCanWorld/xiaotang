import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 20000
})

export const msgApi = (msg: string) => {
    return axiosInstance.get('/msg/' + msg)
}
