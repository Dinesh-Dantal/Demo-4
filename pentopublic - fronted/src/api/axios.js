import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44357/api", // ✅ Backend Swagger port
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
