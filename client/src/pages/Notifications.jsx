import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function Notifications() {
  const { event, attendees } = useOutletContext();
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qrc-notifications-read") || "[]");
    } catch {
      return [];
    }
  });

  const notifications = attendees
    .flatMap((a) => {
      const items = [
        {
          id: `registered-${a.id}`,
          title: "New attendee registered",
          message: `${a.name} registered for ${event?.title || "your event"}.`,
          time: a.createdAt || null,
          type: "registration",
        },
      ];

      if (a.checkedInAt) {
        items.push({
          id: `checkin-${a.id}`,
          title: "Attendee checked in",
          message: `${a.name} (${a.ticketType}) checked in successfully.`,
          time: a.checkedInAt,
          type: "checkin",
        });
      }

      return items;
    })
    .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));

  useEffect(() => {
    localStorage.setItem("qrc-notifications-read", JSON.stringify(readIds));
  }, [readIds]);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id),
  ).length;

  const markRead = (id) => {
    setReadIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  };

  const markAllRead = () => {
    setReadIds((current) => [
      ...new Set([...current, ...notifications.map((n) => n.id)]),
    ]);
  };

  return (
    <div className="page-content">
      <div className="row between">
        <div>
          <h2>Notifications</h2>
          <p className="muted">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          className="btn small"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="center">
            <h3>You're all caught up!</h3>
            <p className="muted">
              Registration and check-in updates will appear here when attendee
              data is available.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const isRead = readIds.includes(n.id);

            return (
              <div
                key={n.id}
                className="listrow"
                style={{
                  alignItems: "flex-start",
                  background: isRead ? "transparent" : "#f1f6ff",
                  padding: 14,
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              >
                <div className="grow">
                  <strong>{n.title}</strong>
                  {!isRead && (
                    <span className="pill" style={{ marginLeft: 8 }}>
                      NEW
                    </span>
                  )}
                  <p className="muted">{n.message}</p>
                  <small className="muted">
                    {n.time
                      ? new Date(n.time).toLocaleString()
                      : "Time unavailable"}
                  </small>
                </div>

                {!isRead && (
                  <button className="btn small" onClick={() => markRead(n.id)}>
                    Mark read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="muted">
        These notifications are generated from the selected event's attendee and
        check-in records. They are in-app updates, not email or SMS alerts.
      </p>
    </div>
  );
}
