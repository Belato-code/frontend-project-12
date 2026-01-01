import { useFormik } from 'formik'
import signUpImg from '../assets/signUp.jpg'
import { Form, Button } from 'react-bootstrap'
import { useEffect, useRef, useState } from 'react'
import routes from '../routes'
import axios from 'axios'
import useAuth from '../hooks'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signUpSchema } from '../validation'

const createSignUpHandler = (dependencies) => {
  const { auth, navigate, t, inputRef } = dependencies

  return async (values, { setSubmitting, setFieldError }) => {
    try {
      const res = await axios.post(routes.signupPath(), {
        username: values.username.trim(),
        password: values.password,
      })

      const { token, username } = res.data
      localStorage.setItem('authToken', token)
      localStorage.setItem('username', username)
      auth.logIn()
      navigate('/')
    }
    catch (err) {
      setSubmitting(false)

      if (err.isAxiosError) {
        if (err.response?.status === 409) {
          setFieldError('username', t('validation.usernameTaken'))
          inputRef.current?.select()
          return
        }
        if (err.response?.status === 401) {
          inputRef.current?.select()
          return
        }
      }
      throw err
    }
  }
}

export const SignUpPage = () => {
  const inputRef = useRef()
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const currentSchema = signUpSchema(t)
  const signUpHandler = createSignUpHandler({ auth, navigate, t, inputRef })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values, formikHelpers) => {
      setSubmitAttempted(true)
      await signUpHandler(values, formikHelpers)
    },
    validationSchema: currentSchema,
    validateOnChange: true,
    validateOnBlur: true,
  })



  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const showError = (fieldName) => {
    return (formik.touched[fieldName] || submitAttempted) && formik.errors[fieldName]
  }

  return (
    <div className="container-fluid m-0">
      <div className="bh-100 row justify-content-center align-content-center">
        <div className="col-6">
          <div className="card">
            <div className="card-body row align-items-center">
              <div className="col-6">
                <img src={signUpImg} className="rounded w-100" alt="Войти" />
              </div>
              <div className="col-6">
                <Form onSubmit={formik.handleSubmit} noValidate>
                  <h1 className="text-center mb-3">
                    {t('signUpPage.header')}
                  </h1>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="username" className="visually-hidden">
                      {t('signUpPage.name')}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      placeholder={t('signUpPage.name')}
                      name="username"
                      id="username"
                      required
                      ref={inputRef}
                      isInvalid={showError('username')}
                    />
                    {showError('username') && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="password" className="visually-hidden">
                      {t('signUpPage.password')}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      placeholder={t('signUpPage.password')}
                      name="password"
                      id="password"
                      required
                      isInvalid={showError('password')}
                    />
                    {showError('password') && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="confirmPassword" className="visually-hidden">
                      {t('signUpPage.confirmPassword')}
                    </Form.Label>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      placeholder={t('signUpPage.confirmPassword')}
                      name="confirmPassword"
                      id="confirmPassword"
                      required
                      isInvalid={showError('confirmPassword')}
                    />
                    {showError('confirmPassword') && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {formik.errors.confirmPassword}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    {t('signUpPage.button')}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
