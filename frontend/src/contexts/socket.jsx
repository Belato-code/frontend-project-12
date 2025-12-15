import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import routes from '../routes'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  return context // Просто возвращаем, без проверки
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [newMessages, setNewMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let newSocket
    let mounted = true

    const initSocket = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) return

        // Асинхронно загружаем socket.io если нужно
        let io
        if (window.io) {
          io = window.io
        } else {
          const socketModule = await import('socket.io-client')
          io = socketModule.io || socketModule.default
        }

        const baseUrl = routes.websocketUrl()
        
        newSocket = io(baseUrl, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnection: true,
          debug: true
        })

        if (!mounted) return

        setSocket(newSocket)

        // 🔥 ВАЖНО: Сначала подписываемся, потом ждём connect
        newSocket.on('newMessage', (data) => {
          console.log('📨 [SocketProvider] newMessage получено:', data)
          setNewMessages(prev => [...prev, data])
        })

        // Подписка на ВСЕ события для отладки
        newSocket.onAny((event, ...args) => {
          console.log(`🔍 [SocketProvider ANY] ${event}`, args)
        })

        newSocket.on('connect', () => {
          console.log('🎉 Сокет подключен! ID:', newSocket.id)
          setIsConnected(true)
        })

        newSocket.on('connect_error', (error) => {
          console.error('💥 Ошибка подключения:', error)
        })

      } catch (error) {
        console.error('💥 Ошибка инициализации сокета:', error)
      }
    }

    initSocket()

    return () => {
      mounted = false
      if (newSocket) {
        console.log('🧹 Очистка сокета')
        newSocket.disconnect()
      }
    }
  }, []) // Пустой массив зависимостей

  return (
    <SocketContext.Provider value={{ socket, newMessages, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}