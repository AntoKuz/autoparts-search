import { configureStore } from '@reduxjs/toolkit'
import brands from './brandsSlice'
import offers from './offersSlice'
import settings from './settingsSlice'

export const store = configureStore({
  reducer: { brands, offers, settings },
})
