import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function InvestigationNotesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ caseId: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/cases/assigned').then((res) => setCases(res.data)).finally(() => setLoading(false)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.caseId || !form.notes.trim()) return toast.error('Select a case and enter notes');
    setSaving(true);
    try {
      await api.post(`/cases/${form.caseId}/notes`, { notes: form.notes });
      toast.success('Investigation note added');
      setForm({ caseId: '', notes: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add note'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-6 max-w-4xl">
      <div><h1 className="page-title">Investigation Notes</h1><p className="subtle">Record investigation notes for assigned cases.</p></div>
      <form onSubmit={submit} className="card p-5 space-y-4">
        <div>
          <label className="label">Assigned Case</label>
          <select className="input" value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })}>
            <option value="">Select case</option>
            {cases.map((c) => <option key={c._id} value={c._id}>{c.complaintId} - {c.title} ({c.status})</option>)}
          </select>
        </div>
        <div><label className="label">Notes *</label><textarea className="input min-h-[160px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Enter investigation observations, actions taken, or follow-ups..." /></div>
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Note'}</button>
      </form>
      <div className="text-sm text-slate-600">To view all notes for a case, open its details from Assigned Cases or Completed Cases.</div>
    </div>
  );
}
