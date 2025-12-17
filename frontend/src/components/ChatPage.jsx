import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useGetMesagesQuery } from '../store/api/baseApi'
import { Channels } from "./Channels"
import { useSelector } from "react-redux"
import { selectCurrentChannel } from "../store/slices/channelsSlice"
import { MessageForm } from "./chatComponents/messages/MessageForm"
import { MessagesList } from "./chatComponents/messages/MessagesList"
import { useSocket } from "../contexts/socket"
import { useTranslation } from 'react-i18next'

export const ChatPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = localStorage.getItem('authToken')
  const { data: apiMessages = [] } = useGetMesagesQuery()
  const selectedChannel = useSelector(selectCurrentChannel)
  
  const { socket, newMessages } = useSocket()
  
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])
  
  const allMessages = [...apiMessages, ...newMessages]
  const filtredMessages = allMessages.filter(message => message.channelId === selectedChannel?.id)
  
  useEffect(() => {
    console.log('🟡 ChatPage: socket ID:', socket?.id)
    console.log('🟡 ChatPage: newMessages:', newMessages)
    console.log('🟡 ChatPage: apiMessages count:', apiMessages.length)
    console.log('🟡 ChatPage: allMessages count:', allMessages.length)
  }, [socket, newMessages, apiMessages])
  
  return (
    <Container className="mt-4 overflow-hidden vh-80">
      <Row className="h-100">
        <Col xs="2" className="h-100 d-inline-block p-0 bg-secondary-subtle border border-dark-subtle">
          <div className="channels">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4 align-items-center">
              <b className="fs-3 text-warning-emphasis">Каналы</b>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical border-primary rounded-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                <span className="visually-hidden">+</span>
              </button>
            </div>
            <Channels />
          </div>
        </Col>
        <Col className="h-100 p-0 d-inline-block border border-dark-subtle">
          <div className="h-100 d-flex flex-column justify-content-between">
            <div className="header bg-secondary-subtle p-3 shadow-sm">
              <span className="fs-5 fw-bold text-warning-emphasis">
                # {selectedChannel?.name || 'Выберите канал'}
              </span>
              <div id="counter" className="mt-2">
                {filtredMessages.length} {t('chatPage.messages.mes', {count: filtredMessages.length})}
              </div>
            </div>
            <MessagesList messages={filtredMessages} />
            <MessageForm 
              selectedChannelId={selectedChannel?.id} 
              socket={socket}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}