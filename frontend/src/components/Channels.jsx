import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef } from "react"
import { ChannelButton } from "./ChannelButton"
import { useGetChannelsQuery } from "../store/api/baseApi"
import { Spinner } from "react-bootstrap"
import { actions as channelsActions } from "../store/slices/channelsSlice"

export const Channels = () => {
  const { setChannelId, addChannels } = channelsActions
  const dispatch = useDispatch()
  const { data: channels = [], error, isLoading, isError } = useGetChannelsQuery()
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  useSelector(console.log)

  useEffect(() => {
    if (channels.length > 0) {
      dispatch(addChannels(channels))
    }
    if (currentChannelId === null || currentChannelId === undefined) {
      dispatch(setChannelId(channels[0]?.id ))
    }
  }, [channels, currentChannelId, dispatch])

  if (isLoading) {
    return (
      <div className="channels-box flex-column px-2 mb-3 list-unstyled" id="channels-box">
        <Spinner />
      </div>
    )
  }
  
  if (isError) {
    return (
      <div className="channels-box flex-column px-2 mb-3 list-unstyled" id="channels-box">
        <div className="text-center py-3 text-danger">
          Error loading channels: {error?.message || 'Unknown error'}
        </div>
      </div>
    )
  }

  const handleChannelSelect = (channelId) => {
    dispatch(setChannelId(channelId))
  }

  return (
    <div className="channels-box flex-column px-2 mb-3 list-unstyled" id="channels-box">
      {channels.map((channel) => (
        <ChannelButton
          key={channel.id}
          channel={channel}
          isSelected={currentChannelId === channel.id}
          onSelect={ handleChannelSelect }
        />
      ))}
    </div>
  )
}
