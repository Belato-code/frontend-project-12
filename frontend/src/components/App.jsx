import { Button, Container, Navbar } from 'react-bootstrap'
import AuthContext from '../contexts/index.jsx'
import { useState } from 'react'
import { ChatPage } from './ChatPage'
import { NotFound } from './404'
import { LoginPage } from './LoginPage'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
  useNavigate,
} from 'react-router-dom'
import useAuth from '../hooks'
import { SocketProvider } from '../contexts/socket.jsx'
import { useTranslation } from 'react-i18next'

const AuthProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('authToken')
  })
  const logIn = () => setLoggedIn(true)
  const logOut = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    setLoggedIn(false)
  }
  return (
    <AuthContext.Provider value={{ logIn, logOut, loggedIn}}>
      { children }
    </AuthContext.Provider>
  )
}

const AuthButton = () => {
  const { t } = useTranslation()
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    auth.logOut()
    navigate('/login')
  }
  return auth.loggedIn
    ? <>
      <div className="me-2 text-warning-emphasis fs-4 navbar-text">{localStorage.getItem('username')}</div>
      <Button onClick={handleLogOut}>{t('navbar.logOut')}</Button>
    </>
    : <>
      <Button as={Link} to='/login' state={{ from: location }} className='me-1' variant="outline-primary">{t('navbar.logIn')}</Button>
      <Button as={Link} to='/signup' state={{ from: location}} className='ms-1' variant="outline-primary">{t('navbar.signUp')}</Button>
    </>
    
}

function App() {
  const { t } = useTranslation()
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar bg='secondary-subtle' expand='lg'>
            <Container>
              <Navbar.Brand href='/' className='fw-bold text-warning-emphasis'>{t('navbar.name')}</Navbar.Brand>
              <Navbar.Collapse className='justify-content-end'>
                <AuthButton />
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='/' element={<ChatPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
