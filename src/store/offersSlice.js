import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { requestParts } from '../api/partsApi'
import { fetchBrands, resetBrands } from './brandsSlice'

function toOffers(good, isAnalogue) {
  const base = {
    brand: good.brand,
    number: good.number,
    name: good.name,
    isAnalogue,
  }
  const warehouses = Array.isArray(good.warehouses) ? good.warehouses : []
  if (!warehouses.length) {
    return [{ ...base, id: `${good.goodsID}-none`, warehouse: '—', price: good.price, stock: good.count ?? 0, shipmentDate: null }]
  }
  return warehouses.map((w, index) => ({
    ...base,
    id: `${good.goodsID}-${w.id ?? index}`,
    warehouse: w.code || (w.own ? 'Собственный склад' : 'Склад партнёра'),
    price: w.price,
    stock: w.stock ?? 0,
    shipmentDate: w.shipmentDate || null,
  }))
}

export const fetchOffers = createAsyncThunk(
  'offers/fetch',
  async ({ number, brand }, { getState, signal }) => {
    const { apiKey } = getState().settings
    const goods = await requestParts({ key: apiKey, number, brand, analogues: true, signal })
    const rows = []
    goods.forEach((good) => {
      rows.push(...toOffers(good, false))
      ;(good.analogues || []).forEach((analogue) => rows.push(...toOffers(analogue, true)))
    })
    return rows
  }
)

const initialState = { brand: null, items: [], status: 'idle', error: null, requestId: null }

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state, action) => {
        state.brand = action.meta.arg.brand
        state.requestId = action.meta.requestId
        state.status = 'loading'
        state.error = null
        state.items = []
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId || action.meta.aborted) return
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchBrands.pending, () => initialState)
      .addCase(resetBrands, () => initialState)
  },
})

export default offersSlice.reducer
