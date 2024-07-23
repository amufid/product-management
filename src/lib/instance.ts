'use server'
import axios from "axios";
import { cookies } from 'next/headers'

const axiosInstance = axios.create({
   baseURL: 'http://localhost:5000/api'
})

axiosInstance.interceptors.request.use((config) => {
   const accessToken = cookies().get('accessToken')

   if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken.value}`
   }
   return config;
}, error => {
   return Promise.reject(error);
})

export default axiosInstance;

