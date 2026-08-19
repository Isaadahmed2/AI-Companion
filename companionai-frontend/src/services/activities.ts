import { apiClient } from './api'
import { Activity } from '../types'

export const getActivities = async (category?: string): Promise<Activity[]> => {
  const url = category ? `/activities/?category=${encodeURIComponent(category)}` : '/activities/'
  return apiClient.get(url)
}

export const startActivity = async (id: string) => {
  return apiClient.post(`/activities/${id}/start`)
}

export const completeActivity = async (id: string) => {
  return apiClient.post(`/activities/${id}/complete`)
}

export const getGoals = async () => {
  return apiClient.get('/goals/')
}

export const completeGoal = async (id: string) => {
  return apiClient.post(`/goals/${id}/complete`)
}
