const apiPath = '/api/v1'

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  websocketUrl: () => process.env.REACT_APP_WS_URL || 'http://localhost:5001/',
}