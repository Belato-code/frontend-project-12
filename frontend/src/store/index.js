import { configureStore } from "@reduxjs/toolkit"
import messagesReducer from "./slices/messagesSlice"
import channelsReducer from "./slices/channelsSlice"
import baseApi from "./api/baseApi"

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]:baseApi.reducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(baseApi.middleware)
  }
})

export default store