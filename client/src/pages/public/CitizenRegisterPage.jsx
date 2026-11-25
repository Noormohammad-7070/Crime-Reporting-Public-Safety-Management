import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function CitizenRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, address: form.address, password: form.password });
      toast.success('Registration successful!');
      navigate('/citizen');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-navy-900">Citizen Registration</h1>
        <p className="text-slate-600 mt-1">Create an account to report incidents and track complaints.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label">Email *</label><input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div><label className="label">Password * (min 6 chars)</label><input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div><label className="label">Confirm Password *</label><input type="password" className="input" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="text-sm text-slate-600 mt-4">Already have an account? <Link to="/login" className="text-navy-800 font-semibold hover:underline">Login</Link></p>
      </div>
    </div>
  );
}
