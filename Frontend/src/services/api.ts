import axios from "axios";

export const API = axios.create({
    baseURL: "https://syncdoc.onrender.com"
});
