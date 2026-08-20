import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: 'demo-user-1',
    email: 'user@companionai.app',
    display_name: 'Alex Rivera',
    interests: ['mindfulness', 'music', 'lo-fi'],
    onboarding_completed: true
  },
  isAuthenticated: true,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    }
  }
})

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions
export default authSlice.reducer
