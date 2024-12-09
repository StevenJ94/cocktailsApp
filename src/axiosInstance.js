import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.thecocktaildb.com/api/json/v1/1/", // URL base para tus rutas
  timeout: 5000, // Tiempo de espera opcional
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
