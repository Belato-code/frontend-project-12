import { useFormik } from 'formik'
import { useEffect, useRef } from 'react'
import { FormGroup, FormControl, Modal, Button, Spinner } from 'react-bootstrap'
import { useAddChannelMutation, useGetChannelsQuery } from '../../../store/api/baseApi'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setCurrentChannelId } from '../../../store/slices/uiSlice'
import { useToast } from '../../../hooks/useToast'
import LeoProfanity from 'leo-profanity'
import { validationSchema } from '../../../validation'

const createModalHandler = (dependencies) => {
  const {
    dispatch,
    toastSuccess,
    toastError,
    onHide,
    addChannel,
    t,
    validationSchema,
  } = dependencies
  return async (values, { setSubmitting }) => {
    try {
      await validationSchema.validate(values, { abortEarly: false })

      const cleanName = LeoProfanity.clean(values.name.trim())
      const response = await addChannel(cleanName).unwrap()

      dispatch(setCurrentChannelId(response.id))
      toastSuccess(t('toast.channelAdd'))
      onHide()
    }
    catch (error) {
      setSubmitting(false)
      if (error.name === 'ValidationError') {
        toastError(error.errors[0] || t('toast.error'))
        return
      }
    }
  }
}

const Add = ({ onHide }) => {
  const [addChannel, { isLoading: isAdding }] = useAddChannelMutation()
  const { data: channels = [] } = useGetChannelsQuery()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { toastError, toastSuccess } = useToast()

  const currentSchema = validationSchema(t, channels)
  const modalHandler = createModalHandler({
    dispatch,
    toastSuccess,
    toastError,
    onHide,
    addChannel,
    t,
    validationSchema: currentSchema,
  })

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values, formikHelpers) => {
      await modalHandler(values, formikHelpers)
    },
    validationSchema: currentSchema,
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
