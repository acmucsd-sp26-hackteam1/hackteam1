const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthView() {
  return (
    <div className="month-grid">
      {DAYS.map(d => <div key={d} className="month-header">{d}</div>)}
      {Array(35).fill(null).map((_, i) => <div key={i} className="month-cell"></div>)}
    </div>
  );
}
