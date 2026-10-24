require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());

const app = express();
app.use(cors({ origin: origins }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: origins } });
app.set('io', io);

// Dashboards join a room per event so they only get that event's check-ins
io.on('connection', (socket) => {
  socket.on('join', (eventId) => socket.join(String(eventId)));
  socket.on('leave', (eventId) => socket.leave(String(eventId)));
});

app.get('/', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/checkin', require('./routes/checkin'));

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => server.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
