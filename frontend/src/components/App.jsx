import { Button, Container, Navbar } from 'react-bootstrap'
import AuthContext from '../contexts'
import { useState } from 'react'
import { Main } from './Main'
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

const AuthProvider = ({ children }) => {

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('userId')
  })
  const logIn = () => setLoggedIn(true)
  const logOut = () => {
    localStorage.removeItem('userId')
    setLoggedIn(false)
  }
  console.log()
  return (
    <AuthContext.Provider value={{ logIn, logOut, loggedIn}}>
      { children }
    </AuthContext.Provider>
  )
}

const AuthButton = () => {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogOut = () => {
    auth.logOut()
    navigate('/login')
  }
  return auth.loggedIn
    ? <>
      <div className="me-2 text-warning-emphasis fs-4 navbar-text">Signed as: {JSON.parse(localStorage.getItem('userId'))?.username}</div>
      <Button onClick={handleLogOut}>Выйти</Button>
    </>
    : <>
      <Button as={Link} to='/login' state={{ from: location }} className='me-1' variant="outline-primary">Вход</Button>
      <Button as={Link} to='/signup' state={{ from: location}} className='ms-1' variant="outline-primary">Регистрация</Button>
    </>
    
}

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar bg='secondary-subtle' expand='lg'>
          <Container>
            <Navbar.Brand href='/' className='fw-bold text-warning-emphasis'>Join to Chat</Navbar.Brand>
            <Navbar.Collapse className='justify-content-end'>
              <AuthButton />
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='/' element={<Main />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
