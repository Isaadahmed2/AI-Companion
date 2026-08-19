import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setCurrentResult, setHistory, setMoodLoading, setMoodError } from '../store/slices/moodSlice'
import { setRecommendations } from '../store/slices/recommendationSlice'
import * as moodService from '../services/moods'

export const useMood = () => {
  const dispatch = useDispatch()
  const { currentResult, history, isLoading, error } = useSelector(
    (state: RootState) => state.mood
  )

  const submitMoodCheckin = useCallback(async (data: {
    mood_level: number;
    message?: string;
    voice_input?: boolean;
  }) => {
    try {
      dispatch(setMoodLoading(true))
      const result = await moodService.submitCheckin(data)
      dispatch(setCurrentResult(result))
      if (result.recommendations) {
        dispatch(setRecommendations(result.recommendations))
      }
      return result
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err.message || 'Check-in failed'
      dispatch(setMoodError(msg))
      throw err
    } finally {
      dispatch(setMoodLoading(false))
    }
  }, [dispatch])

  const fetchMoodHistory = useCallback(async () => {
    try {
      dispatch(setMoodLoading(true))
      const logs = await moodService.getMoodLogs()
      dispatch(setHistory(logs))
      return logs
    } catch (err: any) {
      dispatch(setMoodError(err.message))
      return []
    } finally {
      dispatch(setMoodLoading(false))
    }
  }, [dispatch])

  return {
    currentResult,
    history,
    isLoading,
    error,
    submitMoodCheckin,
    fetchMoodHistory
  }
}
