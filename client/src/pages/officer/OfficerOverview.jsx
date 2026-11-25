import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiClipboard, FiSearch, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function OfficerOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/dashboard/officer').then((res) => setData(res.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <Loading text="Loading officer dashboard..." />;
  const cards = data?.cards || {};
  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Officer Dashboard Overview</h1><p className="subtle">Your assigned workload and recent case activity.</p></div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard title="Assigned Cases" value={cards.assignedCases} icon={<FiClipboard />} tone="navy" />
        <StatCard title="Under Investigation" value={cards.underInvestigation} icon={<FiSearch />} tone="amber" />
        <StatCard title="Resolved Cases" value={cards.resolvedCases} icon={<FiCheckCircle />} tone="green" />
      </div>
      <div className="card p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3"><h2 className="font-semibold text-navy-900">Recent Assigned Cases</h2><Link to="/officer/assigned" className="text-sm text-navy-800 hover:underline">View all</Link></div>
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {(data?.recentReports || []).map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td><td>{r.title}</td><td>{r.category}</td>
                <td><StatusBadge status={r.status} /></td><td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td><Link to={`/officer/cases/${r._id}`} className="text-navy-800 hover:underline font-medium">Open</Link></td>
              </tr>
            ))}
            {!data?.recentReports?.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No assigned cases yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
