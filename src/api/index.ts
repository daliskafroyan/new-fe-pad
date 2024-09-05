import { useAuthStore } from '@/store/authStore';
import axios, { type AxiosError } from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

export default api;

api.interceptors.response.use(
    (response) => {
        const { token, expirationTime, clearAuth } = useAuthStore.getState();

        if (expirationTime && new Date().getTime() > new Date(expirationTime).getTime()) {
            clearAuth();
            window.location.href = '/sign-in';
            return Promise.reject(new Error('Token expired'));
        }

        if (token) {
            response.headers['x-pendapatan'] = token.replace(/"/g, "");
        } else {
            delete response.headers['x-pendapatan'];
        }
        return response;
    },
    (error: AxiosError<{ message: string }>) => {
        // if (error.response?.data.message === 'Token expired') {
        //     const { clearAuth } = useAuthStore.getState();
        //     clearAuth();
        //     window.location.href = '/sign-in';
        // }
        throw new Error(error.response?.data.message);
    },
);