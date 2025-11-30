import { useFormik } from "formik"
import loginImg from '../assets/login.jpg'
import { Form, Button } from 'react-bootstrap'
import { useEffect, useRef } from "react"
import routes from "../routes"
import axios from 'axios'
import useAuth from "../hooks"
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const inputRef = useRef()
  const auth = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.loginPath(), values)
        localStorage.setItem('userId', JSON.stringify(res.data))
        auth.logIn()
        navigate('/')
      }
      catch (err) {
        formik.setSubmitting(false)
        if (err.isAxiosError && err.response.status === 401) {
          inputRef.current.select()
          return
        }
        throw err
      }
    },
  })

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="container-fluid m-0">
      <div className="bh-100 row justify-content-center align-content-center">
        <div className="col-6">
          <div className="card">
            <div className="card-body row align-items-center">
              <div className="col-6">
                <img src={loginImg} className="rounded w-100" alt="Войти" />
              </div>
              <div className="col-6">
                <Form onSubmit={formik.handleSubmit}>
                  <h1 className="text-center">Вход</h1>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      placeholder="Ваш ник"
                      name="username"
                      id="username"
                      required
                      ref={inputRef}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder="Пароль"
                      name="password"
                      id="Password"
                      required
                    />
                  </Form.Group>
                  <Button variant="outline-primary" className="w-100" type="submit">Войти</Button>
                </Form>
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
  )
}