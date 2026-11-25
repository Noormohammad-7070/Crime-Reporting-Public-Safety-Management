import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields.'); return; }
    setSent(true);
    toast.success('Message recorded locally for demo. For urgent matters contact emergency services.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-8">
      <div>
        <h1 className="page-title">Contact Us</h1>
        <p className="mt-2 text-slate-600">Reach out for platform information, feedback, or public safety coordination inquiries.</p>
        <div className="card p-6 mt-6 space-y-3 text-slate-700">
          <div><strong>Address:</strong> CrimeTrack AI Coordination Center (Demo), Civic Plaza, Demo City</div>
          <div><strong>Email:</strong> support@crimetrack-ai.demo</div>
          <div><strong>Phone:</strong> +1 (555) 010-9000 (Demo)</div>
          <div><strong>Hours:</strong> Mon–Fri, 9:00 AM – 6:00 PM</div>
        </div>
        <div className="card p-6 mt-6 border-l-4 border-red-600">
          <h2 className="font-semibold text-navy-900">Emergency Contacts</h2>
          <ul className="mt-2 text-sm text-slate-700 space-y-1">
            <li>Police: <strong>100</strong></li>
            <li>Ambulance: <strong>108 / 102</strong></li>
            <li>Fire: <strong>101</strong></li>
            <li>Women Helpline: <strong>1091</strong></li>
            <li>Child Helpline: <strong>1098</strong></li>
            <li>National Emergency: <strong>112</strong></li>
          </ul>
          <p className="text-xs text-slate-500 mt-2">Numbers may vary by region. This platform is not an emergency response service.</p>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-navy-900 mb-4">Send a Message</h2>
        {sent ? (
          <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">Thank you. Your message has been noted for this demo. If this is an emergency, please contact local emergency services immediately.</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Email *</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Subject</label><input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div><label className="label">Message *</label><textarea className="input min-h-[140px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            <button type="submit" className="btn-primary">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}
