import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShield, FiLogOut, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

export default function DashboardLayout({ title, links = [] }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-navy-900 text-white">
      <div className="px-4 py-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg"><FiShield className="text-red-500" /> CrimeTrack AI</Link>
        <p className="text-xs text-slate-300 mt-1">{title}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={navClass} onClick={() => setOpen(false)}>
            <span className="text-lg">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 text-sm">
        <div className="text-slate-300 mb-2 truncate">{user?.name} ({user?.role})</div>
        <button onClick={handleLogout} className="w-full sidebar-link !text-red-200 hover:!text-white"><FiLogOut /> Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="lg:hidden sticky top-0 z-30 bg-navy-900 text-white flex items-center justify-between px-4 h-14">
        <button onClick={() => setOpen(true)} className="p-2"><FiMenu size={22} /></button>
        <Link to="/" className="font-semibold flex items-center gap-2"><FiShield className="text-red-500" /> CrimeTrack AI</Link>
        <div className="w-8" />
      </div>

      <div className="lg:flex">
        <aside className="hidden lg:block lg:w-72 lg:fixed lg:inset-y-0"><Sidebar /></aside>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72"><Sidebar /></div>
            <button className="absolute top-3 right-3 text-white bg-navy-900 p-2 rounded" onClick={() => setOpen(false)}><FiX /></button>
          </div>
        )}
        <div className="flex-1 lg:ml-72">
          <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-6 h-16 sticky top-0 z-20">
            <h1 className="font-semibold text-navy-900">{title}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-600"><FiBell /> Signed in as <span className="font-medium text-navy-900">{user?.name}</span></div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
