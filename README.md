# QR-Based Event Check-In System

React + Node.js + MongoDB + Socket.IO. Attendees get QR tickets; organizers scan them on a live dashboard.

## File structure

```
qr-checkin/
├── server/
│   ├── index.js                  # Express + Socket.IO entry
│   ├── package.json, .env.example
│   ├── config/db.js              # Mongo connection
│   ├── middleware/auth.js        # JWT + role guard
│   ├── models/                   # User, Event, Ticket
│   └── routes/                   # auth, events (+stats), tickets, checkin
└── client/
    ├── index.html, vite.config.js, vercel.json, package.json, .env.example
    └── src/
        ├── main.jsx, App.jsx, api.js, utils.js, index.css
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx, ProtectedRoute.jsx, CreateEvent.jsx, Icons.jsx
        │   ├── OrganizerLayout.jsx        # sidebar + shared organizer state + socket
        │   └── dashboard/                 # TodayEvent, AttendeeStats, Analytics,
        │                                  # LiveFeed, QRVerification, ScannerLog
        └── pages/
            ├── Login, Register
            ├── Events, MyTickets          # attendee
            └── Dashboard, OrgEvents, Attendees, CheckIns, ComingSoon   # organizer
```

## Run locally

Prerequisite: MongoDB running locally (or an Atlas URI).

```bash
# Terminal 1 - API
cd server
copy .env.example .env      # Mac/Linux: cp
npm install
npm run dev

# Terminal 2 - frontend
cd client
copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

## Workflow

1. Register an **organizer** and an **attendee** (normal window + incognito).
2. Organizer: Events -> create an event (title, date, venue, capacity, price). You land on the dashboard.
3. Attendee: Events -> pick a ticket type (GA / VIP / SPEAKER) -> **Get ticket** -> QR appears.
4. Organizer: scan the QR with the camera card, or paste the ticket code.
5. The dashboard updates instantly: Today's Event progress, Attendee Statistics, Organizer Analytics, Live Check-in Feed, and Scanner Log.
6. Scan again -> "Already checked in".

## Dashboard cards

| Card | Data |
|---|---|
| Today's Event | selected event, LIVE / UPCOMING / ENDED, check-ins vs capacity |
| Attendee Statistics | checked-in vs remaining guests |
| Organizer Analytics | registrations per day (bars), check-ins in the last hour (line), ticket sales, revenue = tickets x price |
| Live Check-in Feed | latest verified attendees with ticket type and time (updates over Socket.IO) |
| QR Ticket Verification | live camera, scan frame, verified / rejected toast |
| Scanner Log | every scan result this session |

Reports, Notifications and Settings in the sidebar are placeholders.

## API

| Method | Route | Role | Purpose |
|---|---|---|---|
| POST | /api/auth/register, /login | - | Auth, returns JWT |
| POST | /api/events | organizer | Create event |
| GET | /api/events | any | List all events |
| GET | /api/events/mine | organizer | Own events |
| POST | /api/events/:id/register | attendee | Get ticket + QR (body: ticketType) |
| GET | /api/events/:id/stats | organizer | totals, revenue, chart data |
| GET | /api/events/:id/attendees | organizer | Attendee list |
| GET | /api/tickets/mine | attendee | My tickets + QR |
| POST | /api/checkin | organizer | Validate + check in (atomic) |

Socket.IO: dashboard emits `join(eventId)`; server emits `checkin` to that room.

## Deploy

- Database: MongoDB Atlas -> put the URI in `MONGO_URI`.
- API: Render (root `server`, build `npm install`, start `node index.js`). Env: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=<your vercel url>`.
- Client: Vercel (root `client`, build `npm run build`, output `dist`). Env: `VITE_API_URL=<your render url>`. `vercel.json` already handles page refresh on routes.
- Camera scanning needs HTTPS or localhost (Vercel is HTTPS).

## Resume bullets

- Built a QR-based event check-in platform (React, Node.js, MongoDB) with JWT role-based auth (organizer/attendee), unique QR ticket generation and VIP / Speaker / GA ticket types.
- Implemented atomic check-in validation to block duplicate entry, and a real-time organizer dashboard (Socket.IO) with attendance stats, analytics charts and a live check-in feed.
