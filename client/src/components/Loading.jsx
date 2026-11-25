import React from 'react';

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="flex items-center gap-3 text-navy-900">
        <div className="h-5 w-5 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
        <span className="font-medium">{text}</span>
      </div>
    </div>
  );
}
