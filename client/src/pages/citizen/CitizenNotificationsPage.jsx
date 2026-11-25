import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function CitizenNotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/notifications').then((res) => setItems(res.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try { await api.put(`/notifications/${id}/read`); setItems((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n)); }
    catch { toast.error('Failed to update notification'); }
  };
  const markAll = async () => {
    try { await api.put('/notifications/read-all'); setItems((prev) => prev.map((n) => ({ ...n, isRead: true }))); toast.success('All notifications marked as read'); }
    catch { toast.error('Failed to update notifications'); }
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><div><h1 className="page-title">Notifications</h1><p className="subtle">Complaint updates and important alerts.</p></div><button className="btn-secondary" onClick={markAll}>Mark all read</button></div>
      <div className="space-y-3">
        {items.length ? items.map((n) => (
          <div key={n._id} className={`card p-4 ${n.isRead ? '' : 'border-l-4 border-navy-800 bg-blue-50/40'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-navy-900">{n.title}</h3>
                <p className="text-slate-700 text-sm mt-1">{n.message}</p>
                <p className="text-xs text-slate-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.isRead && <button className="btn-secondary !py-1 !px-2 text-xs" onClick={() => markRead(n._id)}>Mark read</button>}
            </div>
          </div>
        )) : <div className="card p-6 text-center text-slate-500">No notifications yet.</div>}
      </div>
    </div>
  );
}
