import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function ManageComplaintsPage({ mode = 'pending' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useMemo(() => ({
    pending: { title: 'Pending Complaints', subtitle: 'Reports awaiting review or in early processing.', statuses: ['Submitted', 'Under Review'] },
    verified: { title: 'Verified Complaints', subtitle: 'Reports that have been reviewed and verified.', statuses: ['Verified', 'Assigned', 'Under Investigation'] },
    rejected: { title: 'Rejected Complaints', subtitle: 'Reports that were reviewed and rejected with reasons.', statuses: ['Rejected'] },
  }[mode] || { title: 'Manage Complaints', subtitle: '', statuses: [] }), [mode]);

  const load = () => {
    setLoading(true);
    api.get('/reports').then((res) => setItems(res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [mode]);

  const updateStatus = async (id, status) => {
    const remarks = window.prompt(`Enter remarks/reason for setting status to "${status}" (optional):`, '') || '';
    try {
      await api.put(`/reports/${id}/status`, { status, remarks });
      toast.success(`Status updated to ${status}`);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status'); }
  };

  const filtered = items.filter((r) => config.statuses.includes(r.status));
  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div><h1 className="page-title">{config.title}</h1><p className="subtle">{config.subtitle}</p></div>
      <div className="card p-4 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Citizen</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>{r.userId?.name || '-'}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/admin/reports/${r._id}`} className="btn-secondary !py-1 !px-2 text-xs">View</Link>
                    {mode !== 'rejected' && <button className="btn-secondary !py-1 !px-2 text-xs" onClick={() => updateStatus(r._id, 'Verified')}>Verify</button>}
                    {mode !== 'rejected' && <button className="btn-secondary !py-1 !px-2 text-xs" onClick={() => updateStatus(r._id, 'Under Review')}>Review</button>}
                    <button className="btn-danger !py-1 !px-2 text-xs" onClick={() => updateStatus(r._id, 'Rejected')}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No complaints in this category.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
