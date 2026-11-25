import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function MyComplaintsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/reports/my').then((res) => setItems(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((r) => [r.complaintId, r.title, r.category, r.status].some((v) => String(v || '').toLowerCase().includes(q.toLowerCase())));

  if (loading) return <Loading />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="page-title">My Complaints</h1><p className="subtle">View your submitted reports and their current status.</p></div>
        <Link to="/citizen/report-crime" className="btn-primary">New Report</Link>
      </div>
      <div className="card p-4"><input className="input" placeholder="Search by complaint ID, title, category..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="card p-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Submitted</th><th>Summary</th><th></th></tr></thead>
          <tbody>
            {filtered.length ? filtered.map((r) => (
              <tr key={r._id}>
                <td className="font-medium text-navy-900">{r.complaintId}</td>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="max-w-xs text-slate-600 text-xs">{r.aiSummary || (r.description ? `${String(r.description).slice(0, 90)}${String(r.description).length > 90 ? '...' : ''}` : '-')}</td>
                <td><Link to={`/citizen/complaints/${r._id}`} className="text-navy-800 font-medium hover:underline">Details</Link></td>
              </tr>
            )) : <tr><td colSpan="7" className="text-center text-slate-500 py-6">No complaints found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
