import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OrganizerLayout from "./components/OrganizerLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Events from "./pages/Events.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OrgEvents from "./pages/OrgEvents.jsx";
import Attendees from "./pages/Attendees.jsx";
import CheckIns from "./pages/CheckIns.jsx";
import Reports from "./pages/Reports.jsx";
import Notifications from "./pages/Notifications.jsx";
import Settings from "./pages/Settings.jsx";

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={user.role === "organizer" ? "/dashboard" : "/events"}
      replace
    />
  );
}

// top navbar + centered container for login / register / attendee pages
function Shell() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/events"
          element={
            <ProtectedRoute role="attendee">
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute role="attendee">
              <MyTickets />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* organizer: sidebar layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="organizer">
            <OrganizerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="events" element={<OrgEvents />} />
        <Route path="attendees" element={<Attendees />} />
        <Route path="checkins" element={<CheckIns />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
