import React from 'react';

const styles = {
  Submitted: 'bg-slate-100 text-slate-700',
  'Under Review': 'bg-amber-100 text-amber-800',
  Verified: 'bg-blue-100 text-blue-800',
  Assigned: 'bg-indigo-100 text-indigo-800',
  'Under Investigation': 'bg-purple-100 text-purple-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${styles[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}
