import { useFormik } from 'formik'
import loginImg from '../assets/login.jpg'
import { Form, Button } from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react'
import routes from '../routes'
import axios from 'axios'
import useAuth from '../hooks'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const createLoginPageHandler = (dependencies) => {
  const { auth, navigate, inputRef, setAuthFailed } = dependencies

  return async (values, { setSubmitting }) => {
    setAuthFailed(false)
    try {
      const res = await axios.post(routes.loginPath(), values)
      const { token, username } = res.data
      localStorage.setItem('authToken', token)
      localStorage.setItem('username', username)
      auth.logIn()
      navigate('/')
    }
    catch (err) {
      setAuthFailed(true)
      setSubmitting(false)
      if (err.isAxiosError && err.response.status === 401) {
        inputRef.current.select()
        return
      }
      throw err
    }
  }
}

export const LoginPage = () => {
  const inputRef = useRef()
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [authFailed, setAuthFailed] = useState(false)

  const logInHandler = createLoginPageHandler({
    auth,
    navigate,
    inputRef,
    setAuthFailed,
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, formikHelpers) => {
      setAuthFailed(false)
      await logInHandler(values, formikHelpers)
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
                  <h1 className="text-center">
                    {t('logInPage.header')}
                  </h1>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="username" className="visually-hidden">
                      {t('logInPage.name')}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      placeholder={t('logInPage.name')}
                      name="username"
                      id="username"
                      isInvalid={authFailed}
                      required
                      ref={inputRef}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" className="visually-hidden">
                      {t('logInPage.password')}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder={t('logInPage.password')}
                      isInvalid={authFailed}
                      name="password"
                      id="password"
                      required
                    />
                    <Form.Control.Feedback type="invalid" className="invalid-feedback">
                      {t('invalidAuth')}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="outline-primary" className="w-100" type="submit">
                    {t('logInPage.button')}
                  </Button>
                </Form>
              </div>
            </div>
            <div className="card-footer p-3">
              <div className="text-center">
                {t('logInPage.linkPrefix')}
                <a className="ps-2" href="/signup">
                  {t('logInPage.link')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
