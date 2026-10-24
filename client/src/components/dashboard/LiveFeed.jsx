import Icon from '../Icons.jsx';
import { avatarColor, fmtTime, initials } from '../../utils.js';

// limit = number of rows (omit for all)
export default function LiveFeed({ attendees, limit, title = 'Live Check-in Feed' }) {
  let rows = attendees
    .filter((a) => a.checkedInAt)
    .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt));
  if (limit) rows = rows.slice(0, limit);

  return (
    <div className="card area-feed">
      <div className="row between">
        <h4 className="ctitle">{title}</h4>
        <span className="muted"><Icon name="dots" size={18} /></span>
      </div>
      <table className="tbl">
        <thead>
          <tr><th>Name</th><th>Photo</th><th>Ticket Type</th><th>Timestamp</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan="5" className="muted">Waiting for check-ins…</td></tr>
          )}
          {rows.map((a) => (
            <tr key={a.id}>
              <td><b>{a.name}</b></td>
              <td>
                <span className="avatar" style={{ background: avatarColor(a.name) }}>{initials(a.name)}</span>
              </td>
              <td><span className={'pill ' + a.ticketType.toLowerCase()}>{a.ticketType}</span></td>
              <td>{fmtTime(a.checkedInAt)}</td>
              <td>
                <span className="pill verified"><Icon name="check" size={11} /> VERIFIED</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
