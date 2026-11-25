import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiSearch, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function CitizenOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/citizen')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;

  const cards = data?.cards || {};
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="subtle">Track your reports, updates, and public safety resources.</p>
        </div>
        <Link to="/citizen/report-crime" className="btn-primary">Report a Crime</Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={cards.totalComplaints} icon={<FiFileText />} tone="navy" />
        <StatCard title="Pending / In Progress" value={cards.pendingComplaints} icon={<FiClock />} tone="amber" />
        <StatCard title="Under Investigation" value={cards.underInvestigation} icon={<FiSearch />} tone="slate" />
        <StatCard title="Resolved Cases" value={cards.resolvedCases} icon={<FiCheckCircle />} tone="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg text-navy-900">Recent Complaints</h2>
            <Link to="/citizen/complaints" className="text-sm text-navy-800 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {(data?.recentReports || []).length ? data.recentReports.map((r) => (
                  <tr key={r._id}>
                    <td className="font-medium text-navy-900"><Link to={`/citizen/complaints/${r._id}`} className="hover:underline">{r.complaintId}</Link></td>
                    <td>{r.title}</td>
                    <td>{r.category}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                )) : <tr><td colSpan="5" className="text-center text-slate-500 py-6">No complaints yet. <Link to="/citizen/report-crime" className="text-navy-800 underline">Report a crime</Link>.</td></tr>}
              </tbody>
            </table>
          </div>
          {!!(data?.recentReports || []).length && (
            <div className="mt-5">
              <h3 className="font-semibold text-navy-900 mb-2">Complaint Details & Updates</h3>
              <div className="space-y-3">
                {data.recentReports.slice(0, 4).map((r) => (
                  <div key={`detail-${r._id}`} className="border border-slate-200 rounded-lg p-3 bg-slate-50/60">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium text-navy-900">{r.complaintId} — {r.title}</div>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{r.aiSummary || (r.description ? `${String(r.description).slice(0, 180)}${String(r.description).length > 180 ? '...' : ''}` : 'No description available.')}</p>
                    <p className="text-xs text-slate-500 mt-1">Location: {[r.location, r.city, r.district].filter(Boolean).join(', ') || 'N/A'} · Incident: {r.incidentDate || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-lg text-navy-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/citizen/report-crime" className="btn-primary w-full justify-center">Submit New Report</Link>
            <Link to="/citizen/track" className="btn-secondary w-full justify-center">Track Complaint</Link>
            <Link to="/citizen/ai-assistant" className="btn-secondary w-full justify-center">Ask AI Assistant</Link>
          </div>
          <div className="mt-5 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
            <strong>Emergency?</strong> CrimeTrack AI is not an emergency response service. Call local emergency services immediately (e.g. 112/100).
          </div>
        </div>
      </div>
    </div>
  );
}
