import { useNavigate, useOutletContext } from 'react-router-dom';
import CreateEvent from '../components/CreateEvent.jsx';
import { CURRENCY, num } from '../utils.js';

export default function OrgEvents() {
  const { events, loadEvents, setEventId } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="grid">
      <CreateEvent
        onCreated={async (ev) => {
          await loadEvents();
          setEventId(ev._id);
          navigate('/dashboard');
        }}
      />
      <div className="card">
        <h4 className="ctitle">Your events</h4>
        {events.length === 0 && <p className="muted small">Nothing yet.</p>}
        {events.map((e) => (
          <div className="listrow" key={e._id}>
            <div className="grow">
              <b>{e.title}</b>
              <div className="muted small">
                {new Date(e.date).toLocaleString()} · {e.venue} · {num(e.capacity)} seats · {CURRENCY}{num(e.price)}
              </div>
            </div>
            <button
              className="btn small"
              onClick={() => {
                setEventId(e._id);
                navigate('/dashboard');
              }}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
