import { useOutletContext } from "react-router-dom";
import { CURRENCY, num } from "../utils.js";

export default function Reports() {
  const { event, stats, attendees } = useOutletContext();

  const total = stats?.total ?? attendees.length;
  const checkedIn =
    stats?.checkedIn ?? attendees.filter((a) => a.checkedInAt).length;
  const pending = Math.max(0, total - checkedIn);
  const attendanceRate = total ? Math.round((checkedIn / total) * 100) : 0;

  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Ticket Type", "Check-in Status", "Check-in Time"],
      ...attendees.map((a) => [
        a.name,
        a.email,
        a.ticketType,
        a.checkedInAt ? "Checked In" : "Pending",
        a.checkedInAt ? new Date(a.checkedInAt).toLocaleString() : "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(event?.title || "QRCHECK-report").replace(/[^a-z0-9]/gi, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content">
      <div className="row between">
        <div>
          <h2>Event Reports</h2>
          <p className="muted">
            {event?.title || "Select an event"} · Attendance and ticket summary
          </p>
        </div>
        <button
          className="btn"
          onClick={exportCSV}
          disabled={!attendees.length}
        >
          Export CSV
        </button>
      </div>

      <div className="grid">
        <div className="card">
          <p className="muted">Tickets Sold</p>
          <h2>{num(total)}</h2>
        </div>

        <div className="card">
          <p className="muted">Revenue</p>
          <h2>
            {CURRENCY}
            {num(stats?.revenue ?? 0)}
          </h2>
        </div>

        <div className="card">
          <p className="muted">Checked In</p>
          <h2>{num(checkedIn)}</h2>
        </div>

        <div className="card">
          <p className="muted">Pending Guests</p>
          <h2>{num(pending)}</h2>
        </div>
      </div>

      <div className="card">
        <h3>Attendance Summary</h3>
        <div className="row between">
          <span>Attendance rate</span>
          <strong>{attendanceRate}%</strong>
        </div>

        <div
          style={{
            height: 10,
            background: "#e8edf5",
            borderRadius: 20,
            overflow: "hidden",
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: `${attendanceRate}%`,
              height: "100%",
              background: "#22a55a",
              borderRadius: 20,
              transition: "width 0.3s",
            }}
          />
        </div>

        <p className="muted">
          {checkedIn} of {total} registered attendees have checked in.
        </p>
      </div>

      <div className="card">
        <h3>Attendee Report</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Ticket</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="muted">
                    No attendee data available for this event.
                  </td>
                </tr>
              ) : (
                attendees.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.ticketType}</td>
                    <td>
                      <span
                        className={`pill ${a.checkedInAt ? "verified" : "pending"}`}
                      >
                        {a.checkedInAt ? "CHECKED IN" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
