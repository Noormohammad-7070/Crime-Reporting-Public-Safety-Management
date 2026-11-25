import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function AllReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get('/reports', { params: status ? { status } : {} }).then((res) => setItems(res.data)).finally(() => setLoading(false));
  }, [status]);

  const filtered = items.filter((r) => [r.complaintId, r.title, r.category, r.location, r.userId?.name].some((v) => String(v || '').toLowerCase().includes(q.toLowerCase())));
  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div><h1 className="page-title">All Crime Reports</h1><p className="subtle">Review, manage, and track all submitted complaints.</p></div>
      <div className="card p-4 grid md:grid-cols-3 gap-3">
        <input className="input md:col-span-2" placeholder="Search by ID, title, category, location, citizen..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['Submitted','Under Review','Verified','Assigned','Under Investigation','Resolved','Rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="card p-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Citizen</th><th>Status</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td>{r.category}</td><td>{r.userId?.name || '-'}</td>
                <td><StatusBadge status={r.status} /></td><td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/admin/reports/${r._id}`} className="text-navy-800 font-medium hover:underline">Open</Link></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan="7" className="text-center text-slate-500 py-6">No reports found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
