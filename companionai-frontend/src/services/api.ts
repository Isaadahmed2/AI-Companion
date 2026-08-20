import axios, { AxiosInstance } from 'axios'
import { supabase } from '../config/supabase'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL,
      timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    })

    this.client.interceptors.request.use(
      async (config) => {
        try {
          const localToken = localStorage.getItem('companionai_token')
          if (localToken) {
            config.headers.Authorization = `Bearer ${localToken}`
          } else {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.access_token) {
              config.headers.Authorization = `Bearer ${session.access_token}`
            }
          }
        } catch (e) {
          // Continue without token
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('companionai_token')
        }
        return Promise.reject(error)
      }
    )
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T>(url, config).then(res => res.data)
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config).then(res => res.data)
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config).then(res => res.data)
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T>(url, config).then(res => res.data)
  }
}

export const apiClient = new APIClient()
