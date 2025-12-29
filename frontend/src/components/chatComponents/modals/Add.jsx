import { useFormik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { FormGroup, FormControl, Modal, Button, Spinner } from 'react-bootstrap'
import { useAddChannelMutation, useGetChannelsQuery } from '../../../store/api/baseApi'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setCurrentChannelId } from '../../../store/slices/uiSlice'
import { useToast } from '../../../hooks/useToast'
import LeoProfanity from 'leo-profanity'

const Add = ({ onHide }) => {
  const [addChannel, { isLoading: isAdding }] = useAddChannelMutation()
  const { data: channels = [] } = useGetChannelsQuery()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const { toastError, toastSuccess } = useToast()

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('validation.min'))
      .max(20, t('validation.max'))
      .required(t('validation.required'))
      .test('unique', t('validation.channelIsExist'), (value) => {
        if (!value) return true
        return !channels.some((ch) =>
          ch.name.toLowerCase() === value.toLowerCase().trim(),
        )
      }),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitAttempted(true)

      await formik.validateForm()

      if (Object.keys(formik.errors).length > 0) {
        setSubmitting(false)
        return
      }

      try {
        const cleanName = LeoProfanity.clean(values.name.trim())
        const response = await addChannel(cleanName).unwrap()
        dispatch(setCurrentChannelId(response.id))
        toastSuccess(t('toast.channelAdd'))
        onHide()
      } catch (error) {
        setSubmitting(false)
        console.error('Ошибка:', error)
        toastError(error.data?.message || t('toast.error'))
      }
    },
    validationSchema: validationSchema,
    validateOnChange: false,
  })

  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleCancel = () => {
    if (!isAdding) {
      onHide()
    }
  }

  return (
    <Modal show onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('channel.addChannel')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit} noValidate>
          <FormGroup>
            <label htmlFor="name" className="visually-hidden">
              {t('channelName')}
            </label>
            <FormControl
              ref={inputRef}
              name="name"
              id="name"
              placeholder={formik.onChange}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={formik.errors.name && formik.touched.name}
              disabled={isAdding}
            />
            {formik.errors.name && formik.touched.name && (
              <div className="invalid-feedback">
                {formik.errors.name}
              </div>
            )}
          </FormGroup>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isAdding}
            >
              {t('modals.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isAdding}
            >
              {isAdding
                ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {t('common.adding')}
                  </>
                )
                : (
                  t('modals.send')
                )}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default Add
