import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import ru from './locales/ru'
import { Provider } from 'react-redux'
import store from './store'
import App from './components/App'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import rollbarConfig from './rollbarConfig'

const init = async () => {
  const i18n = i18next.createInstance()
  await i18n.use(initReactI18next).init({
    resources: { ru },
    lng: 'ru',
    fallbackLng: 'ru',
  })

  return (
    <RollbarProvider config={rollbarConfig}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  )
}

export default init
