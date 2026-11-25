import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

export default function OfficerProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/me/profile').then((res) => {
      setForm({ name: res.data.name || '', email: res.data.email || '', phone: res.data.phone || '', address: res.data.address || '', password: '' });
    }).finally(() => setLoading(false));
    // officer profile info from auth/me
    api.get('/auth/me').then((res) => setOfficer(res.data.user?.officerProfile || null)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      await api.put('/users/me/profile', payload);
      await refreshUser();
      setForm((f) => ({ ...f, password: '' }));
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="page-title">Profile Settings</h1><p className="subtle">Manage your officer account information.</p></div>
      {officer && (
        <div className="card p-5 grid sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Badge:</span> <strong>{officer.badgeNumber}</strong></div>
          <div><span className="text-slate-500">Department:</span> <strong>{officer.department}</strong></div>
          <div><span className="text-slate-500">Designation:</span> <strong>{officer.designation || '-'}</strong></div>
          <div><span className="text-slate-500">Availability:</span> <strong>{officer.availabilityStatus}</strong></div>
        </div>
      )}
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email (read-only)</label><input className="input bg-slate-100" value={form.email} readOnly /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="label">New Password (optional)</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
      <p className="text-xs text-slate-500">Badge/department details are managed by administrators.</p>
    </div>
  );
}
