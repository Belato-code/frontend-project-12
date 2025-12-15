import { createSlice, createEntityAdapter,createSelector } from "@reduxjs/toolkit"

const channelsAdapter = createEntityAdapter()

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ currentChannelId: null }),
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
    setChannelId: (state, { payload }) => ({ ...state, currentChannelId: payload }),
  }
})

export const {
  selectAll: selectAllChannels,
  selectById: selectChannelById,
  selectIds: selectChannelIds,
  selectEntities: selectChannelEntities,
  selectTotal: selectTotalChannels,
} = channelsAdapter.getSelectors(state => state.channels)

export const { actions } = channelsSlice
export default channelsSlice.reducer
export const selectCurrentChannel = createSelector(
  [state => state.channels.currentChannelId, selectChannelEntities],
  (currentId, entities) => entities[currentId]
)