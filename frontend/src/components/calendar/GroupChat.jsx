import { useState } from 'react'
import statusDot from '../../assets/icons/status-dot.svg'
import paperclipIcon from '../../assets/icons/paperclip.svg'

export function GroupChat({ initialMessages, onlineCount }) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  const handleSend = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      return
    }
    setMessages([...messages, { id: Date.now(), author: 'You', color: 'pink', text }])
    setDraft('')
  }

  return (
    <div className="group-panel">
      <div className="group-panel-header">
        <div>
          <h3>Group Chat</h3>
          <p>Discuss plans and share updates with the team.</p>
        </div>
        <span className="online-status">
          <img src={statusDot} alt="" />
          {onlineCount} {onlineCount === 1 ? 'member' : 'members'} online
        </span>
      </div>

      <div className="chat-history">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <span className={`chat-avatar member-${message.color}`}>{message.author[0]}</span>
            <div className="chat-bubble">
              <p className="chat-author">{message.author}</p>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <img src={paperclipIcon} alt="" />
        <input
          type="text"
          placeholder="Type a message..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="pill-button">Send</button>
      </form>
    </div>
  )
}
