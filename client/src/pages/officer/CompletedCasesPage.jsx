import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function CompletedCasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/cases/assigned').then((res) => setItems(res.data.filter((r) => r.status === 'Resolved' || r.status === 'Rejected'))).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div><h1 className="page-title">Completed Cases</h1><p className="subtle">Resolved or closed cases you handled.</p></div>
      <div className="card p-5 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td>{r.category}</td><td><StatusBadge status={r.status} /></td>
                <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td><Link to={`/officer/cases/${r._id}`} className="text-navy-800 hover:underline font-medium">View</Link></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No completed cases yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
