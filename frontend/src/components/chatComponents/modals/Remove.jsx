import { useEffect, useRef, useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentChannelId } from "../../../store/slices/uiSlice"
import { useDeleteChannelMutation, useGetMessagesQuery } from "../../../store/api/baseApi"


const Remove = ({ onHide, channels }) => {
  const { t } = useTranslation()
  const [deleteChannel, { isLoading }] = useDeleteChannelMutation()
  const dispatch = useDispatch()
  const modal = useSelector(state => state.ui.modal)

  const handleSubmit = async (e) => {
    const id = modal.id
    e.preventDefault()
    try {
      await deleteChannel(id)
      dispatch(setCurrentChannelId(channels[0].id))
      onHide()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('channel.deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>{t('channel.confirm')}</span>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isLoading}
            >{t('modals.cancel')}</Button>
            <Button
              type="submit"
              variant="danger"
              disabled={isLoading}
            >{t('channel.delete')}</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default Remove
