import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function PublicSafetyAlertsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', location: '', severity: 'medium' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/alerts').then((res) => setItems(res.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required');
    setSaving(true);
    try {
      await api.post('/alerts', form);
      toast.success('Alert published');
      setForm({ title: '', description: '', location: '', severity: 'medium' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to publish alert'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this alert?')) return;
    try { await api.delete(`/alerts/${id}`); toast.success('Alert deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Public Safety Alerts</h1><p className="subtle">Publish and manage alerts for citizens and staff.</p></div>
      <form onSubmit={submit} className="card p-5 grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><label className="label">Title *</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="label">Location</label><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div><label className="label">Severity</label><select className="input" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="critical">critical</option></select></div>
        <div className="md:col-span-2"><label className="label">Description *</label><textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="md:col-span-2"><button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Publishing...' : 'Publish Alert'}</button></div>
      </form>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a._id} className="card p-4 border-l-4 border-red-600">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><h3 className="font-semibold text-navy-900">{a.title}</h3><span className="badge bg-red-100 text-red-700 uppercase">{a.severity}</span></div>
                <p className="text-sm text-slate-700 mt-1">{a.description}</p>
                <p className="text-xs text-slate-500 mt-2">{a.location || 'General'} · {new Date(a.createdAt).toLocaleString()} {a.publishedBy?.name ? `· by ${a.publishedBy.name}` : ''}</p>
              </div>
              <button className="btn-danger !py-1 !px-2 text-xs" onClick={() => remove(a._id)}>Delete</button>
            </div>
          </div>
        ))}
        {!items.length && <div className="card p-6 text-center text-slate-500">No alerts published yet.</div>}
      </div>
    </div>
  );
}
