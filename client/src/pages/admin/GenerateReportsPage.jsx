import React, { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function GenerateReportsPage() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/reports').then((res) => setReports(res.data)).finally(() => setLoading(false)); }, []);

  const filtered = useMemo(() => status === 'all' ? reports : reports.filter((r) => r.status === status), [reports, status]);
  const summary = useMemo(() => {
    const byStatus = filtered.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
    const byCategory = filtered.reduce((acc, r) => { acc[r.category] = (acc[r.category] || 0) + 1; return acc; }, {});
    return { total: filtered.length, byStatus, byCategory };
  }, [filtered]);

  const exportCsv = () => {
    const headers = ['Complaint ID','Title','Category','Status','City','District','State','Incident Date','Created At'];
    const rows = filtered.map((r) => [r.complaintId, r.title, r.category, r.status, r.city || '', r.district || '', r.state || '', r.incidentDate || '', r.createdAt]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `crimetrack-report-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="page-title">Generate Reports</h1><p className="subtle">Create summary views and export complaint data from live records.</p></div>
        <div className="flex gap-2">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {['Submitted','Under Review','Verified','Assigned','Under Investigation','Resolved','Rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5"><div className="text-sm text-slate-500">Total Records</div><div className="text-3xl font-bold text-navy-900">{summary.total}</div></div>
        <div className="card p-5"><div className="text-sm text-slate-500 mb-2">By Status</div><div className="space-y-1 text-sm">{Object.entries(summary.byStatus).map(([k,v]) => <div key={k} className="flex justify-between"><span>{k}</span><strong>{v}</strong></div>) || <span className="text-slate-500">No data</span>}</div></div>
        <div className="card p-5"><div className="text-sm text-slate-500 mb-2">By Category</div><div className="space-y-1 text-sm max-h-40 overflow-auto">{Object.entries(summary.byCategory).map(([k,v]) => <div key={k} className="flex justify-between"><span>{k}</span><strong>{v}</strong></div>) || <span className="text-slate-500">No data</span>}</div></div>
      </div>

      <div className="card p-5 overflow-x-auto">
        <h2 className="font-semibold text-navy-900 mb-3">Report Data</h2>
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Location</th><th>Incident Date</th></tr></thead>
          <tbody>
            {filtered.map((r) => (<tr key={r._id}><td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td>{r.category}</td><td><StatusBadge status={r.status} /></td><td>{[r.city,r.district,r.state].filter(Boolean).join(', ') || r.location}</td><td>{r.incidentDate}</td></tr>))}
            {!filtered.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No records.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
