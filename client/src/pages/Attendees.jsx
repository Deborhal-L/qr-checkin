import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { avatarColor, fmtTime, initials } from '../utils.js';

export default function Attendees() {
  const { event, attendees } = useOutletContext();
  const [q, setQ] = useState('');
  const rows = attendees.filter((a) => (a.name + a.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="card">
      <div className="row between">
        <h4 className="ctitle">{event ? event.title : 'Attendees'} · {attendees.length} registered</h4>
        <input className="search" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <table className="tbl">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Ticket Type</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan="4" className="muted">No attendees found.</td></tr>}
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                <span className="avatar sm" style={{ background: avatarColor(a.name) }}>{initials(a.name)}</span>{' '}
                <b>{a.name}</b>
              </td>
              <td className="muted">{a.email}</td>
              <td><span className={'pill ' + a.ticketType.toLowerCase()}>{a.ticketType}</span></td>
              <td>
                {a.checkedInAt ? (
                  <span className="pill verified">CHECKED IN {fmtTime(a.checkedInAt)}</span>
                ) : (
                  <span className="pill pending">PENDING</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
