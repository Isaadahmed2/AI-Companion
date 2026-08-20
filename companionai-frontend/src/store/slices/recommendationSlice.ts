import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RecommendationItem } from '../../types'

interface RecommendationState {
  items: RecommendationItem[];
  selectedCategory: string;
  isLoading: boolean;
}

const initialState: RecommendationState = {
  items: [],
  selectedCategory: 'all',
  isLoading: false,
}

export const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<RecommendationItem[]>) => {
      state.items = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setRecLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  }
})

export const { setRecommendations, setSelectedCategory, setRecLoading } = recommendationSlice.actions
export default recommendationSlice.reducer
