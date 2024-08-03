import axios, { type AxiosError } from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

export default api


api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message: string }>) => {
        throw new Error(error.response?.data.message);
    },
);