import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { fileUrl } from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function AdminReportDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  const load = () => api.get(`/reports/${id}`).then((res) => { setData(res.data); setStatus(res.data.status); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const update = async () => {
    try {
      await api.put(`/reports/${id}/status`, { status, remarks });
      toast.success('Status updated');
      setRemarks('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  if (loading) return <Loading />;
  if (!data) return <div className="text-red-600">Report not found.</div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3"><div><h1 className="page-title">Report Details</h1><p className="subtle">{data.complaintId}</p></div><Link to="/admin/reports" className="btn-secondary">Back</Link></div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div><div className="text-sm text-slate-500">Title</div><div className="font-medium">{data.title}</div></div>
            <div><div className="text-sm text-slate-500">Status</div><StatusBadge status={data.status} /></div>
            <div><div className="text-sm text-slate-500">Category</div><div>{data.category}</div></div>
            <div><div className="text-sm text-slate-500">Incident</div><div>{data.incidentDate} {data.incidentTime}</div></div>
            <div><div className="text-sm text-slate-500">Citizen</div><div>{data.userId?.name} ({data.userId?.email})</div></div>
            <div><div className="text-sm text-slate-500">Assigned Officer</div><div>{data.assignedOfficer?.userId?.name || 'Unassigned'}</div></div>
            <div className="md:col-span-2"><div className="text-sm text-slate-500">Location</div><div>{[data.location, data.city, data.district, data.state].filter(Boolean).join(', ')}</div></div>
            <div className="md:col-span-2"><div className="text-sm text-slate-500">Description</div><div className="whitespace-pre-wrap">{data.description}</div></div>
            {data.aiSummary && <div className="md:col-span-2"><div className="text-sm text-slate-500">AI Summary (assistive)</div><div>{data.aiSummary}</div></div>}
            {data.aiCategorySuggestion?.category && <div className="md:col-span-2"><div className="text-sm text-slate-500">AI Category Suggestion</div><div>{data.aiCategorySuggestion.category} {data.aiCategorySuggestion.confidence != null ? `(${Math.round(data.aiCategorySuggestion.confidence * 100)}%)` : ''}</div></div>}
            {!!data.evidenceFiles?.length && <div className="md:col-span-2"><div className="text-sm text-slate-500 mb-1">Evidence Files</div><ul className="list-disc pl-5">{data.evidenceFiles.map((f,i)=><li key={i}><a className="text-navy-800 underline" href={fileUrl(f)} target="_blank" rel="noreferrer">Evidence {i+1}</a></li>)}</ul></div>}
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-navy-900">Review / Update Status</h2>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>{['Submitted','Under Review','Verified','Assigned','Under Investigation','Resolved','Rejected'].map((s)=><option key={s} value={s}>{s}</option>)}</select>
            <textarea className="input min-h-[90px]" placeholder="Remarks / reason (recorded in history)" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            <button className="btn-primary w-full" onClick={update}>Update Status</button>
            <Link to="/admin/assign-cases" className="btn-secondary w-full justify-center">Go to Assign Cases</Link>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-navy-900 mb-3">Status History</h2>
            <div className="space-y-2 max-h-80 overflow-auto">{(data.statusHistory||[]).slice().reverse().map((h,i)=>(<div key={i} className="border rounded p-2 text-sm"><div className="flex justify-between gap-2"><StatusBadge status={h.status} /><span className="text-xs text-slate-500">{h.updatedAt?new Date(h.updatedAt).toLocaleString():''}</span></div>{h.remarks && <p className="mt-1">{h.remarks}</p>}</div>))}</div>
          </div>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-semibold text-navy-900 mb-3">Investigation Notes</h2>
        <div className="space-y-2">{(data.investigationNotes||[]).map((n)=>(<div key={n._id} className="border rounded p-3"><p className="text-sm whitespace-pre-wrap">{n.notes}</p><p className="text-xs text-slate-500 mt-1">By: {n.officerId?.userId?.name || 'Officer'} · {n.createdAt?new Date(n.createdAt).toLocaleString():''}</p></div>))}{!data.investigationNotes?.length && <p className="text-sm text-slate-500">No notes yet.</p>}</div>
      </div>
    </div>
  );
}
