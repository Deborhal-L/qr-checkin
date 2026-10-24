import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Full name" required value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" type="email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password (min 6 chars)" type="password" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
      </select>
      {error && <p className="error">{error}</p>}
      <button className="btn">Create account</button>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
