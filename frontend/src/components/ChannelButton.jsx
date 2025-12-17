import { Dropdown, Button } from "react-bootstrap"
import classNames from 'classnames'
import { useTranslation } from "react-i18next"

export const ChannelButton = ({ channel, isSelected, onSelect }) => {
  const { t } = useTranslation()
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
          onClick={handleSelectChannel}
        >
          # {channel.name}
        </Button>
        <Dropdown.Toggle
          split
          variant={isSelected ? 'secondary' : 'light'}
          id="dropdown-custom-2"
          className='border-0 mt-1'
        />
        <Dropdown.Menu className="super-colors">
          <Dropdown.Item eventKey="1">{t('channel.rename')}</Dropdown.Item>
          <Dropdown.Item eventKey="2">{t('channel.rename')}</Dropdown.Item>
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
    >
      # {channel.name}
    </Button>
  )
}