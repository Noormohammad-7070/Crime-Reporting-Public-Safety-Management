import React from 'react';

export default function StatCard({ title, value, icon, tone = 'navy' }) {
  const tones = {
    navy: 'bg-navy-900 text-white',
    red: 'bg-red-600 text-white',
    green: 'bg-green-600 text-white',
    amber: 'bg-amber-500 text-white',
    slate: 'bg-slate-700 text-white',
  };
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl ${tones[tone] || tones.navy}`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-navy-900">{value ?? 0}</p>
      </div>
    </div>
  );
}
