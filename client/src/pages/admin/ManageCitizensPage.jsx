import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loading from '../../components/Loading';

export default function ManageCitizensPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/users/citizens').then((res) => setItems(res.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this citizen account? This cannot be undone.')) return;
    try { await api.delete(`/users/citizens/${id}`); toast.success('Citizen deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <Loading />;
  return (
    <div className="space-y-4">
      <div><h1 className="page-title">Manage Citizens</h1><p className="subtle">View citizen accounts (access controlled). Sensitive information is limited.</p></div>
      <div className="card p-5 overflow-x-auto">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id || u.id}>
                <td className="font-medium">{u.name}</td><td>{u.email}</td><td>{u.phone || '-'}</td><td>{u.address || '-'}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td><button className="btn-danger !py-1 !px-2 text-xs" onClick={() => remove(u._id || u.id)}>Delete</button></td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6" className="text-center text-slate-500 py-6">No citizens found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
