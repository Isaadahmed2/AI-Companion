import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import moodReducer from './slices/moodSlice'
import recommendationReducer from './slices/recommendationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mood: moodReducer,
    recommendations: recommendationReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
