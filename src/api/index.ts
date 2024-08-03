import axios, { type AxiosError } from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

export default api


api.interceptors.response.use(
    (response) => {
        const token = window.localStorage.getItem('token');
        const expirationTime = localStorage.getItem('expiration-time');

        if (expirationTime && new Date().getTime() > new Date(expirationTime).getTime()) {
            window.localStorage.removeItem('token');
            window.location.href = '/sign-in';
            return Promise.reject(new Error('Token expired'));
        }

        if (token) {
            response.headers['x-pendapatan'] = token.replace(/"/g, "");
        } else {
            delete response.headers['x-pendapatan'];
        }
        return response
    },
    (error: AxiosError<{ message: string }>) => {
        throw new Error(error.response?.data.message);
    },
);