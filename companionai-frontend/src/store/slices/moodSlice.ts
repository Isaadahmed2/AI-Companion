import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MoodCheckinResult, MoodLog } from '../../types'

interface MoodState {
  currentResult: MoodCheckinResult | null;
  history: MoodLog[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  currentResult: null,
  history: [],
  isLoading: false,
  error: null,
}

export const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    setCurrentResult: (state, action: PayloadAction<MoodCheckinResult | null>) => {
      state.currentResult = action.payload
      state.error = null
    },
    setHistory: (state, action: PayloadAction<MoodLog[]>) => {
      state.history = action.payload
    },
    setMoodLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setMoodError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

export const { setCurrentResult, setHistory, setMoodLoading, setMoodError } = moodSlice.actions
export default moodSlice.reducer
