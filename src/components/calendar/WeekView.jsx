import { Weekday, getDayName } from '../../helpers.js';

export function WeekView() {
  return (
    <div className="week-grid">
      {Object.values(Weekday).map(d => (
        <div key={d} className="week-cell">{getDayName(d)}</div>
      ))}
    </div>
  );
}
