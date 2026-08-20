import { apiClient } from './api'

export const getSocialMatches = async () => {
  return apiClient.get('/social/matches')
}

export const getClubs = async () => {
  return apiClient.get('/social/clubs')
}

export const joinClub = async (id: string) => {
  return apiClient.post(`/social/clubs/${id}/join`)
}
