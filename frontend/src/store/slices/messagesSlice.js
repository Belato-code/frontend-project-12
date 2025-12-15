import { createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { actions as channelActions } from "./channelsSlice"

const messagesAdapter = createEntityAdapter()

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),

  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder.addCase(channelActions.removeChannel, (state, action) => {
      const channelId = action.payload
      const updateMessages = Object.fromEntries(state.entities).filter(e => e.channelId != channelId)
      messagesAdapter.setAll(state, updateMessages)
    })
  }
})

export const { actions } = messagesSlice
export default messagesSlice.reducer