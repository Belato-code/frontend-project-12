import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import routes from '../routes'
import { useRef } from 'react'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [newMessages, setNewMessages] = useState([])
  const socketRef = useRef(null)
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

        await new Promise((resolve, reject) => {
          const timeOut = setTimeout(() => {
            reject(new Error('Превышено время ожидания!'))
          }, 10000)

          newSocket.once('connect', () => {
            clearTimeout(timeOut)
            resolve()
          })
          newSocket.once('connect_error', (error) => {
            clearTimeout(timeout)
            console.error('💥 Ошибка подключения:', error.message)
            reject(error)
          })
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
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, newMessages }}>
      {children}
    </SocketContext.Provider>
  )
}