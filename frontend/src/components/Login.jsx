import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Formik, Field } from 'formik'
import { Page } from './FormPage'

export const LoginForm = () => {
  return (
    <Page>
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        console.log('Form values:', values)
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <h1 className="text-center">Вход</h1>
          <Form.Group className='mb-3' controlId='username'>
            <Field 
              name="username"
              as={Form.Control}
              type="text"
              placeholder="Ваш ник"
              aria-label="Имя пользователя"
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='password'>
            <Field 
              name="password"
              as={Form.Control}
              type="password"
              placeholder="Пароль"
              aria-label="Введите пароль"
            />
          </Form.Group>
          <Button
            variant='outline-primary'
            type='submit'
            disabled={isSubmitting}
            className='w-100 mt-3'
          >
            Вход
          </Button>
        </Form>
      )}
    </Formik>
    </Page>
  )
}
