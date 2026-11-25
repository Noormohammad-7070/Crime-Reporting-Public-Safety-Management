import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import api from '../../services/api';
import Loading from '../../components/Loading';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, PointElement, LineElement);

export default function CrimeAnalyticsPage() {
  const [monthly, setMonthly] = useState(null);
  const [categories, setCategories] = useState(null);
  const [status, setStatus] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/monthly'), api.get('/analytics/categories'), api.get('/analytics/status'), api.get('/analytics/weekly')
    ]).then(([m, c, s, w]) => { setMonthly(m.data); setCategories(c.data); setStatus(s.data); setWeekly(w.data); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading analytics..." />;
  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Crime Analytics</h1><p className="subtle">All charts are generated from live database records.</p></div>
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="card p-5"><h2 className="font-semibold text-navy-900 mb-3">Monthly Crime Reports</h2>{monthly && <Bar data={{ labels: monthly.labels, datasets: [{ label: 'Reports', data: monthly.counts, backgroundColor: '#163a75' }] }} />}</div>
        <div className="card p-5"><h2 className="font-semibold text-navy-900 mb-3">Weekly Crime Reports</h2>{weekly && <Line data={{ labels: weekly.labels, datasets: [{ label: 'Reports', data: weekly.counts, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,0.15)', tension: 0.3, fill: true }] }} />}</div>
        <div className="card p-5"><h2 className="font-semibold text-navy-900 mb-3">Crime Category Distribution</h2>{categories && <Pie data={{ labels: categories.labels, datasets: [{ data: categories.counts, backgroundColor: ['#0b1f44','#163a75','#2563eb','#16a34a','#f59e0b','#dc2626','#7c3aed','#0f766e','#db2777','#64748b'] }] }} />}</div>
        <div className="card p-5"><h2 className="font-semibold text-navy-900 mb-3">Complaint Status</h2>{status && <Doughnut data={{ labels: status.labels, datasets: [{ data: status.counts, backgroundColor: ['#64748b','#f59e0b','#3b82f6','#6366f1','#7c3aed','#16a34a','#dc2626'] }] }} />}</div>
      </div>
    </div>
  );
}
