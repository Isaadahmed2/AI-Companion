import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setUser, setLoading, setError, clearAuth } from '../store/slices/authSlice'
import * as authService from '../services/auth'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setLoading(true))
      const res = await authService.login(email, password)
      if (res?.user) {
        dispatch(setUser(res.user))
      }
      return res
    } catch (err: any) {
      dispatch(setError(err?.response?.data?.detail || err.message || 'Login failed'))
      throw err
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const signup = useCallback(async (email: string, password: string, displayName?: string, interests?: string[]) => {
    try {
      dispatch(setLoading(true))
      const res = await authService.signup(email, password, displayName, interests)
      if (res?.user) {
        dispatch(setUser(res.user))
      }
      return res
    } catch (err: any) {
      dispatch(setError(err?.response?.data?.detail || err.message || 'Signup failed'))
      throw err
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (e) {
      // Continue cleanup
    } finally {
      dispatch(clearAuth())
    }
  }, [dispatch])

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    logout
  }
}
