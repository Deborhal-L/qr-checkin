import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { CURRENCY } from '../utils.js';

const TYPES = ['GA', 'VIP', 'SPEAKER'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [types, setTypes] = useState({}); // eventId -> chosen ticket type
  const [ticket, setTicket] = useState(null); // { event, qr, ticket }
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/events').then((r) => setEvents(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const register = async (id) => {
    try {
      const { data } = await api.post(`/events/${id}/register`, { ticketType: types[id] || 'GA' });
      setTicket(data);
      setError('');
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <h2>Upcoming events</h2>
      {error && <p className="error">{error}</p>}
      {events.length === 0 && <p>No events yet. Ask an organizer to create one.</p>}
      <div className="grid">
        {events.map((e) => (
          <div className="card" key={e._id}>
            <h3>{e.title}</h3>
            <p>{new Date(e.date).toLocaleString()}</p>
            <p>{e.venue} · {e.price ? `${CURRENCY}${e.price}` : 'Free'}</p>
            {e.description && <p className="muted">{e.description}</p>}
            <div className="row">
              <select value={types[e._id] || 'GA'} onChange={(ev) => setTypes({ ...types, [e._id]: ev.target.value })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button className="btn" onClick={() => register(e._id)}>Get ticket</button>
            </div>
          </div>
        ))}
      </div>

      {ticket && (
        <div className="modal" onClick={() => setTicket(null)}>
          <div className="card center" onClick={(e) => e.stopPropagation()}>
            <h3>{ticket.event.title}</h3>
            <span className={'pill ' + ticket.ticket.ticketType.toLowerCase()}>{ticket.ticket.ticketType}</span>
            <img src={ticket.qr} alt="Ticket QR" />
            <p className="muted">Show this QR at the entrance.</p>
            <Link to="/tickets">View in My Tickets</Link>
            <button className="btn small" onClick={() => setTicket(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
