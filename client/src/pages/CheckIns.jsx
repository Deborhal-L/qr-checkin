import { useOutletContext } from 'react-router-dom';
import LiveFeed from '../components/dashboard/LiveFeed.jsx';

export default function CheckIns() {
  const { attendees, event } = useOutletContext();
  return <LiveFeed attendees={attendees} title={`All check-ins${event ? ' · ' + event.title : ''}`} />;
}
