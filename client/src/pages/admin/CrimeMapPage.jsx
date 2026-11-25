import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import CrimeMap from '../../components/CrimeMap';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function CrimeMapPage() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/analytics/hotspots').then((res) => setPoints(res.data || [])).finally(() => setLoading(false)); }, []);

  if (loading) return <Loading text="Loading map data..." />;
  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Crime Hotspot Map</h1><p className="subtle">Interactive map of reported incident locations (reported incidents, not verified guilt). Concentrations indicate higher report volumes.</p></div>
      <div className="card p-5"><CrimeMap points={points} height={480} /></div>
      <div className="card p-5 overflow-x-auto">
        <h2 className="font-semibold text-navy-900 mb-3">Mapped Incidents</h2>
        <table className="table">
          <thead><tr><th>Complaint ID</th><th>Title</th><th>Category</th><th>Status</th><th>Location</th><th>Date</th></tr></thead>
          <tbody>
            {points.map((p) => (
              <tr key={p._id || p.complaintId}><td className="font-medium">{p.complaintId}</td><td>{p.title}</td><td>{p.category}</td><td><StatusBadge status={p.status} /></td><td>{[p.location, p.city, p.district].filter(Boolean).join(', ')}</td><td>{p.incidentDate || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-')}</td></tr>
            ))}
            {!points.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No geolocated incidents available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
