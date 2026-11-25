import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiClock, FiCheckCircle, FiSearch, FiXCircle, FiUsers } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';
import CrimeMap from '../../components/CrimeMap';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement);

export default function AdminOverview() {
  const [dash, setDash] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [categories, setCategories] = useState(null);
  const [status, setStatus] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/admin'),
      api.get('/analytics/monthly'),
      api.get('/analytics/categories'),
      api.get('/analytics/status'),
      api.get('/analytics/weekly'),
      api.get('/analytics/hotspots'),
    ]).then(([d, m, c, s, w, h]) => {
      setDash(d.data); setMonthly(m.data); setCategories(c.data); setStatus(s.data); setWeekly(w.data); setHotspots(h.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading admin dashboard..." />;
  const cards = dash?.cards || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="page-title">Admin Dashboard Overview</h1><p className="subtle">Live statistics and recent activity from database records.</p></div>
        <Link to="/admin/reports" className="btn-primary">Manage Reports</Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard title="Total Complaints" value={cards.totalComplaints} icon={<FiFileText />} tone="navy" />
        <StatCard title="Pending Complaints" value={cards.pendingComplaints} icon={<FiClock />} tone="amber" />
        <StatCard title="Verified Complaints" value={cards.verifiedComplaints} icon={<FiCheckCircle />} tone="slate" />
        <StatCard title="Under Investigation" value={cards.underInvestigation} icon={<FiSearch />} tone="slate" />
        <StatCard title="Resolved Cases" value={cards.resolvedCases} icon={<FiCheckCircle />} tone="green" />
        <StatCard title="Rejected Complaints" value={cards.rejectedComplaints} icon={<FiXCircle />} tone="red" />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-navy-900 mb-3">Monthly Crime Reports</h2>
          {monthly && <Bar data={{ labels: monthly.labels, datasets: [{ label: 'Reports', data: monthly.counts, backgroundColor: '#163a75' }] }} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-navy-900 mb-3">Crime Category Distribution</h2>
          {categories && <Bar data={{ labels: categories.labels, datasets: [{ label: 'Reports', data: categories.counts, backgroundColor: '#0b1f44' }] }} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-navy-900 mb-3">Complaint Status Distribution</h2>
          {status && <Doughnut data={{ labels: status.labels, datasets: [{ data: status.counts, backgroundColor: ['#64748b','#f59e0b','#3b82f6','#6366f1','#7c3aed','#16a34a','#dc2626'] }] }} />}
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-navy-900 mb-3">Weekly Crime Reports</h2>
          {weekly && <Line data={{ labels: weekly.labels, datasets: [{ label: 'Reports', data: weekly.counts, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.2)', tension: 0.3, fill: true }] }} options={{ responsive: true }} />}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-navy-900 mb-3">Crime Hotspot Map (Reported Incidents)</h2>
        <CrimeMap points={hotspots} height={380} />
      </div>

      <div className="card p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-3"><h2 className="font-semibold text-navy-900">Recent Crime Reports</h2><Link to="/admin/reports" className="text-sm text-navy-800 hover:underline">View all</Link></div>
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Citizen</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {(dash?.recentReports || []).map((r) => (
              <tr key={r._id}>
                <td className="font-medium">{r.complaintId}</td>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>{r.userId?.name || '-'}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><Link to={`/admin/reports/${r._id}`} className="text-navy-800 hover:underline font-medium">Open</Link></td>
              </tr>
            ))}
            {!dash?.recentReports?.length && <tr><td colSpan="7" className="text-center text-slate-500 py-6">No reports found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
