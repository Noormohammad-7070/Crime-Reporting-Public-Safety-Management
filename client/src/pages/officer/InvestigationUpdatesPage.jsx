import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function InvestigationUpdatesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  const load = () => api.get('/cases/assigned').then((res) => setItems(res.data.filter((r) => r.status !== 'Resolved' && r.status !== 'Rejected'))).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const quickUpdate = async (id, status) => {
    const remarks = window.prompt(`Remarks for status "${status}"`, '') || '';
    setSavingId(id);
    try { await api.put(`/cases/${id}/update`, { status, remarks }); toast.success('Updated'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSavingId(''); }
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-4">
      <div><h1 className="page-title">Investigation Updates</h1><p className="subtle">Update progress and status for your active cases.</p></div>
      <div className="card p-5 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Status</th><th>Quick Actions</th><th></th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td><StatusBadge status={r.status} /></td>
                <td><div className="flex flex-wrap gap-2">
                  <button className="btn-secondary !py-1 !px-2 text-xs" disabled={savingId===r._id} onClick={() => quickUpdate(r._id, 'Under Investigation')}>Mark Investigating</button>
                  <button className="btn-secondary !py-1 !px-2 text-xs" disabled={savingId===r._id} onClick={() => quickUpdate(r._id, 'Resolved')}>Resolve</button>
                </div></td>
                <td><Link to={`/officer/cases/${r._id}`} className="text-navy-800 hover:underline">Details</Link></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="5" className="text-center text-slate-500 py-6">No active cases to update.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
