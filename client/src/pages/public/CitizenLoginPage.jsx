import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function CitizenLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ ...form, role: 'citizen' });
      toast.success(`Welcome, ${user.name}`);
      navigate('/citizen');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const fillNoorDemo = () => setForm({ email: 'noor@crimetrack.demo', password: 'Password@123' });

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-navy-900">Citizen Login</h1>
        <p className="text-slate-600 mt-1">Access your dashboard, reports, and notifications.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div><label className="label">Password</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <div className="text-sm text-slate-600 mt-4 space-y-1">
          <p>New user? <Link to="/register" className="text-navy-800 font-semibold hover:underline">Register</Link></p>
          <p><Link to="/admin-login" className="hover:underline">Admin Login</Link> · <Link to="/officer-login" className="hover:underline">Officer Login</Link></p>
        </div>
        <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm">
          <div className="font-semibold text-navy-900 mb-1">Demo citizen account (Noor)</div>
          <p className="text-slate-700">Email: <strong>noor@crimetrack.demo</strong></p>
          <p className="text-slate-700">Password: <strong>Password@123</strong></p>
          <p className="text-slate-600 mt-1">This account includes sample complaints and dashboard content.</p>
          <button type="button" onClick={fillNoorDemo} className="btn-secondary mt-3 w-full">Use Noor demo login</button>
        </div>
      </div>
    </div>
  );
}
