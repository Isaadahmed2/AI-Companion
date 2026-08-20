import { apiClient } from './api'
import { User } from '../types'

export const login = async (email: string, password: string) => {
  const data = await apiClient.post('/auth/login', { email, password })
  if (data?.access_token) {
    localStorage.setItem('companionai_token', data.access_token)
  }
  return data
}

export const signup = async (email: string, password: string, displayName?: string, interests?: string[]) => {
  const data = await apiClient.post('/auth/signup', {
    email,
    password,
    display_name: displayName,
    interests: interests || []
  })
  if (data?.access_token) {
    localStorage.setItem('companionai_token', data.access_token)
  }
  return data
}

export const getProfile = async (): Promise<User> => {
  return apiClient.get('/auth/me')
}

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  return apiClient.put('/users/profile', profileData)
}

export const logout = async () => {
  localStorage.removeItem('companionai_token')
  return apiClient.post('/auth/logout')
}
