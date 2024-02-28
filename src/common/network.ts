import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 15000
})

export const msgApi = (msg: string) => {
    return axiosInstance.get('/msg/' + msg)
}
