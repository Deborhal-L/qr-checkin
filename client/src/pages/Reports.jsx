import { useOutletContext } from "react-router-dom";

export default function Reports() {
  const { stats, attendees = [] } = useOutletContext() || {};

  const totalTickets = stats?.ticketsSold ?? attendees.length;
  const revenue = stats?.revenue ?? 0;
  const checkedIn = attendees.filter((person) => person.checkedInAt).length;
  const pending = Math.max(0, totalTickets - checkedIn);

  const cards = [
    {
      title: "Tickets Sold",
      value: totalTickets,
      icon: "🎟️",
      color: "#e8efff",
      accent: "#315bd6",
    },
    {
      title: "Total Revenue",
      value: `$${Number(revenue).toLocaleString()}`,
      icon: "💰",
      color: "#e4f8ed",
      accent: "#168653",
    },
    {
      title: "Checked In",
      value: checkedIn,
      icon: "✅",
      color: "#eee8ff",
      accent: "#7542c8",
    },
    {
      title: "Pending",
      value: pending,
      icon: "⏳",
      color: "#fff1dc",
      accent: "#c77716",
    },
  ];

  function downloadCSV() {
    const rows = [
      ["Name", "Email", "Ticket", "Status"],
      ...attendees.map((person) => [
        person.name || "",
        person.email || "",
        person.ticketType || "",
        person.checkedInAt ? "VERIFIED" : "Pending",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcheck-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "28px",
        color: "var(--text-primary, #17233d)",
      }}
    >
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 30, margin: "0 0 8px", fontWeight: 750 }}>
          Reports 📊
        </h1>
        <p style={{ margin: 0, color: "#718096", lineHeight: 1.6 }}>
          A quick overview of your event performance.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 18,
          marginBottom: 30,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: card.color,
              borderRadius: 16,
              padding: "22px",
              border: `1px solid ${card.accent}22`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <span style={{ color: "#526078", fontSize: 14, fontWeight: 600 }}>
                {card.title}
              </span>
              <span
                style={{
                  fontSize: 23,
                  background: "#ffffffaa",
                  borderRadius: 10,
                  padding: "7px",
                }}
              >
                {card.icon}
              </span>
            </div>
            <div
              style={{
                color: card.accent,
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          background: "var(--card-bg, #ffffff)",
          border: "1px solid var(--border-color, #e5e7eb)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>Attendee Report</h2>
            <p style={{ margin: 0, color: "#718096", fontSize: 14 }}>
              {attendees.length} attendee records
            </p>
          </div>

          <button
            onClick={downloadCSV}
            style={{
              padding: "11px 16px",
              borderRadius: 10,
              border: "none",
              background: "#315bd6",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↓ Download CSV
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              minWidth: 550,
            }}
          >
            <thead>
              <tr style={{ background: "var(--surface-bg, #f5f7fb)" }}>
                {["Attendee", "Email", "Ticket", "Status"].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "14px 12px",
                      color: "#667085",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendees.map((person, index) => {
                const verified = Boolean(person.checkedInAt);

                return (
                  <tr
                    key={person.id || person._id || index}
                    style={{
                      borderBottom: "1px solid var(--border-color, #edf0f5)",
                    }}
                  >
                    <td style={{ padding: "16px 12px", fontWeight: 650 }}>
                      {person.name || "—"}
                    </td>
                    <td
                      style={{
                        padding: "16px 12px",
                        color: "#667085",
                      }}
                    >
                      {person.email || "—"}
                    </td>
                    <td style={{ padding: "16px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: 7,
                          background: "#eee8ff",
                          color: "#7542c8",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {person.ticketType || "General"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 20,
                          background: verified ? "#e4f8ed" : "#fff1dc",
                          color: verified ? "#168653" : "#c77716",
                          fontSize: 12,
                          fontWeight: 750,
                        }}
                      >
                        {verified ? "✓ VERIFIED" : "• PENDING"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {attendees.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: 28,
                      textAlign: "center",
                      color: "#718096",
                    }}
                  >
                    No attendee records available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
