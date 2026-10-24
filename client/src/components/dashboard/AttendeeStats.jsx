import { num } from '../../utils.js';

export default function AttendeeStats({ stats }) {
  const total = stats?.total || 0;
  const checked = stats?.checkedIn || 0;
  const pct = total ? (checked / total) * 100 : 0;

  return (
    <div className="card area-stats">
      <h4 className="ctitle">Attendee Statistics</h4>
      <div className="bar thick"><div style={{ width: `${pct}%` }} /></div>
      <div className="row between small">
        <span><b>{num(checked)}</b> <span className="muted">Checked-in</span></span>
        <span><b>{num(total - checked)}</b> <span className="muted">Remaining Guests</span></span>
      </div>
    </div>
  );
}
