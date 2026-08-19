import { apiClient } from './api'
import { RecommendationItem } from '../types'

export const getRecommendations = async (emotion: string = 'calm'): Promise<RecommendationItem[]> => {
  return apiClient.get(`/recommendations/?emotion=${encodeURIComponent(emotion)}`)
}

export const getTrendingRecommendations = async (): Promise<RecommendationItem[]> => {
  return apiClient.get('/recommendations/trending')
}

export const trackRecommendationClick = async (id: string) => {
  return apiClient.post(`/recommendations/${id}/click`)
}
