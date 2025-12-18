const apiPath = '/api/v1'

const websocket = () => {
  // 1. Всегда используем текущий хост
  const host = window.location.host // 'slack-chat-lsgl.onrender.com'
  const protocol = window.location.protocol // 'https:'
  
  // 2. Конвертируем HTTPS → WSS, HTTP → WS
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${wsProtocol}//${host}`
  
  console.log('🌐 Текущий протокол:', protocol)
  console.log('🔗 WebSocket URL:', wsUrl)
  
  return wsUrl
}

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  websocketUrl: websocket,
}
