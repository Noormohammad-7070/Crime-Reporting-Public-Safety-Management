import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-navy-900 font-semibold">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) {
    const dest = user.role === 'admin' ? '/admin' : user.role === 'officer' ? '/officer' : '/citizen';
    return <Navigate to={dest} replace />;
  }
  return <Outlet />;
}
