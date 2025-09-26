import axios from "axios";

const BASE_URL = import.meta.env.MODE === "developmet" ? "http://localhost:5001/api" : "/api"
export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials:true,// send cookies with the request
});

// src/lib/axios.js
// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "http://localhost:5001/api",
// });

// // Attach JWT automatically if available
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
