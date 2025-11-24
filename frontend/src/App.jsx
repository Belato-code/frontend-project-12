import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from './components/Login'
import { Main } from './components/Main'
import { NotFound } from './components/404'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='login' element={<LoginForm />} />
        <Route path='/' element={<Main />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
