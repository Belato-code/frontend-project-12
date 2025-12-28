import { useFormik } from "formik"
import signUpImg from '../assets/signUp.jpg'
import { Form, Button } from 'react-bootstrap'
import { useEffect, useRef, useState } from "react"
import routes from "../routes"
import axios from 'axios'
import useAuth from "../hooks"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import * as Yup from 'yup'

export const SignUpPage = () => {
  const inputRef = useRef()
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const signUpSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .required(t('validation.required'))
      .min(3, t('validation.signUp'))
      .max(20, t('validation.signUp')),
    password: Yup.string()
      .required(t('validation.required'))
      .min(6, t('validation.minPas')),
    confirmPassword: Yup.string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password'), null], t('validation.confirm'))
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      setSubmitAttempted(true)
      
      const isValid = await formik.validateForm()
      if (!isValid) return
      
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
        formik.setSubmitting(false)
        if (err.isAxiosError && err.response.status === 401) {
          inputRef.current.select();
          return
        }
        if (err.response.status === 409) {
          console.log(err)
          formik.setFieldError('username', t('validation.usernameTaken'))
        }
        throw err;
      }
    },
    validationSchema: signUpSchema,
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
                  <h1 className="text-center mb-3">{t('signUpPage.header')}</h1>
                  <Form.Group className="mb-3">
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
                  >{t('signUpPage.button')}</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}