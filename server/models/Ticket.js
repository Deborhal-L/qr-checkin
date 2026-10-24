const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticketType: { type: String, enum: ['GA', 'VIP', 'SPEAKER'], default: 'GA' },
    code: { type: String, required: true, unique: true }, // random value encoded in the QR
    checkedInAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// one ticket per user per event
ticketSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
