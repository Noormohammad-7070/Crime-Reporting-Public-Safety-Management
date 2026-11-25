import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function AssignCasesPage() {
  const [reports, setReports] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ complaintId: '', officerId: '', remarks: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [r, o] = await Promise.all([api.get('/reports'), api.get('/officers')]);
      setReports(r.data);
      setOfficers(o.data);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const assign = async (e) => {
    e.preventDefault();
    if (!form.complaintId || !form.officerId) return toast.error('Select complaint and officer');
    setSubmitting(true);
    try {
      await api.post('/cases/assign', form);
      toast.success('Case assigned successfully');
      setForm({ complaintId: '', officerId: '', remarks: '' });
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Assignment failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Loading />;
  const assignable = reports.filter((r) => ['Submitted','Under Review','Verified','Assigned'].includes(r.status));

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Assign Cases</h1><p className="subtle">Assign verified or pending complaints to police officers.</p></div>
      <form onSubmit={assign} className="card p-5 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="label">Complaint</label>
          <select className="input" value={form.complaintId} onChange={(e) => setForm({ ...form, complaintId: e.target.value })}>
            <option value="">Select complaint</option>
            {assignable.map((r) => <option key={r._id} value={r.complaintId}>{r.complaintId} - {r.title} ({r.status})</option>)}
          </select>
        </div>
        <div>
          <label className="label">Officer</label>
          <select className="input" value={form.officerId} onChange={(e) => setForm({ ...form, officerId: e.target.value })}>
            <option value="">Select officer</option>
            {officers.map((o) => <option key={o._id} value={o._id}>{o.userId?.name} - {o.badgeNumber} ({o.department})</option>)}
          </select>
        </div>
        <div>
          <label className="label">Remarks</label>
          <input className="input" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional assignment note" />
        </div>
        <div className="md:col-span-3"><button className="btn-primary" type="submit" disabled={submitting}>{submitting ? 'Assigning...' : 'Assign Case'}</button></div>
      </form>

      <div className="card p-5 overflow-x-auto">
        <h2 className="font-semibold text-navy-900 mb-3">Assignable Complaints</h2>
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Current Officer</th></tr></thead>
          <tbody>
            {assignable.map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td>{r.category}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{r.assignedOfficer?.userId?.name || 'Unassigned'}</td>
              </tr>
            ))}
            {!assignable.length && <tr><td colSpan="5" className="text-center text-slate-500 py-6">No assignable complaints.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
