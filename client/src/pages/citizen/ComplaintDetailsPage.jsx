import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { fileUrl } from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/reports/${id}`).then((res) => setData(res.data)).catch((err) => setError(err.response?.data?.message || 'Failed to load complaint')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="page-title">Complaint Details</h1><p className="subtle">{data.complaintId}</p></div>
        <Link to="/citizen/complaints" className="btn-secondary">Back</Link>
      </div>
      <div className="card p-5 grid md:grid-cols-2 gap-4">
        <div><div className="text-sm text-slate-500">Title</div><div className="font-medium">{data.title}</div></div>
        <div><div className="text-sm text-slate-500">Status</div><StatusBadge status={data.status} /></div>
        <div><div className="text-sm text-slate-500">Category</div><div>{data.category}</div></div>
        <div><div className="text-sm text-slate-500">Incident</div><div>{data.incidentDate} {data.incidentTime}</div></div>
        <div className="md:col-span-2"><div className="text-sm text-slate-500">Location</div><div>{[data.location, data.city, data.district, data.state].filter(Boolean).join(', ')}</div></div>
        <div className="md:col-span-2"><div className="text-sm text-slate-500">Description</div><div className="whitespace-pre-wrap">{data.description}</div></div>
        {data.aiSummary && <div className="md:col-span-2"><div className="text-sm text-slate-500">AI Summary (assistive)</div><div>{data.aiSummary}</div></div>}
        {data.assignedOfficer && <div><div className="text-sm text-slate-500">Assigned Officer</div><div>{data.assignedOfficer.userId?.name} ({data.assignedOfficer.badgeNumber})</div></div>}
        <div><div className="text-sm text-slate-500">Last Updated</div><div>{new Date(data.updatedAt).toLocaleString()}</div></div>
        {!!data.evidenceFiles?.length && (
          <div className="md:col-span-2">
            <div className="text-sm text-slate-500 mb-1">Evidence Files</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {data.evidenceFiles.map((f, i) => <li key={i}><a className="text-navy-800 underline" href={fileUrl(f)} target="_blank" rel="noreferrer">Open evidence {i + 1}</a></li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-lg text-navy-900 mb-3">Status History</h2>
        <div className="space-y-3">
          {(data.statusHistory || []).slice().reverse().map((h, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2"><StatusBadge status={h.status} /><span className="text-xs text-slate-500">{h.updatedAt ? new Date(h.updatedAt).toLocaleString() : ''}</span></div>
              {h.remarks && <p className="text-sm mt-1 text-slate-700">{h.remarks}</p>}
              {h.updatedBy && <p className="text-xs text-slate-500 mt-1">Updated by: {h.updatedBy.name || h.updatedBy.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
