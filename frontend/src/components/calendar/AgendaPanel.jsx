export function AgendaPanel({ title, subtitle, emptyText, items }) {
  return (
    <div className="agenda-panel">
      <h3>{title}</h3>
      <p className="agenda-subtitle">{subtitle}</p>

      {items.length === 0 && <p className="agenda-empty">{emptyText}</p>}

      <div className="agenda-items">
        {items.map((item) => (
          <div key={item.id} className="agenda-item">
            <span className="date-circle">{item.date.getDate()}</span>
            <div>
              <p className="agenda-item-title">{item.title}</p>
              <p className="agenda-item-detail">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
