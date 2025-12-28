const apiPath = '/api/v1'

export default {
  login: () => '/login',
  chat: () => '/',
  notFound: () => '*',
  signup: () => '/signup',
  signupPath: () => [apiPath, 'signup'].join('/'),
  loginPath: () => [apiPath, 'login'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  messagesPath: () => [apiPath, 'messages'].join('/'),
  websocketUrl: () => process.env.REACT_APP_WS_URL || 'http://localhost:5001/',
}
