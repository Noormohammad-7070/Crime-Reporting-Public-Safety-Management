import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ ...form, role: 'admin' });
      toast.success(`Welcome, ${user.name}`);
      navigate('/admin');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8 border-t-4 border-navy-900">
        <h1 className="text-2xl font-bold text-navy-900">Admin Login</h1>
        <p className="text-slate-600 mt-1">Secure access for police administrators.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login as Admin'}</button>
        </form>
        <p className="text-sm text-slate-600 mt-4"><Link to="/login" className="hover:underline">Citizen Login</Link> · <Link to="/officer-login" className="hover:underline">Officer Login</Link></p>
      </div>
    </div>
  );
}
