const router = require('express').Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

// POST /api/checkin   body: { code, eventId }
// Atomic update: only a ticket that is NOT yet checked in gets updated,
// so two scanners can never admit the same ticket twice.
router.post('/', auth('organizer'), async (req, res) => {
  const { code, eventId } = req.body;
  if (!code || !eventId) return res.status(400).json({ msg: 'code and eventId are required' });

  const ev = await Event.findById(eventId).catch(() => null);
  if (!ev || String(ev.organizer) !== req.user.id) {
    return res.status(403).json({ msg: 'Not your event' });
  }

  const clean = String(code).trim();
  const ticket = await Ticket.findOneAndUpdate(
    { code: clean, event: eventId, checkedInAt: null },
    { checkedInAt: new Date() },
    { new: true }
  ).populate('user', 'name');

  if (!ticket) {
    const exists = await Ticket.findOne({ code: clean, event: eventId }).populate('user', 'name');
    if (exists) {
      return res.status(409).json({ msg: `Already checked in (${exists.user.name})` });
    }
    return res.status(404).json({ msg: 'Invalid ticket for this event' });
  }

  // real-time push to every dashboard watching this event
  const io = req.app.get('io');
  io.to(String(eventId)).emit('checkin', {
    id: ticket._id,
    name: ticket.user.name,
    ticketType: ticket.ticketType,
    time: ticket.checkedInAt,
  });

  res.json({ msg: 'Checked in', name: ticket.user.name, ticketType: ticket.ticketType });
});

module.exports = router;
