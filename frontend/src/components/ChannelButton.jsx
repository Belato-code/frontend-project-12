import { Dropdown, Button, ButtonGroup } from 'react-bootstrap'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { setOpen } from '../store/slices/uiSlice'
import store from '../store'
import { useDispatch } from 'react-redux'
import LeoProfanity from 'leo-profanity'

export const ChannelButton = ({ channel, isSelected, onSelect }) => {

  const dispatch = useDispatch()
  const id = channel.id
  const { t } = useTranslation()

  const handleRemove = () => {
    dispatch(setOpen({ type: 'removing', id }))
    console.log(store.getState('ui'), channel.id)
  }
  const handleRename = () => {
    dispatch(setOpen({ type: 'renaming', id }))
    console.log(store.getState('ui'), channel.id)
  }
  const btnClass = classNames([
    'fs-5',
    'mt-1',
    'w-100',
    'fst-italic',
    'text-start',
    'border-0',
    'rounded-0',
  ], {
    'btn-secondary': isSelected,
    'btn-light': !isSelected,
  })

  const handleSelectChannel = (e) => {
    e.preventDefault()
    onSelect(channel.id)
  }

  if (channel.removable) {
    return (
      <Dropdown as={ButtonGroup} className="w-100">
        <Button
          variant={isSelected ? 'secondary' : 'light'}
          className={btnClass}
          type="button"
          aria-label={LeoProfanity.clean(channel.name)}
          onClick={handleSelectChannel}
        >
          <span className="me-1" aria-hidden="true">
            #
          </span>
          {LeoProfanity.clean(channel.name)}
        </Button>
        <Dropdown.Toggle
          split
          variant={isSelected ? 'secondary' : 'light'}
          id="dropdown-custom-2"
          className='border-0 mt-1'
        >
          <span className="visually-hidden">
            {t('channelControl')}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="options">
          <Dropdown.Item
            data-rename-id={channel.id}
            onClick={handleRename}
          >
            {t('channel.rename')}
          </Dropdown.Item>
          <Dropdown.Item
            data-rename-id={channel.id}
            onClick={handleRemove}
          >
            {t('channel.delete')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <Button
      key={channel.id}
      variant={isSelected ? 'secondary' : 'light'}
      className={btnClass}
      onClick={handleSelectChannel}
      type="button"
      aria-label={channel.name}
    >
      <span className="me-1" aria-hidden="true">
        #
      </span>
      {LeoProfanity.clean(channel.name)}
    </Button>
  )
}
