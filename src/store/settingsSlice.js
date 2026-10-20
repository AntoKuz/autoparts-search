import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { apiKey: import.meta.env.VITE_API_KEY || '' },
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload.trim()
    },
  },
})

export const { setApiKey } = settingsSlice.actions
export default settingsSlice.reducer
