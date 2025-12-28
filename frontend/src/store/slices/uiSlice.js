import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentChannelId: null,
    modal: {
      isOpen: false,
      id: null,
      type: null,
    }
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
    setOpen: (state, action) => {
      const { type, id } = action.payload
      state.modal = {
        id: id || null,
        type,
        isOpen: true,
      }
    },
    setClose: (state) => {
      state.modal = {
        isOpen: false,
        id: null,
        type: null,
      }
    }
  },
})

export const { setCurrentChannelId, setOpen, setClose } = uiSlice.actions
export default uiSlice.reducer