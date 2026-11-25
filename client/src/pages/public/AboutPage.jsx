import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="page-title">About CrimeTrack AI</h1>
      <p className="mt-4 text-slate-700">CrimeTrack AI – Smart Crime Reporting & Public Safety Management System is a digital platform designed to make crime reporting accessible, organized, and transparent. Citizens can submit incidents online, track complaint progress, and receive safety information, while police administrators and officers manage cases through secure, role-based dashboards.</p>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-navy-900">Our Mission</h2>
          <p className="mt-2 text-slate-600">To improve public safety collaboration by providing a reliable system for reporting, tracking, and managing crime-related complaints with responsible AI assistance and data-driven insights.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-navy-900">Responsible AI</h2>
          <p className="mt-2 text-slate-600">AI features in CrimeTrack AI are assistive only: they help classify and summarize complaints, highlight possible duplicates, visualize reported hotspots, and answer general safety questions. The system does not identify suspects, determine guilt, or make enforcement decisions.</p>
        </div>
      </div>
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-semibold text-navy-900">Who Uses the Platform</h2>
        <ul className="mt-3 space-y-2 text-slate-700 list-disc pl-5">
          <li><strong>Citizens:</strong> report incidents, upload evidence, track complaints, and receive updates.</li>
          <li><strong>Police Administrators:</strong> review and verify reports, assign officers, manage users, monitor analytics, and publish safety alerts.</li>
          <li><strong>Police Officers:</strong> view assigned cases, update investigation progress, and add investigation notes.</li>
        </ul>
      </div>
      <p className="mt-6 text-sm text-slate-500">CrimeTrack AI is not an emergency response service. In immediate danger, contact local emergency services (e.g., 112/100/108/101 as applicable).</p>
    </div>
  );
}
