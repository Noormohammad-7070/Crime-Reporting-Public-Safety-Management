import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { fileUrl } from '../../services/api';
import Loading from '../../components/Loading';
import StatusBadge from '../../components/StatusBadge';

export default function OfficerCaseDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => api.get(`/reports/${id}`).then((res) => { setData(res.data); setStatus(res.data.status); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const update = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/cases/${data._id}/update`, { status, progressNote: note, remarks: note });
      toast.success('Case updated');
      setNote('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const addNoteOnly = async () => {
    if (!note.trim()) return toast.error('Enter a note');
    setSaving(true);
    try {
      await api.post(`/cases/${data._id}/notes`, { notes: note });
      toast.success('Investigation note added');
      setNote('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add note'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  if (!data) return <div className="text-red-600">Case not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3"><div><h1 className="page-title">Case Details</h1><p className="subtle">{data.complaintId}</p></div><Link to="/officer/assigned" className="btn-secondary">Back</Link></div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div><div className="text-sm text-slate-500">Title</div><div className="font-medium">{data.title}</div></div>
            <div><div className="text-sm text-slate-500">Status</div><StatusBadge status={data.status} /></div>
            <div><div className="text-sm text-slate-500">Category</div><div>{data.category}</div></div>
            <div><div className="text-sm text-slate-500">Incident</div><div>{data.incidentDate} {data.incidentTime}</div></div>
            <div className="md:col-span-2"><div className="text-sm text-slate-500">Location</div><div>{[data.location, data.city, data.district, data.state].filter(Boolean).join(', ')} {data.latitude && data.longitude ? `(${data.latitude}, ${data.longitude})` : ''}</div></div>
            <div className="md:col-span-2"><div className="text-sm text-slate-500">Description</div><div className="whitespace-pre-wrap">{data.description}</div></div>
            {data.aiSummary && <div className="md:col-span-2"><div className="text-sm text-slate-500">AI Summary (assistive)</div><div>{data.aiSummary}</div></div>}
            {!!data.evidenceFiles?.length && <div className="md:col-span-2"><div className="text-sm text-slate-500 mb-1">Evidence</div><ul className="list-disc pl-5">{data.evidenceFiles.map((f,i)=><li key={i}><a className="text-navy-800 underline" href={fileUrl(f)} target="_blank" rel="noreferrer">Evidence {i+1}</a></li>)}</ul></div>}
          </div>
        </div>
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold text-navy-900">Update Investigation</h2>
          <form onSubmit={update} className="space-y-3">
            <div><label className="label">Status</label><select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>{['Assigned','Under Investigation','Resolved','Rejected','Verified','Under Review'].map((s)=><option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="label">Investigation Note / Progress</label><textarea className="input min-h-[120px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add progress details..." /></div>
            <div className="flex gap-2"><button className="btn-primary flex-1" type="submit" disabled={saving}>{saving?'Saving...':'Update Case'}</button><button type="button" className="btn-secondary" onClick={addNoteOnly} disabled={saving}>Add Note</button></div>
          </form>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-semibold text-navy-900 mb-3">Investigation Notes</h2>
        <div className="space-y-2">{(data.investigationNotes||[]).map((n)=>(<div key={n._id} className="border rounded p-3"><p className="text-sm whitespace-pre-wrap">{n.notes}</p><p className="text-xs text-slate-500 mt-1">By {n.officerId?.userId?.name || 'Officer'} · {n.createdAt?new Date(n.createdAt).toLocaleString():''}</p></div>))}{!data.investigationNotes?.length && <p className="text-sm text-slate-500">No notes yet.</p>}</div>
      </div>
    </div>
  );
}
