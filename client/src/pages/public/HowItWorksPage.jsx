import React from 'react';

const steps = [
  { n: '1', title: 'Register & Login', desc: 'Citizens create a secure account. Administrators and officers use role-specific logins.' },
  { n: '2', title: 'Report an Incident', desc: 'Fill in incident details, select a category, add location, and upload evidence. AI may suggest a category and summary (assistive only).' },
  { n: '3', title: 'Get Complaint ID', desc: 'Each submission is saved to the database and assigned a unique complaint ID for tracking.' },
  { n: '4', title: 'Review & Assignment', desc: 'Administrators verify reports, record reasons for approvals/rejections, and assign cases to officers.' },
  { n: '5', title: 'Investigation Updates', desc: 'Officers update case status, add investigation notes, and attach documents. Citizens receive notifications.' },
  { n: '6', title: 'Track & Analyze', desc: 'Citizens track progress via timeline. Admins monitor analytics, hotspots, and generate reports for insights.' },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="page-title">How It Works</h1>
      <p className="mt-2 text-slate-600">A clear workflow from citizen reporting to investigation and resolution.</p>
      <div className="mt-8 space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="card p-5 flex gap-4 items-start">
            <div className="h-10 w-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold shrink-0">{s.n}</div>
            <div>
              <h3 className="font-semibold text-lg text-navy-900">{s.title}</h3>
              <p className="text-slate-600 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card p-5 mt-6 border-l-4 border-red-600">
        <h3 className="font-semibold text-navy-900">Important</h3>
        <p className="text-slate-600 mt-1 text-sm">CrimeTrack AI provides assistive insights only. It does not identify suspects, determine guilt, or make enforcement decisions, and it is not an emergency response service. For immediate danger, contact local emergency services.</p>
      </div>
    </div>
  );
}
