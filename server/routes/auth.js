const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (u) =>
  jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ msg: 'Name, email and a password of 6+ characters are required' });
  }
  try {
    const user = await User.create({
      name,
      email,
      role: role === 'organizer' ? 'organizer' : 'attendee',
      password: await bcrypt.hash(password, 10),
    });
    res.json({ token: sign(user), role: user.role, name: user.name });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ msg: 'Email already in use' });
    res.status(500).json({ msg: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  res.json({ token: sign(user), role: user.role, name: user.name });
});

module.exports = router;
