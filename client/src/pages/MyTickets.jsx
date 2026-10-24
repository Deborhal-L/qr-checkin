import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tickets/mine').then((r) => setTickets(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  return (
    <div>
      <h2>My tickets</h2>
      {error && <p className="error">{error}</p>}
      {tickets.length === 0 && <p>No tickets yet. Register for an event first.</p>}
      <div className="grid">
        {tickets.map((t) => (
          <div className="card center" key={t.id}>
            <h3>{t.event.title}</h3>
            <span className={'pill ' + t.ticketType.toLowerCase()}>{t.ticketType}</span>
            <p>{new Date(t.event.date).toLocaleString()} · {t.event.venue}</p>
            <img src={t.qr} alt="Ticket QR" />
            <p className={t.checkedInAt ? 'ok' : 'muted'}>
              {t.checkedInAt ? `Checked in at ${new Date(t.checkedInAt).toLocaleTimeString()}` : 'Not used yet'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
