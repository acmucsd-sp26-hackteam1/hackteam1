const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function WeekView() {
  return (
    <div className="week-grid">
      {DAYS.map(d => <div key={d} className="week-cell">{d}</div>)}
    </div>
  );
}
