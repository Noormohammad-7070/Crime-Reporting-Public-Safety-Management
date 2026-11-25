import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiMapPin, FiCpu, FiBell, FiBarChart2, FiUsers } from 'react-icons/fi';

export default function HomePage() {
  const features = [
    { icon: <FiShield />, title: 'Secure Crime Reporting', text: 'Submit detailed reports with evidence and receive a unique complaint ID for tracking.' },
    { icon: <FiCpu />, title: 'AI Assistance', text: 'AI suggests categories, summarizes complaints, detects possible duplicates, and answers safety questions.' },
    { icon: <FiMapPin />, title: 'Hotspot Awareness', text: 'Visualize reported incident locations on interactive maps to support public safety awareness.' },
    { icon: <FiBell />, title: 'Real-Time Updates', text: 'Citizens and officers receive notifications as complaint status and investigations progress.' },
    { icon: <FiBarChart2 />, title: 'Analytics Dashboard', text: 'Administrators monitor trends, categories, and statuses with live database-driven charts.' },
    { icon: <FiUsers />, title: 'Role-Based Access', text: 'Separate secure experiences for citizens, police administrators, and officers.' },
  ];
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm mb-4"><FiShield className="text-red-400" /> AI-Powered Public Safety Platform</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">CrimeTrack AI – Smart Crime Reporting & Public Safety Management</h1>
            <p className="mt-4 text-slate-200 text-lg">Report incidents online, track complaint progress, receive safety alerts, and help authorities respond with data-driven insights. Built for transparency, coordination, and safer communities.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary !bg-red-600 hover:!bg-red-700">Report / Register</Link>
              <Link to="/login" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20">Citizen Login</Link>
              <Link to="/admin-login" className="btn-secondary !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Admin Login</Link>
              <Link to="/officer-login" className="btn-secondary !bg-transparent !text-white !border-white/30 hover:!bg-white/10">Officer Login</Link>
            </div>
            <p className="mt-4 text-xs text-slate-300">AI suggestions assist reporting only. The system never identifies suspects, determines guilt, or makes enforcement decisions. Not an emergency response service.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['Total Visibility', 'Centralized complaint management'], ['Faster Review', 'AI summaries & classification'], ['Track Progress', 'Unique complaint IDs'], ['Safer Communities', 'Alerts & hotspot insights']].map(([t, d]) => (
              <div key={t} className="bg-white/10 border border-white/10 rounded-xl p-5 backdrop-blur">
                <h3 className="font-semibold text-lg">{t}</h3>
                <p className="text-sm text-slate-200 mt-1">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-3xl font-bold text-navy-900 text-center">Platform Features</h2>
        <p className="text-center text-slate-600 mt-2">A complete workflow for citizens, administrators, and officers.</p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="h-11 w-11 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg text-navy-900">{f.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-3 gap-6 text-center">
          <div><div className="text-3xl font-extrabold text-navy-900">24/7</div><div className="text-slate-600">Online Reporting Access</div></div>
          <div><div className="text-3xl font-extrabold text-navy-900">AI-Assisted</div><div className="text-slate-600">Classification & Summaries</div></div>
          <div><div className="text-3xl font-extrabold text-navy-900">Role-Secure</div><div className="text-slate-600">Citizen, Admin, Officer</div></div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="card p-8 bg-navy-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Need to report an incident?</h3>
            <p className="text-slate-200 mt-1">Create an account, submit a report, and track your complaint with a unique ID.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/register" className="btn-primary !bg-red-600 hover:!bg-red-700">Get Started</Link>
            <Link to="/how-it-works" className="btn-secondary !bg-white/10 !text-white !border-white/20">How It Works</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
