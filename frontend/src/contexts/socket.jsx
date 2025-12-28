import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import routes from '../routes'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import store from '../store'
import baseApi from '../store/api/baseApi'

const SocketContext = createContext()

const websocket = () => {
  const host = window.location.host 
  const protocol = window.location.protocol 

  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${wsProtocol}//${host}`
  
  return wsUrl
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const socketRef = useRef(null)
  const dispatch = useDispatch()
  let newSocket

  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) return

        const baseUrl = websocket(routes.websocketUrl())
        
        newSocket = io(baseUrl, {
          auth: { token: `Bearer ${token}` },
          transports: ['websocket', 'polling'],
          reconnection: true,
          debug: true
        })

        socketRef.current = newSocket

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Превышено время ожидания!'))
          }, 10000)

          newSocket.once('connect', () => {
            setSocket(newSocket)
            clearTimeout(timeout)
            resolve()
          })

          newSocket.once('connect_error', (error) => {
            clearTimeout(timeout)
            console.error('💥 Ошибка подключения:', error.message)
            reject(error)
          })
        })

        newSocket.on('newChannel', (newChannel) => {
          store.dispatch(
            baseApi.util.updateQueryData(
              'getChannels',
              undefined,
              (draft) => {
                const exists = draft.some(ch => ch.id === newChannel.id)
                if (!exists) {
                  draft.push(newChannel)
                }
              }
            )
          )
        })

        newSocket.on('removeChannel', ({ id }) => {          
          store.dispatch(
            baseApi.util.updateQueryData(
              'getChannels',
              undefined,
              (draft) => {
                return draft.filter(ch => ch.id !== id)
              }
            )
          )
        })

        newSocket.on('renameChannel', (updatedChannel) => {
          store.dispatch(
            baseApi.util.updateQueryData(
              'getChannels',
              undefined,
              (draft) => {
                const index = draft.findIndex(ch => ch.id === updatedChannel.id)
                if (index !== -1) {
                  draft[index] = updatedChannel
                }
              }
            )
          )
        })

      newSocket.on('newMessage', (newMessage) => {

        store.dispatch(
          baseApi.util.updateQueryData(
            'getMessages',
            undefined,
            (draft = []) => {
              draft.push(newMessage)
            }
          )
        )
        store.dispatch(baseApi.util.invalidateTags(['Message']))
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
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}