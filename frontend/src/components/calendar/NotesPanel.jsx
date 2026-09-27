import plusIcon from '../../assets/icons/plus.svg'

export function NotesPanel({ notes }) {
  return (
    <div className="group-panel">
      <div className="group-panel-header">
        <div>
          <h3>Notes &amp; Reminders</h3>
          <p>Keep track of action items and deadlines.</p>
        </div>
        <button type="button" className="pill-button add-note-button">
          <img src={plusIcon} alt="" />
          Add Note
        </button>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            <div className="note-card-header">
              <p className="note-title">{note.title}</p>
              <p className="note-when">{note.when}</p>
            </div>
            <p>{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
