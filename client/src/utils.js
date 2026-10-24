export const CURRENCY = '$';

export const num = (n) => Number(n || 0).toLocaleString('en-US');

// 24h HH:MM:SS like the reference feed
export const fmtTime = (d) => (d ? new Date(d).toLocaleTimeString('en-GB') : '--');

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).map((s) => s[0]).slice(0, 2).join('').toUpperCase();

const COLORS = ['#d9a07e', '#b98a9c', '#7f9fc0', '#86b596', '#a99dc4', '#c99b6a'];
export const avatarColor = (name = '') =>
  COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

export function eventStatus(date) {
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'LIVE';
  return d > now ? 'UPCOMING' : 'ENDED';
}

// event closest to "now" becomes the default selection
export function pickDefaultEvent(events) {
  if (!events.length) return '';
  const now = Date.now();
  return [...events].sort((a, b) => Math.abs(new Date(a.date) - now) - Math.abs(new Date(b.date) - now))[0]._id;
}
