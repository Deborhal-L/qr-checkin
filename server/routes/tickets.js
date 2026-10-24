const router = require('express').Router();
const QRCode = require('qrcode');
const auth = require('../middleware/auth');
const Ticket = require('../models/Ticket');

// GET /api/tickets/mine  (attendee's tickets with QR images)
router.get('/mine', auth('attendee'), async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id }).populate('event').sort('-createdAt');
  const out = await Promise.all(
    tickets
      .filter((t) => t.event) // skip tickets whose event was deleted
      .map(async (t) => ({
        id: t._id,
        event: t.event,
        ticketType: t.ticketType,
        checkedInAt: t.checkedInAt,
        qr: await QRCode.toDataURL(t.code, { width: 300, margin: 1 }),
      }))
  );
  res.json(out);
});

module.exports = router;
