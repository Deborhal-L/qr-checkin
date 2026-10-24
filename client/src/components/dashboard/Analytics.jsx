import { CURRENCY, num } from '../../utils.js';

function Bars({ data }) {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox="0 0 140 70" className="chart" role="img" aria-label="Registrations, last 7 days">
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * 60);
        return (
          <rect
            key={i}
            x={i * 20 + 4}
            y={66 - h}
            width="14"
            height={h}
            rx="3"
            fill={i === data.length - 1 ? '#c9d6ee' : '#2f6fd6'}
            opacity={i % 2 ? 0.85 : 1}
          />
        );
      })}
    </svg>
  );
}

function Line({ data }) {
  const max = Math.max(...data, 1);
  const n = data.length;
  const pts = data.map((v, i) => [(i / (n - 1)) * 150 + 5, 62 - (v / max) * 50]);
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = `M${pts[0][0]},66 L${pts.map((p) => p.join(',')).join(' L')} L${pts[n - 1][0]},66 Z`;
  return (
    <svg viewBox="0 0 160 70" className="chart" role="img" aria-label="Check-ins, last hour">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a86e8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4a86e8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)" />
      <polyline points={line} fill="none" stroke="#4a86e8" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function Analytics({ stats }) {
  const bars = stats?.salesByDay?.map((d) => d.count) || Array(7).fill(0);
  const trend = stats?.trend || Array(12).fill(0);

  return (
    <div className="card area-analytics">
      <div className="row between top">
        <h4 className="ctitle">Organizer Analytics</h4>
        <div className="kpis">
          <div><span className="muted">Ticket Sales</span><b>{num(stats?.total)}</b></div>
          <div><span className="muted">Revenue</span><b>{CURRENCY}{num(stats?.revenue)}</b></div>
        </div>
      </div>
      <div className="charts">
        <Bars data={bars} />
        <Line data={trend} />
      </div>
      <div className="row between tiny muted">
        <span>Registrations · last 7 days</span>
        <span>Check-ins · last hour</span>
      </div>
    </div>
  );
}
