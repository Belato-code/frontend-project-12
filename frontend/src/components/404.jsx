import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <>
      <div className="not-found-page">
        <div className="animation-container">
          <div className="ghost">👻</div>
        </div>
        <div className="text-content">
          <h1>404</h1>
          <h2>Ой! Страница пропала</h2>
          <p>Возможно, она переехала или никогда не существовала.</p>
          <div className="actions">
            <Link to="/" className="btn btn-primary">
              🏠 На главную
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-outline">
              ↩️ Назад
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
