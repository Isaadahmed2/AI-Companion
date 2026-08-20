import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean;
  activeTheme: 'dark' | 'light';
  voiceModalOpen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  activeTheme: 'dark',
  voiceModalOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setVoiceModalOpen: (state, action: PayloadAction<boolean>) => {
      state.voiceModalOpen = action.payload
    }
  }
})

export const { toggleSidebar, setSidebarOpen, setVoiceModalOpen } = uiSlice.actions
export default uiSlice.reducer
