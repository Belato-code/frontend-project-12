import { useFormik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { FormGroup, FormControl, Modal, Button } from 'react-bootstrap'
import { useEditChannelMutation, useGetChannelsQuery } from '../../../store/api/baseApi'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentChannelId } from '../../../store/slices/uiSlice'
import { useToast } from '../../../hooks/useToast'

const Rename = ({ onHide }) => {
  const [renameChannel, { isLoading }] = useEditChannelMutation()
  const { data: channels } = useGetChannelsQuery()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const modal = useSelector(state => state.ui.modal)
  const { toastError, toastSuccess } = useToast()

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('validation.min'))
      .max(20, t('validation.max'))
      .required(t('validation.required'))
      .test('unique', t('validation.channelIsExist'), value =>
        !channels.some(ch => ch.name.toLowerCase() === value?.toLocaleLowerCase()),
      ),
  })

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitAttempted(true)
      const isValid = await formik.validateForm()
      if (!isValid) return

      try {
        const id = modal.id
        const channelName = values.name.trim()
        const response = await renameChannel({ id, channelName })
        dispatch(setCurrentChannelId(response.data.id))
        setSubmitting(false)
        resetForm()
        onHide()
        toastSuccess(t('toast.channelRename'))
      }
      catch {
        setSubmitting(false)
        toastError(t('toast.error'))
      }
    },
  })

  const inputRef = useRef()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const showError = (fieldName) => {
    return (formik.touched[fieldName] || submitAttempted) && formik.errors[fieldName]
  }

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>
          {t('channel.renameChannel')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <label htmlFor="name" className="visually-hidden">
              {t('channelName')}
            </label>
            <FormControl
              required
              ref={inputRef}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={showError('name')}
              name="name"
              id="name"
            />
            {showError('name') && (
              <FormControl.Feedback type="invalid" id="channelError">
                {formik.errors.name}
              </FormControl.Feedback>
            )}
          </FormGroup>
          <div id="invalidChannel" className="invalid-feedback text-danger mt-2">
            {formik.errors?.name}
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isLoading}
            >
              {t('modals.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {t('channel.rename')}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default Rename
