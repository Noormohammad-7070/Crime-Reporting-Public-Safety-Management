import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function OfficerLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ ...form, role: 'officer' });
      toast.success(`Welcome, ${user.name}`);
      navigate('/officer');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8 border-t-4 border-navy-700">
        <h1 className="text-2xl font-bold text-navy-900">Officer Login</h1>
        <p className="text-slate-600 mt-1">Access assigned cases and investigation tools.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login as Officer'}</button>
        </form>
        <p className="text-sm text-slate-600 mt-4"><Link to="/login" className="hover:underline">Citizen Login</Link> · <Link to="/admin-login" className="hover:underline">Admin Login</Link></p>
      </div>
    </div>
  );
}
