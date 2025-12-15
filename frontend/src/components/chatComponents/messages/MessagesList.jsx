export const MessagesList = ({ messages }) => {
  return (
    <div>
      {messages.length === 0 ? (
        <p className="text-muted">Нет сообщений</p>
      ) : (
        messages.map((message) => (
          <div key={message.id || message.timestamp} className="mb-2">
            <div>
              <strong>{message.username}: </strong>
              {message.body}
            </div>
            <small className="text-muted">
              {new Date(message.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))
      )}
    </div>
  )
}