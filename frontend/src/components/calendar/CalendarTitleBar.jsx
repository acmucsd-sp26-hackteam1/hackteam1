export function CalendarTitleBar({ title, subtitle, onPrevious, onNext }) {
  return (
    <div className="calendar-title-bar">
      <div className="calendar-title-group">
        <button type="button" className="round-arrow" onClick={onPrevious} aria-label="Previous">
          ‹
        </button>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <button type="button" className="round-arrow" onClick={onNext} aria-label="Next">
        ›
      </button>
    </div>
  )
}
