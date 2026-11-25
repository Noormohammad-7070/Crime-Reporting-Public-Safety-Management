import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

export default function AdminSettingsPage() {
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/users/me/profile').then((res) => setForm({ name: res.data.name || '', email: res.data.email || '', phone: res.data.phone || '', address: res.data.address || '', password: '' })).finally(() => setLoading(false)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      await api.put('/users/me/profile', payload);
      await refreshUser();
      setForm((f) => ({ ...f, password: '' }));
      toast.success('Settings saved');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="page-title">Admin Settings</h1><p className="subtle">Manage administrator profile and account security.</p></div>
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email (read-only)</label><input className="input bg-slate-100" value={form.email} readOnly /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">New Password (optional)</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
      <div className="card p-5">
        <h2 className="font-semibold text-navy-900 mb-2">Security Notes</h2>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>Passwords are stored using bcrypt hashing; never share credentials.</li>
          <li>JWT tokens are used for authentication and role-based access control.</li>
          <li>Sensitive citizen information and evidence access are restricted to authorized roles.</li>
          <li>All key actions are recorded in audit logs.</li>
        </ul>
      </div>
    </div>
  );
}
