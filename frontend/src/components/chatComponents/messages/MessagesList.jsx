import { useTranslation } from "react-i18next"

export const MessagesList = ({ messages}) => {
  const { t } = useTranslation()

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
              {message.body}
            </div>
          </div>
        ))
      )}
    </div>
  )
}