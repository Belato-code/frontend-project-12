
export const Page = ({children}) => {

  return (
    <>
      <div className="container-fluid m-0">
        <div className="navbar bg-body-tertiary bg-secondary-subtle container-fluid m-0">
          <div className="container-fluid ps-5">
            <a href="/" className="navbar-brand ps-5 mb-0 h1">Join Chat</a>
          </div>
        </div>
        <div className="bh-100 row justify-content-center align-content-center">
          <div className="col-6">
            <div className="card">
              <div className="card-body row align-items-center">
                <div className="col-6">
                  <img src="../src/img/login.jpg" className="rounded w-100" alt="Войти" />
                </div>
                <div className="col-6">
                  {children}
                </div>
              </div>
              <div className="card-footer p-3">
                <div className="text-center">
                  Нет аккаунта?
                  <a className="ps-2" href="/signup">Регистрация</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
