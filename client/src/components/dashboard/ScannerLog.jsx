import Icon from '../Icons.jsx';
import { fmtTime } from '../../utils.js';

export default function ScannerLog({ log }) {
  return (
    <div className="card">
      <div className="row between">
        <h4 className="ctitle">Scanner Log</h4>
        <span className="muted"><Icon name="dots" size={18} /></span>
      </div>
      {log.length === 0 ? (
        <p className="muted small">No scans yet</p>
      ) : (
        <ul className="log">
          {log.map((l, i) => (
            <li key={i}>
              <span className={'dot ' + (l.ok ? 'ok' : 'bad')} />
              <span className="grow">{l.text}</span>
              <time>{fmtTime(l.time)}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
