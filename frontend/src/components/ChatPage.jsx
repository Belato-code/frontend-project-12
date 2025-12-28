import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useGetChannelsQuery, useGetMessagesQuery } from '../store/api/baseApi'
import { Channels } from "./Channels"
import { useDispatch, useSelector } from "react-redux"
import { MessageForm } from "./chatComponents/messages/MessageForm"
import { MessagesList } from "./chatComponents/messages/MessagesList"
import { useSocket } from "../contexts/socket"
import { useTranslation } from 'react-i18next'
import getModal from './chatComponents/modals/index'
import { setClose, setCurrentChannelId, setOpen } from "../store/slices/uiSlice"

export const renderModal = ({ modalInfo, hideModal, channels }) => {
  if (!modalInfo?.type) return null

  const ModalComponent = getModal(modalInfo.type)
  return <ModalComponent modalInfo={modalInfo} onHide={hideModal} channels={channels} />
}

export const ChatPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch() 
  
  const token = localStorage.getItem('authToken')
  const { data: messages = [] } = useGetMessagesQuery()
  const { data: channels = [] } = useGetChannelsQuery()
  
  const currentChannelId = useSelector(state => state.ui.currentChannelId)
  const modalInfo = useSelector(state => state.ui.modal)
  console.log('modal', modalInfo)
  
  const hideModal = () => {
    dispatch(setClose())
  }
  
  const showModal = (type, id = null) => {
    dispatch(setOpen({ type, id }))
  }
  const { socket } = useSocket()


  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  useEffect(() => {
    if (channels.length > 0 && !currentChannelId) {

      dispatch(setCurrentChannelId(channels[0].id))
    }
  }, [channels, currentChannelId, dispatch])

  const filteredMessages = messages.filter(m => m.channelId === currentChannelId)
  
  const selectedChannel = channels.find(ch => ch.id === currentChannelId)
  
  return (
    <Container className="mt-4 overflow-hidden vh-80">
      <Row className="h-100">
        <Col xs="3" className="h-100 d-inline-block p-0 bg-secondary-subtle border border-dark-subtle">
          <div className="channels h-100 d-flex flex-column">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4 align-items-center">
              <b className="fs-3 text-warning-emphasis">{t('channel.header')}</b>
              <button
                type="button"
                onClick={() => showModal('adding')}
                className="p-0 text-primary btn btn-group-vertical border-primary rounded-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <div className="flex-grow-1 overflow-hidden d-flex flex-column">
              <div className="overflow-auto flex-grow-1">
                <Channels />
              </div>
            </div>
          </div>
        </Col>
        
        <Col className="h-100 p-0 d-inline-block border border-dark-subtle">
          <div className="h-100 d-flex flex-column justify-content-between">
            <div className="header bg-secondary-subtle p-3 shadow-sm">
              <span className="fs-5 fw-bold text-warning-emphasis">
                # {selectedChannel?.name || 'Выберите канал'}
              </span>
              <div id="counter" className="mt-2">
                {filteredMessages.length} {t('chatPage.messages.mes', {count: filteredMessages.length})}
              </div>
            </div>
            <div className="flex-grow-1 overflow-auto">
              <MessagesList messages={filteredMessages} />
            </div>
            
            <MessageForm 
              selectedChannelId={currentChannelId} 
              socket={socket}
            />
          </div>
        </Col>
      </Row>
      {renderModal({ modalInfo, hideModal, channels })}
    </Container>
  )
}