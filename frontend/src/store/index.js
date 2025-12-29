import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import baseApi from './api/baseApi'

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(baseApi.middleware)
  },
})

export default store
