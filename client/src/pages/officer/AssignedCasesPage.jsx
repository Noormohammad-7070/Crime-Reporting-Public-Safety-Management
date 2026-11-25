import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function AssignedCasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/cases/assigned').then((res) => setItems(res.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading />;
  const active = items.filter((r) => r.status !== 'Resolved' && r.status !== 'Rejected');

  return (
    <div className="space-y-4">
      <div><h1 className="page-title">Assigned Cases</h1><p className="subtle">Cases currently assigned to you.</p></div>
      <div className="card p-5 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Location</th><th></th></tr></thead>
          <tbody>
            {active.map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td>{r.category}</td><td><StatusBadge status={r.status} /></td>
                <td>{[r.city, r.district].filter(Boolean).join(', ') || r.location}</td>
                <td><Link to={`/officer/cases/${r._id}`} className="text-navy-800 hover:underline font-medium">Open</Link></td>
              </tr>
            ))}
            {!active.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No active assigned cases.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
