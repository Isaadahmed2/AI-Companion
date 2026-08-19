import { apiClient } from './api'
import { MoodCheckinResult, MoodLog } from '../types'

export const submitCheckin = async (data: {
  mood_level: number;
  message?: string;
  voice_input?: boolean;
}): Promise<MoodCheckinResult> => {
  return apiClient.post('/moods/checkin', data)
}

export const getMoodLogs = async (): Promise<MoodLog[]> => {
  return apiClient.get('/moods/logs')
}

export const getMoodTrends = async () => {
  return apiClient.get('/moods/trends')
}

export const getMoodInsights = async () => {
  return apiClient.get('/moods/insights')
}

export const deleteMoodLog = async (id: string) => {
  return apiClient.delete(`/moods/logs/${id}`)
}
