import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShield, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-white bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dashPath = user ? (user.role === 'admin' ? '/admin' : user.role === 'officer' ? '/officer' : '/citizen') : null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-40 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <FiShield className="text-red-500" /> CrimeTrack AI
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/about" className={linkClass}>About Us</NavLink>
            <NavLink to="/features" className={linkClass}>Features</NavLink>
            <NavLink to="/how-it-works" className={linkClass}>How It Works</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact Us</NavLink>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="btn-secondary !py-1.5 !px-3 !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Citizen Login</Link>
                <Link to="/register" className="btn-primary !py-1.5 !px-3 !bg-red-600 hover:!bg-red-700">Register</Link>
              </>
            ) : (
              <>
                <Link to={dashPath} className="btn-secondary !py-1.5 !px-3 !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary !py-1.5 !px-3 !bg-red-600 hover:!bg-red-700">Logout</button>
              </>
            )}
          </div>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1 bg-navy-900">
          {[['/', 'Home'], ['/about', 'About Us'], ['/features', 'Features'], ['/how-it-works', 'How It Works'], ['/contact', 'Contact Us']].map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded ${isActive ? 'bg-white/10' : ''}`}>{label}</NavLink>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary !justify-center">Citizen Login</Link>
                <Link to="/admin-login" onClick={() => setOpen(false)} className="btn-secondary !justify-center">Admin Login</Link>
                <Link to="/officer-login" onClick={() => setOpen(false)} className="btn-secondary !justify-center">Officer Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary !bg-red-600 !justify-center">Register</Link>
              </>
            ) : (
              <>
                <Link to={dashPath} onClick={() => setOpen(false)} className="btn-secondary !justify-center">Dashboard</Link>
                <button onClick={() => { setOpen(false); handleLogout(); }} className="btn-primary !bg-red-600 !justify-center">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
