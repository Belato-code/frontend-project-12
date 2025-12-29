import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import init from './init.jsx'
import React from 'react'

const app = async () => {
  const root = createRoot(document.getElementById('root'))
  const vdom = await init()
  root.render(<React.StrictMode>
    {vdom}
  </React.StrictMode>)
}

app()
