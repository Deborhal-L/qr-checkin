import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const DEFAULTS = {
  registration: true,
  checkin: true,
  capacity: true,
};

export default function Settings() {
  const { user } = useAuth();

  const [preferences, setPreferences] = useState(() => {
    try {
      return {
        ...DEFAULTS,
        ...JSON.parse(localStorage.getItem("qrc-settings") || "{}"),
      };
    } catch {
      return DEFAULTS;
    }
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem("qrc-settings", JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, checked) => {
    setPreferences((current) => ({ ...current, [key]: checked }));
    setSaved(false);
  };

  return (
    <div
      className="page-content"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "32px 28px 48px",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "30px", margin: "0 0 12px" }}>Settings</h2>
        <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
          Manage your organizer profile and application preferences.
        </p>
      </div>

      {/* Organizer Profile */}
      <div className="card" style={{ padding: "28px", marginBottom: "28px" }}>
        <h3 style={{ fontSize: "20px", margin: "0 0 24px" }}>
          Organizer Profile
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Name
            </label>
            <input
              value={user?.name || ""}
              readOnly
              placeholder="Organizer name"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Email
            </label>
            <input
              value={user?.email || ""}
              readOnly
              placeholder="Organizer email"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <p className="muted" style={{ margin: "20px 0 0", lineHeight: 1.7 }}>
          Profile information is read-only in this version.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="card" style={{ padding: "28px", marginBottom: "28px" }}>
        <h3 style={{ fontSize: "20px", margin: "0 0 12px" }}>
          Notification Preferences
        </h3>

        <p className="muted" style={{ margin: "0 0 24px", lineHeight: 1.7 }}>
          Choose which types of in-app updates you want enabled. These
          preferences are saved in this browser.
        </p>

        {[
          {
            key: "registration",
            title: "New registrations",
            description: "Attendee registration updates",
          },
          {
            key: "checkin",
            title: "Successful check-ins",
            description: "Attendee verification updates",
          },
          {
            key: "capacity",
            title: "Event capacity alerts",
            description: "Alerts when an event is nearly full",
          },
        ].map((item) => (
          <label
            key={item.key}
            className="row between"
            style={{
              padding: "20px 0",
              gap: "20px",
              borderTop: "1px solid var(--border-color, #e5e7eb)",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <strong>{item.title}</strong>
              <small className="muted">{item.description}</small>
            </span>

            <input
              type="checkbox"
              checked={preferences[item.key]}
              onChange={(e) => updatePreference(item.key, e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                flexShrink: 0,
                cursor: "pointer",
              }}
            />
          </label>
        ))}

        <div style={{ marginTop: "24px" }}>
          <button
            className="btn"
            onClick={() => {
              localStorage.setItem("qrc-settings", JSON.stringify(preferences));
              setSaved(true);
            }}
          >
            Save Preferences
          </button>

          {saved && (
            <p className="ok" style={{ marginTop: "16px" }}>
              Preferences saved successfully.
            </p>
          )}
        </div>
      </div>

      {/* Security */}
      <div className="card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "20px", margin: "0 0 16px" }}>Security</h3>

        <p className="muted" style={{ margin: 0, lineHeight: 1.8 }}>
          Your account authentication is managed by QRCHECK. Password changes
          are not included in this settings page yet.
        </p>
      </div>
    </div>
  );
}
