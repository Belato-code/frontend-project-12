export default {
  accessToken: import.meta.env.VITE_ROLLBAR_CLIENT_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT || 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
}
