import { Link, useOutletContext } from 'react-router-dom';
import TodayEvent from '../components/dashboard/TodayEvent.jsx';
import AttendeeStats from '../components/dashboard/AttendeeStats.jsx';
import Analytics from '../components/dashboard/Analytics.jsx';
import LiveFeed from '../components/dashboard/LiveFeed.jsx';
import QRVerification from '../components/dashboard/QRVerification.jsx';
import ScannerLog from '../components/dashboard/ScannerLog.jsx';

export default function Dashboard() {
  const { events, event, eventId, setEventId, stats, attendees, scanLog, addScan } = useOutletContext();

  if (!events.length) {
    return (
      <div className="card">
        <h4 className="ctitle">No events yet</h4>
        <p>
          <Link to="/dashboard/events">Create your first event</Link> to start checking people in.
        </p>
      </div>
    );
  }

  return (
    <div className="dash">
      <TodayEvent events={events} event={event} eventId={eventId} setEventId={setEventId} stats={stats} />
      <AttendeeStats stats={stats} />
      <Analytics stats={stats} />
      <LiveFeed attendees={attendees} limit={6} />
      <div className="area-right">
        <QRVerification eventId={eventId} onScan={addScan} />
        <ScannerLog log={scanLog} />
      </div>
    </div>
  );
}
