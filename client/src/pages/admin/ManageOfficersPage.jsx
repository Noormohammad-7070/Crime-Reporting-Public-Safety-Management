import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';

const empty = { name: '', email: '', phone: '', password: '', address: '', badgeNumber: '', department: '', designation: '', availabilityStatus: 'available' };

export default function ManageOfficersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/officers').then((res) => setItems(res.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await api.put(`/officers/${editing}`, payload);
        toast.success('Officer updated');
      } else {
        await api.post('/officers', form);
        toast.success('Officer created');
      }
      setForm(empty); setEditing(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const edit = (o) => {
    setEditing(o._id);
    setForm({ name: o.userId?.name || '', email: o.userId?.email || '', phone: o.userId?.phone || '', password: '', address: o.userId?.address || '', badgeNumber: o.badgeNumber || '', department: o.department || '', designation: o.designation || '', availabilityStatus: o.availabilityStatus || 'available' });
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Manage Officers</h1><p className="subtle">Create, view, and update police officer accounts and profiles.</p></div>
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-3 gap-4">
        <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">Email *</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="label">Password {editing ? '(leave blank to keep)' : '*'}</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <div><label className="label">Badge Number *</label><input className="input" value={form.badgeNumber} onChange={(e) => setForm({ ...form, badgeNumber: e.target.value })} /></div>
        <div><label className="label">Department *</label><input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
        <div><label className="label">Designation</label><input className="input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
        <div><label className="label">Availability</label><select className="input" value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}><option value="available">available</option><option value="busy">busy</option><option value="off-duty">off-duty</option></select></div>
        <div className="md:col-span-3"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="md:col-span-3 flex gap-2"><button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Officer' : 'Create Officer'}</button>{editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(empty); }}>Cancel Edit</button>}</div>
      </form>

      <div className="card p-5 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Badge</th><th>Department</th><th>Designation</th><th>Availability</th><th>Assigned</th><th></th></tr></thead>
          <tbody>
            {items.map((o) => (
              <tr key={o._id}>
                <td className="font-medium">{o.userId?.name}</td><td>{o.userId?.email}</td><td>{o.badgeNumber}</td><td>{o.department}</td><td>{o.designation || '-'}</td><td>{o.availabilityStatus}</td><td>{o.assignedCases?.length || 0}</td>
                <td><button className="btn-secondary !py-1 !px-2 text-xs" onClick={() => edit(o)}>Edit</button></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="8" className="text-center text-slate-500 py-6">No officers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
