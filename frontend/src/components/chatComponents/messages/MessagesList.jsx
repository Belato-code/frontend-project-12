import { useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import LeoProfanity from 'leo-profanity'

export const MessagesList = ({ messages, currentChannelId }) => {
  const { t } = useTranslation()
  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentChannelId])

  return (
    <div className="chat-messages overflow-auto px-5 ">
      {messages.length === 0 ? (
        <div className="d-flex justify-content-center">
          <p className="text-muted">{t('chatPage.noMessages')}</p>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id || message.timestamp} className="mb-2">
            <div>
              <strong>{message.username}: </strong>
              {LeoProfanity.clean(message.body)}
            </div>
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  )
}