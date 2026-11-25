import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { fileUrl } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';

const STEPS = ['Submitted', 'Under Review', 'Verified', 'Assigned', 'Under Investigation', 'Resolved'];

export default function TrackComplaintPage() {
  const [params] = useSearchParams();
  const [complaintId, setComplaintId] = useState(params.get('complaintId') || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const track = async (id = complaintId) => {
    if (!id?.trim()) return toast.error('Enter a complaint ID');
    setLoading(true);
    try {
      const res = await api.get(`/reports/track/${encodeURIComponent(id.trim())}`);
      setData(res.data);
    } catch (err) {
      setData(null);
      toast.error(err.response?.data?.message || 'Complaint not found');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (params.get('complaintId')) track(params.get('complaintId')); }, []);

  const currentIdx = data ? (data.status === 'Rejected' ? -1 : STEPS.indexOf(data.status)) : -1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Track Complaint</h1>
        <p className="subtle">Enter your unique complaint ID to view status and progress.</p>
      </div>
      <div className="card p-5 flex flex-col sm:flex-row gap-3">
        <input className="input flex-1" placeholder="e.g. CT-2026-123456" value={complaintId} onChange={(e) => setComplaintId(e.target.value)} />
        <button className="btn-primary" onClick={() => track()} disabled={loading}>{loading ? 'Tracking...' : 'Track'}</button>
      </div>

      {loading && <Loading text="Fetching complaint..." />}
      {data && !loading && (
        <div className="space-y-6">
          <div className="card p-5 grid md:grid-cols-2 gap-4">
            <div><div className="text-sm text-slate-500">Complaint ID</div><div className="font-semibold text-navy-900">{data.complaintId}</div></div>
            <div><div className="text-sm text-slate-500">Current Status</div><StatusBadge status={data.status} /></div>
            <div><div className="text-sm text-slate-500">Title</div><div>{data.title}</div></div>
            <div><div className="text-sm text-slate-500">Category</div><div>{data.category}</div></div>
            <div><div className="text-sm text-slate-500">Submission Date</div><div>{new Date(data.createdAt).toLocaleString()}</div></div>
            <div><div className="text-sm text-slate-500">Last Updated</div><div>{new Date(data.updatedAt).toLocaleString()}</div></div>
            <div><div className="text-sm text-slate-500">Location</div><div>{[data.location, data.city, data.district, data.state].filter(Boolean).join(', ')}</div></div>
            <div><div className="text-sm text-slate-500">Assigned Officer</div><div>{data.assignedOfficer?.name || 'Not assigned yet'}</div></div>
            {data.description && <div className="md:col-span-2"><div className="text-sm text-slate-500">Description</div><div className="whitespace-pre-wrap">{data.description}</div></div>}
            {data.aiSummary && <div className="md:col-span-2"><div className="text-sm text-slate-500">AI Summary (assistive)</div><div>{data.aiSummary}</div></div>}
            {Array.isArray(data.evidenceFiles) && data.evidenceFiles.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-sm text-slate-500 mb-1">Evidence Files</div>
                <ul className="list-disc pl-5 text-sm">
                  {data.evidenceFiles.map((f, i) => <li key={i}><a className="text-navy-800 underline" href={fileUrl(f)} target="_blank" rel="noreferrer">Evidence {i + 1}</a></li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-lg text-navy-900 mb-4">Status Timeline</h2>
            {data.status === 'Rejected' ? (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">This complaint was rejected. See status history for remarks.</div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className={`flex items-center gap-2 ${i <= currentIdx ? 'text-navy-900' : 'text-slate-400'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentIdx ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</div>
                      <span className="text-sm font-medium">{s}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`hidden md:block flex-1 h-1 rounded ${i < currentIdx ? 'bg-navy-900' : 'bg-slate-200'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-lg text-navy-900 mb-3">Status History</h2>
            <div className="space-y-3">
              {(data.statusHistory || []).slice().reverse().map((h, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <StatusBadge status={h.status} />
                    <span className="text-xs text-slate-500">{h.updatedAt ? new Date(h.updatedAt).toLocaleString() : ''}</span>
                  </div>
                  {h.remarks && <p className="text-sm text-slate-700 mt-1">{h.remarks}</p>}
                </div>
              ))}
              {!data.statusHistory?.length && <p className="text-slate-500 text-sm">No history available.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
