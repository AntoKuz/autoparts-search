import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { requestParts } from '../api/partsApi'

export const fetchBrands = createAsyncThunk(
  'brands/fetch',
  async (number, { getState, signal }) => {
    const { apiKey } = getState().settings
    const goods = await requestParts({ key: apiKey, number, signal })
    const map = new Map()
    goods.forEach((good) => {
      if (!good.brand || map.has(good.brand)) return
      map.set(good.brand, { brand: good.brand, number: good.number, name: good.name })
    })
    return Array.from(map.values())
  }
)

const brandsSlice = createSlice({
  name: 'brands',
  initialState: { number: '', items: [], status: 'idle', error: null },
  reducers: {
    resetBrands: (state) => {
      state.number = ''
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.number = action.meta.arg
        state.status = 'loading'
        state.error = null
        state.items = []
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (state.number !== action.meta.arg) return
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (state.number !== action.meta.arg || action.meta.aborted) return
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { resetBrands } = brandsSlice.actions
export default brandsSlice.reducer
