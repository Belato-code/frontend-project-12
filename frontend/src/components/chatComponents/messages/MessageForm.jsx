import { Button, InputGroup, Form } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useRef, useEffect } from 'react'
import { useAddMessageMutation } from '../../../store/api/baseApi'
import { useTranslation } from 'react-i18next'

const createModalHandler = ({ addMessage, username, selectedChannelId }) => {
  return async (values, { resetForm }) => {
    const text = values.body.trim()
    if (!text || !selectedChannelId) return

    try {
      await addMessage({
        body: text,
        channelId: selectedChannelId,
        username,
      }).unwrap()
      resetForm()
    }
    catch (error) {
      console.error('💥 Ошибка:', error)
    }
  }
}

export const MessageForm = ({ selectedChannelId }) => {
  const inputRef = useRef(null)
  const [addMessage, { isLoading }] = useAddMessageMutation()
  const { t } = useTranslation()

  const username = localStorage.getItem('username')
  const modalHandler = createModalHandler({ addMessage, username, selectedChannelId })

  const formik = useFormik({
    initialValues: { body: '' },
    onSubmit: async (values, formikHelpers) => {
      await modalHandler(values, formikHelpers)
    },
  })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      formik.handleSubmit()
    }
  }

  useEffect(() => {
    if (inputRef.current && selectedChannelId) {
      inputRef.current.focus()
    }
  }, [selectedChannelId])

  return (
    <Form onSubmit={formik.handleSubmit} className="mb-3 px-3">
      <InputGroup className="mb-1 px-2">
        <Form.Control
          placeholder={t('chatPage.placeholder')}
          aria-label={t('message_input')}
          name="body"
          ref={inputRef}
          value={formik.values.body}
          onChange={formik.handleChange}
          onKeyDown={handleKeyDown}
          as="textarea"
          rows={1}
          style={{ resize: 'none' }}
        />
        <Button
          variant="outline-secondary"
          type="submit"
          disabled={isLoading}
        >
          <svg width="30" height="30" viewBox="0 0 490.939 490.939" fill="currentColor">
            <path d="M41.552,490.939c-2.665,0-5.297-1.064-7.237-3.095c-3.185-3.337-3.675-8.419-1.186-12.303L181.221,244.52L33.149,15.43
              c-2.508-3.88-2.031-8.973,1.152-12.32c3.183-3.347,8.245-4.081,12.246-1.768l407.844,235.47c3.094,1.786,5,5.088,5,8.66
              s-1.906,6.874-5,8.66L46.548,489.6C44.986,490.5,43.263,490.939,41.552,490.939z M72.451,39.39l129.061,199.679
              c2.128,3.293,2.136,7.525,0.02,10.825L72.156,451.721l357.236-206.25L72.451,39.39z"
            />
          </svg>
        </Button>
      </InputGroup>
    </Form>
  )
}
