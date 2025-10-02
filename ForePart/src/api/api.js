import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",  //update in production
});

// Attach Access Token Automaically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;