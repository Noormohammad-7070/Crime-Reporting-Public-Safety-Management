import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function AuditLogsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/audit-logs').then((res) => setItems(res.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <Loading />;
  return (
    <div className="space-y-4">
      <div><h1 className="page-title">Audit Logs</h1><p className="subtle">System activity records for accountability and traceability.</p></div>
      <div className="card p-5 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Time</th><th>User</th><th>Role</th><th>Action</th><th>Resource</th><th>Resource ID</th></tr></thead>
          <tbody>
            {items.map((l) => (
              <tr key={l._id}><td>{l.timestamp ? new Date(l.timestamp).toLocaleString() : '-'}</td><td>{l.userId?.name || 'System/Unknown'}</td><td>{l.userId?.role || '-'}</td><td className="font-medium">{l.action}</td><td>{l.resourceType}</td><td className="text-xs">{l.resourceId || '-'}</td></tr>
            ))}
            {!items.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No audit logs found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
