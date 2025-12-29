import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className="not-found-page">
        <div className="animation-container">
          <div className="ghost">
            👻
          </div>
        </div>
        <div className="text-content">
          <h1>
            404
          </h1>
          <h2>
            {t('404.subheader')}
          </h2>
          <p>
            {t('404.paragraf')}
          </p>
          <div className="actions">
            <Link to="/" className="btn btn-primary">
              {t('404.toHome')}
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-outline">
              {t('404.back')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
