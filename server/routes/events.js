const router = require('express').Router();
const crypto = require('crypto');
const QRCode = require('qrcode');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

const TYPES = ['GA', 'VIP', 'SPEAKER'];

// Helper: load an event and make sure the logged-in organizer owns it
async function ownedEvent(req, res) {
  const ev = await Event.findById(req.params.id).catch(() => null);
  if (!ev) {
    res.status(404).json({ msg: 'Event not found' });
    return null;
  }
  if (String(ev.organizer) !== req.user.id) {
    res.status(403).json({ msg: 'Not your event' });
    return null;
  }
  return ev;
}

// POST /api/events  (organizer creates an event)
router.post('/', auth('organizer'), async (req, res) => {
  const { title, description, date, venue, capacity, price } = req.body;
  if (!title || !date || !venue) return res.status(400).json({ msg: 'Title, date and venue are required' });
  const cap = Number(capacity) || 100;
  const pr = Number(price) || 0;
  if (cap < 1 || pr < 0) return res.status(400).json({ msg: 'Invalid capacity or price' });
  const ev = await Event.create({ title, description, date, venue, capacity: cap, price: pr, organizer: req.user.id });
  res.json(ev);
});

// GET /api/events  (everyone logged in sees all events)
router.get('/', auth(), async (req, res) => {
  res.json(await Event.find().sort('date'));
});

// GET /api/events/mine  (organizer's own events) - must be above /:id
router.get('/mine', auth('organizer'), async (req, res) => {
  res.json(await Event.find({ organizer: req.user.id }).sort('date'));
});

// POST /api/events/:id/register  (attendee gets a ticket + QR)   body: { ticketType }
router.post('/:id/register', auth('attendee'), async (req, res) => {
  const ev = await Event.findById(req.params.id).catch(() => null);
  if (!ev) return res.status(404).json({ msg: 'Event not found' });

  let ticket = await Ticket.findOne({ event: ev._id, user: req.user.id });
  if (!ticket) {
    const sold = await Ticket.countDocuments({ event: ev._id });
    if (sold >= ev.capacity) return res.status(400).json({ msg: 'Event is full' });
    ticket = await Ticket.create({
      event: ev._id,
      user: req.user.id,
      ticketType: TYPES.includes(req.body.ticketType) ? req.body.ticketType : 'GA',
      code: crypto.randomBytes(16).toString('hex'),
    });
  }
  res.json({ ticket, event: ev, qr: await QRCode.toDataURL(ticket.code, { width: 300, margin: 1 }) });
});

// GET /api/events/:id/stats  (organizer) - powers the dashboard cards and charts
router.get('/:id/stats', auth('organizer'), async (req, res) => {
  const ev = await ownedEvent(req, res);
  if (!ev) return;

  const tickets = await Ticket.find({ event: ev._id }).select('createdAt checkedInAt');
  const total = tickets.length;
  const checkedIn = tickets.filter((t) => t.checkedInAt).length;

  // registrations per day, last 7 days (oldest -> newest)
  const DAY = 86400000;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const salesByDay = [];
  for (let i = 6; i >= 0; i--) {
    const from = new Date(start.getTime() - i * DAY);
    const to = new Date(from.getTime() + DAY);
    salesByDay.push({
      date: from.toISOString().slice(0, 10),
      count: tickets.filter((t) => t.createdAt >= from && t.createdAt < to).length,
    });
  }

  // cumulative check-ins over the last hour, 5-minute buckets
  const now = Date.now();
  const times = tickets.filter((t) => t.checkedInAt).map((t) => +t.checkedInAt);
  const trend = [];
  for (let i = 11; i >= 0; i--) {
    const end = now - i * 5 * 60000;
    trend.push(times.filter((x) => x <= end).length);
  }

  res.json({
    total,
    checkedIn,
    remaining: total - checkedIn,
    capacity: ev.capacity,
    price: ev.price,
    revenue: total * ev.price,
    salesByDay,
    trend,
  });
});

// GET /api/events/:id/attendees  (organizer)
router.get('/:id/attendees', auth('organizer'), async (req, res) => {
  const ev = await ownedEvent(req, res);
  if (!ev) return;
  const tickets = await Ticket.find({ event: ev._id }).populate('user', 'name email').sort('-createdAt');
  res.json(
    tickets
      .filter((t) => t.user)
      .map((t) => ({
        id: t._id,
        name: t.user.name,
        email: t.user.email,
        ticketType: t.ticketType,
        checkedInAt: t.checkedInAt,
      }))
  );
});

module.exports = router;
