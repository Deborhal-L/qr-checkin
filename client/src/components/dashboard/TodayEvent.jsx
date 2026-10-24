import Icon from '../Icons.jsx';
import { eventStatus, num } from '../../utils.js';

export default function TodayEvent({ events, event, eventId, setEventId, stats }) {
  const checked = stats?.checkedIn || 0;
  const cap = event?.capacity || 0;
  const pct = cap ? Math.min(100, Math.round((checked / cap) * 100)) : 0;
  const status = event ? eventStatus(event.date) : '';
  const when = event
    ? new Date(event.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '';

  return (
    <div className="card area-today">
      <h4 className="ctitle">Today's Event</h4>
      <div className="evhead">
        <span className="evicon"><Icon name="globe" size={24} /></span>
        <select className="evselect" value={eventId} onChange={(e) => setEventId(e.target.value)}>
          {events.map((e) => (
            <option key={e._id} value={e._id}>{e.title}</option>
          ))}
        </select>
      </div>
      <div className="meta"><Icon name="clock" size={15} /> {when}</div>
      <div className="meta"><Icon name="pin" size={15} /> {event?.venue}</div>
      <div className="meta"><Icon name="users" size={15} /> {num(cap)} attendees</div>

      <div className="spacer" />
      <div className="row between">
        <span className="muted small">Status:</span>
        <span className={'pill status ' + status.toLowerCase()}>{status}</span>
      </div>
      <div className="row between small">
        <span className="muted">Check-ins</span>
        <b>{num(checked)} / {num(cap)} ({pct}%)</b>
      </div>
      <div className="bar"><div style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
