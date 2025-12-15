import { io } from 'socket.io-client';
import store from '../index'
import { actions as messagesAcrions } from "../slices/messagesSlice";


const { addMessage } = messagesAcrions
const { dispatch } = store
const socket = io()

socket.on('newMessage', (payload) => {
  dispatch(addMessage(payload))
})

export default chatApi = {
  sendMessage: async (message) => new Promise((resolve, reject) => {
    socket.on('newMessage', message, (response) => {
      if (response.error) {
        reject(new Error(response.error))
      }
      else {
        resolve(response)
      }
    })
  })
}