export function DayView() {
  return (
    <div className="day-view">
      {Array(12).fill(null).map((_, i) => (
        <div key={i} className="day-row"></div>
      ))}
    </div>
  );
}
