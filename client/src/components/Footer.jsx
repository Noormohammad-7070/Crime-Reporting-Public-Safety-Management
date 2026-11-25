import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">CrimeTrack AI</h3>
          <p className="text-sm">AI-powered crime reporting and public safety management platform for citizens and law enforcement. All sample data shown in demos is fictional.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Emergency (Demo Info)</h4>
          <ul className="text-sm space-y-1">
            <li>Police: <span className="text-white">100</span></li>
            <li>Ambulance: <span className="text-white">108 / 102</span></li>
            <li>Fire: <span className="text-white">101</span></li>
            <li>National Emergency: <span className="text-white">112</span></li>
          </ul>
          <p className="text-xs mt-2 text-slate-400">Not an emergency response service. Availability may vary by region.</p>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs py-4">© {new Date().getFullYear()} CrimeTrack AI. For demonstration and public safety awareness.</div>
    </footer>
  );
}
