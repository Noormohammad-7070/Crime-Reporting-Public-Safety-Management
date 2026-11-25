import React from 'react';
import { FiShield, FiCpu, FiMap, FiBell, FiBarChart2, FiLock } from 'react-icons/fi';

const items = [
  { icon: <FiShield />, title: 'Online Crime Reporting', desc: 'Citizens can submit detailed reports with category, date/time, location, and supporting evidence uploads.' },
  { icon: <FiCpu />, title: 'AI Classification & Summaries', desc: 'NLP-based suggestions help categorize complaints and generate concise summaries for faster review (assistive only).' },
  { icon: <FiCpu />, title: 'Duplicate Detection', desc: 'Compares new complaints with existing reports to flag possible duplicates for administrator review.' },
  { icon: <FiMap />, title: 'Crime Hotspot Map', desc: 'Interactive Leaflet/OpenStreetMap visualization of reported incident locations and concentrations.' },
  { icon: <FiBarChart2 />, title: 'Analytics Dashboards', desc: 'Live charts for monthly trends, categories, statuses, and recent activity powered by database records.' },
  { icon: <FiBell />, title: 'Notifications & Tracking', desc: 'Unique complaint IDs, status timelines, and notifications keep citizens and officers informed.' },
  { icon: <FiLock />, title: 'Secure Role-Based Access', desc: 'JWT authentication, bcrypt password hashing, protected APIs, and access controls for sensitive data.' },
  { icon: <FiCpu />, title: 'Public Safety AI Assistant', desc: 'Chatbot answers general safety questions and explains reporting/tracking. It is not an emergency service.' },
];

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="page-title">Features</h1>
      <p className="mt-2 text-slate-600">Comprehensive tools for reporting, investigation management, and public safety awareness.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {items.map((i) => (
          <div key={i.title} className="card p-6">
            <div className="h-11 w-11 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xl mb-4">{i.icon}</div>
            <h3 className="font-semibold text-lg text-navy-900">{i.title}</h3>
            <p className="text-slate-600 mt-2 text-sm">{i.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
