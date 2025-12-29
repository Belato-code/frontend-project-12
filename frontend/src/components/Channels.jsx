import { useEffect, useRef } from 'react'
import { ChannelButton } from './ChannelButton'
import { Spinner } from 'react-bootstrap'
import { useGetChannelsQuery } from '../store/api/baseApi'
import { setCurrentChannelId } from '../store/slices/uiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export const Channels = () => {
  const dispatch = useDispatch()
  const { data: channels = [], error, isLoading, isError } = useGetChannelsQuery()
  const endRef = useRef()
  const { t } = useTranslation()

  const currentChannelId = useSelector((state) => state.ui.currentChannelId)

  useEffect(() => {
    if (channels.length > 0 && !currentChannelId) {
      dispatch(setCurrentChannelId(channels[0].id))
    }
  }, [channels, currentChannelId, dispatch])

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannelId(channelId))
  }

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [channels])

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="channels-box flex-column px-2 mb-3 list-unstyled" id="channels-box">
        <div className="text-center py-3 text-danger">
          {t('channel.error.loading')}
          {' '}
          {error?.message || t('channel.error.unknown')}
        </div>
      </div>
    )
  }

  return (
    <div className="h-100 d-flex flex-column">
      <ul
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
        id="channels-box"
      >
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <ChannelButton
              channel={channel}
              isSelected={currentChannelId === channel.id}
              onSelect={handleChannelSelect}
            />
          </li>
        ))}
        <div ref={endRef} />
      </ul>
    </div>
  )
}
