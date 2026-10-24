import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api, { API_URL, errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { pickDefaultEvent } from '../utils.js';
import Icon from './Icons.jsx';

const NAV = [
  ['/dashboard', 'dashboard', 'Dashboard', true],
  ['/dashboard/events', 'events', 'Events'],
  ['/dashboard/attendees', 'attendees', 'Attendees'],
  ['/dashboard/checkins', 'checkins', 'Check-ins'],
  ['/dashboard/reports', 'reports', 'Reports'],
  ['/dashboard/notifications', 'bell', 'Notifications'],
  ['/dashboard/settings', 'settings', 'Settings'],
];

const TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/events': 'Events',
  '/dashboard/attendees': 'Attendees',
  '/dashboard/checkins': 'Check-ins',
  '/dashboard/reports': 'Reports',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/settings': 'Settings',
};

// Holds all organizer state once, so every page (dashboard, attendees, ...) shares it.
export default function OrganizerLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [scanLog, setScanLog] = useState([]);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    try {
      const { data } = await api.get('/events/mine');
      setEvents(data);
      setEventId((cur) => cur || pickDefaultEvent(data));
    } catch (e) {
      setError(errMsg(e));
    }
  }, []);

  const loadData = useCallback(async (id) => {
    if (!id) return;
    try {
      const [s, a] = await Promise.all([api.get(`/events/${id}/stats`), api.get(`/events/${id}/attendees`)]);
      setStats(s.data);
      setAttendees(a.data);
    } catch (e) {
      setError(errMsg(e));
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // On event change: load its data and subscribe to its live check-ins
  useEffect(() => {
    setStats(null);
    setAttendees([]);
    setScanLog([]);
    if (!eventId) return;
    loadData(eventId);

    const socket = io(API_URL);
    socket.on('connect', () => socket.emit('join', eventId)); // also re-joins after reconnect
    socket.on('checkin', () => loadData(eventId));
    return () => {
      socket.emit('leave', eventId);
      socket.disconnect();
    };
  }, [eventId, loadData]);

  const event = events.find((e) => e._id === eventId) || null;

  const addScan = (entry) => {
    setScanLog((l) => [entry, ...l].slice(0, 30));
    loadData(eventId);
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isHome = pathname === '/dashboard';

  const ctx = {
    events, event, eventId, setEventId, stats, attendees, scanLog, addScan,
    loadEvents, reload: () => loadData(eventId), error,
  };

  return (
    <div className="org">
      <aside className="side">
        <div className="brand">
          <span className="logo"><Icon name="qr" size={20} /></span>
          QRCHECK
        </div>
        {NAV.map(([to, icon, label, end]) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => 'navitem' + (isActive ? ' active' : '')}>
            <Icon name={icon} size={17} />
            {label}
          </NavLink>
        ))}
        <button
          className="navitem logout"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <Icon name="logout" size={17} />
          Logout
        </button>
      </aside>

      <section className="main">
        <header className="ptop">
          <div>
            <h1>{TITLES[pathname] || 'Dashboard'}</h1>
            <div className="sub">{isHome ? `Overview ${today}` : today}</div>
          </div>
          <div className="row">
            <button className="iconbtn" title="Refresh" onClick={() => { loadEvents(); loadData(eventId); }}>
              <Icon name="refresh" size={16} />
            </button>
            <button className="iconbtn" title="Settings" onClick={() => navigate('/dashboard/settings')}>
              <Icon name="settings" size={16} />
            </button>
          </div>
        </header>
        {error && <p className="error">{error}</p>}
        <Outlet context={ctx} />
      </section>
    </div>
  );
}
