import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi, I am the CrimeTrack AI public safety assistant. I can explain how to submit or track complaints, share general safety tips, and provide emergency contact information. I am not an emergency response service and cannot identify suspects or make enforcement decisions.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: msg });
      setMessages((m) => [...m, { role: 'assistant', text: res.data?.reply || 'Sorry, I could not generate a response.' }]);
    } catch (err) {
      toast.error('AI assistant is unavailable right now.');
      setMessages((m) => [...m, { role: 'assistant', text: 'I am unable to respond at the moment. For emergencies, contact local emergency services (e.g. 112/100).' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="page-title">AI Public Safety Assistant</h1>
        <p className="subtle">Ask general public safety questions, learn how to report/track complaints, or get emergency contact info.</p>
      </div>
      <div className="card p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'ml-auto bg-navy-800 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="text-sm text-slate-500">Assistant is typing...</div>}
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input className="input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about reporting, tracking, or safety tips..." />
          <button className="btn-primary" type="submit" disabled={loading}>Send</button>
        </form>
      </div>
      <div className="text-xs text-slate-500">AI responses are assistive and informational only. Not an emergency response service.</div>
    </div>
  );
}
