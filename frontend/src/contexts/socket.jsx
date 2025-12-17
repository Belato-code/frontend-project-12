import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import routes from '../routes'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [newMessages, setNewMessages] = useState([])
  let newSocket

  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) return

        const baseUrl = routes.websocketUrl()
        
        newSocket = io(baseUrl, {
          auth: { token: `Bearer ${token}` },
          transports: ['websocket', 'polling'],
          reconnection: true,
          debug: true
        })

        setSocket(newSocket)

        newSocket.on('newMessage', (data) => {
          console.log('📨 Получено новое сообщение от сервера:', data)
          setNewMessages(prev => [...prev, data])
        })

      } catch (error) {
        console.error('💥 Ошибка инициализации сокета:', error)
      }
    }

    initSocket()

    return () => {
      if (newSocket) {
        console.log('🧹 Очистка сокета')
        newSocket.disconnect()
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, newMessages }}>
      {children}
    </SocketContext.Provider>
  )
}