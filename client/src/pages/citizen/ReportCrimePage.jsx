import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const CATEGORIES = ['Theft', 'Robbery', 'Cybercrime', 'Harassment', 'Assault', 'Missing Person', 'Fraud', 'Vandalism', 'Domestic Violence', 'Other'];

export default function ReportCrimePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    title: '', category: '', description: '', incidentDate: '', incidentTime: '', location: '', state: '', district: '', city: '', latitude: '', longitude: ''
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getSuggestion = async () => {
    if (!form.description) return toast.info('Enter a description to get an AI suggestion.');
    setAiLoading(true);
    try {
      const [cls, sum, dup] = await Promise.all([
        api.post('/ai/classify', { description: form.description, category: form.category }),
        api.post('/ai/summarize', { description: form.description, title: form.title }),
        api.post('/ai/duplicate-check', { report: { ...form } }),
      ]);
      setSuggestion({ ...cls.data, summary: sum.data?.summary });
      setDuplicate(dup.data);
      if (cls.data?.category && !form.category) setForm((f) => ({ ...f, category: cls.data.category }));
      toast.success('AI suggestions generated (assistive only).');
    } catch (e) {
      toast.error('Could not fetch AI suggestions right now.');
    } finally { setAiLoading(false); }
  };

  const validate = () => {
    const required = ['title', 'category', 'description', 'incidentDate', 'incidentTime', 'location'];
    for (const k of required) if (!String(form[k] || '').trim()) return `${k} is required`;
    if (files.length > 5) return 'You can upload at most 5 files.';
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) return `File ${f.name} exceeds 10MB limit`;
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) fd.append(k, v); });
      files.forEach((f) => fd.append('evidenceFiles', f));
      const res = await api.post('/reports', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(`Report submitted! Complaint ID: ${res.data.complaintId}`);
      if (res.data.duplicateWarning?.possibleDuplicates?.length) {
        toast.info('Possible similar reports were detected for admin review.');
      }
      navigate(`/citizen/track?complaintId=${encodeURIComponent(res.data.complaintId)}`);
    } catch (e2) {
      toast.error(e2.response?.data?.message || 'Failed to submit report');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Report a Crime</h1>
        <p className="subtle">Provide accurate incident details. AI suggestions are assistive only and can be corrected.</p>
      </div>
      <form onSubmit={submit} className="card p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="label">Complaint Title *</label><input name="title" className="input" value={form.title} onChange={onChange} /></div>
          <div>
            <label className="label">Crime Category *</label>
            <select name="category" className="input" value={form.category} onChange={onChange}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end"><button type="button" onClick={getSuggestion} className="btn-secondary w-full" disabled={aiLoading}>{aiLoading ? 'Analyzing...' : 'Get AI Suggestions'}</button></div>
          <div><label className="label">Incident Date *</label><input type="date" name="incidentDate" className="input" value={form.incidentDate} onChange={onChange} /></div>
          <div><label className="label">Incident Time *</label><input type="time" name="incidentTime" className="input" value={form.incidentTime} onChange={onChange} /></div>
          <div className="md:col-span-2"><label className="label">Incident Location *</label><input name="location" className="input" value={form.location} onChange={onChange} placeholder="Address / landmark" /></div>
          <div><label className="label">State</label><input name="state" className="input" value={form.state} onChange={onChange} /></div>
          <div><label className="label">District</label><input name="district" className="input" value={form.district} onChange={onChange} /></div>
          <div><label className="label">City</label><input name="city" className="input" value={form.city} onChange={onChange} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Latitude</label><input name="latitude" className="input" value={form.latitude} onChange={onChange} placeholder="e.g. 12.9716" /></div>
            <div><label className="label">Longitude</label><input name="longitude" className="input" value={form.longitude} onChange={onChange} placeholder="e.g. 77.5946" /></div>
          </div>
          <div className="md:col-span-2">
            <label className="label">Incident Description *</label>
            <textarea name="description" className="input min-h-[140px]" value={form.description} onChange={onChange} placeholder="Describe what happened, when, and any relevant details..." />
          </div>
          <div className="md:col-span-2">
            <label className="label">Upload Images / Supporting Evidence (optional, max 5 files, 10MB each)</label>
            <input type="file" multiple className="input" accept="image/*,.pdf,.doc,.docx,.txt" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            <p className="text-xs text-slate-500 mt-1">Allowed: images, PDF, DOC, DOCX, TXT. Files are stored securely and access is restricted to authorized users.</p>
          </div>
        </div>

        {suggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-navy-900 mb-1">AI Suggestions (assistive)</h3>
            <p><strong>Suggested category:</strong> {suggestion.category} {suggestion.confidence != null ? `(confidence: ${Math.round(suggestion.confidence * 100)}%)` : ''}</p>
            {suggestion.summary && <p className="mt-1"><strong>Summary:</strong> {suggestion.summary}</p>}
            <p className="text-xs text-slate-600 mt-2">You may accept or change the suggested category. AI does not identify suspects or make enforcement decisions.</p>
          </div>
        )}
        {duplicate?.possibleDuplicates?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-amber-900 mb-1">Possible Duplicate Warning (for review)</h3>
            <ul className="list-disc pl-5 space-y-1">
              {duplicate.possibleDuplicates.map((d, i) => (
                <li key={i}>{d.complaintId || 'Report'} — {d.title || d.category} (similarity {Math.round((d.similarity || 0) * 100)}%)</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/citizen')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
