import { useState } from 'react';
import api, { errMsg } from '../api.js';

export default function CreateEvent({ onCreated }) {
  const empty = { title: '', date: '', venue: '', description: '', capacity: 100, price: 0 };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/events', form);
      setForm(empty);
      setError('');
      onCreated(data);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h4 className="ctitle">Create event</h4>
      <input placeholder="Title" required value={form.title} onChange={set('title')} />
      <input type="datetime-local" required value={form.date} onChange={set('date')} />
      <input placeholder="Venue" required value={form.venue} onChange={set('venue')} />
      <input placeholder="Description (optional)" value={form.description} onChange={set('description')} />
      <div className="row">
        <label className="field">Capacity
          <input type="number" min="1" value={form.capacity} onChange={set('capacity')} />
        </label>
        <label className="field">Ticket price
          <input type="number" min="0" value={form.price} onChange={set('price')} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="btn">Create</button>
    </form>
  );
}
