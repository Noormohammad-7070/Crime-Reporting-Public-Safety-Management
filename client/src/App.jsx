import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';
import CitizenRegisterPage from './pages/public/CitizenRegisterPage';
import CitizenLoginPage from './pages/public/CitizenLoginPage';
import AdminLoginPage from './pages/public/AdminLoginPage';
import OfficerLoginPage from './pages/public/OfficerLoginPage';

// Citizen
import CitizenOverview from './pages/citizen/CitizenOverview';
import ReportCrimePage from './pages/citizen/ReportCrimePage';
import TrackComplaintPage from './pages/citizen/TrackComplaintPage';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import ComplaintDetailsPage from './pages/citizen/ComplaintDetailsPage';
import CitizenNotificationsPage from './pages/citizen/CitizenNotificationsPage';
import AIAssistantPage from './pages/citizen/AIAssistantPage';
import CitizenProfilePage from './pages/citizen/CitizenProfilePage';

// Admin
import AdminOverview from './pages/admin/AdminOverview';
import AllReportsPage from './pages/admin/AllReportsPage';
import ManageComplaintsPage from './pages/admin/ManageComplaintsPage';
import AssignCasesPage from './pages/admin/AssignCasesPage';
import ManageOfficersPage from './pages/admin/ManageOfficersPage';
import ManageCitizensPage from './pages/admin/ManageCitizensPage';
import CrimeAnalyticsPage from './pages/admin/CrimeAnalyticsPage';
import CrimeMapPage from './pages/admin/CrimeMapPage';
import GenerateReportsPage from './pages/admin/GenerateReportsPage';
import PublicSafetyAlertsPage from './pages/admin/PublicSafetyAlertsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminReportDetailsPage from './pages/admin/AdminReportDetailsPage';

// Officer
import OfficerOverview from './pages/officer/OfficerOverview';
import AssignedCasesPage from './pages/officer/AssignedCasesPage';
import OfficerCaseDetailsPage from './pages/officer/OfficerCaseDetailsPage';
import InvestigationUpdatesPage from './pages/officer/InvestigationUpdatesPage';
import InvestigationNotesPage from './pages/officer/InvestigationNotesPage';
import CompletedCasesPage from './pages/officer/CompletedCasesPage';
import OfficerNotificationsPage from './pages/officer/OfficerNotificationsPage';
import OfficerProfilePage from './pages/officer/OfficerProfilePage';

import { FiHome, FiFileText, FiSearch, FiList, FiBell, FiCpu, FiUser, FiBarChart2, FiMap, FiUsers, FiClipboard, FiSettings, FiAlertTriangle, FiCheckCircle, FiEdit3, FiShield } from 'react-icons/fi';

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'officer') return <Navigate to="/officer" replace />;
  return <Navigate to="/citizen" replace />;
}

const citizenLinks = [
  { to: '/citizen', label: 'Dashboard Overview', icon: <FiHome />, end: true },
  { to: '/citizen/report-crime', label: 'Report a Crime', icon: <FiFileText /> },
  { to: '/citizen/track', label: 'Track Complaint', icon: <FiSearch /> },
  { to: '/citizen/complaints', label: 'My Complaints', icon: <FiList /> },
  { to: '/citizen/notifications', label: 'Notifications', icon: <FiBell /> },
  { to: '/citizen/ai-assistant', label: 'AI Assistant', icon: <FiCpu /> },
  { to: '/citizen/profile', label: 'Profile Settings', icon: <FiUser /> },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard Overview', icon: <FiHome />, end: true },
  { to: '/admin/reports', label: 'All Crime Reports', icon: <FiFileText /> },
  { to: '/admin/reports/pending', label: 'Pending Complaints', icon: <FiClipboard /> },
  { to: '/admin/reports/verified', label: 'Verified Complaints', icon: <FiCheckCircle /> },
  { to: '/admin/reports/rejected', label: 'Rejected Complaints', icon: <FiAlertTriangle /> },
  { to: '/admin/assign-cases', label: 'Assign Cases', icon: <FiShield /> },
  { to: '/admin/officers', label: 'Manage Officers', icon: <FiUsers /> },
  { to: '/admin/citizens', label: 'Manage Citizens', icon: <FiUser /> },
  { to: '/admin/analytics', label: 'Crime Analytics', icon: <FiBarChart2 /> },
  { to: '/admin/map', label: 'Crime Hotspot Map', icon: <FiMap /> },
  { to: '/admin/generate-reports', label: 'Generate Reports', icon: <FiFileText /> },
  { to: '/admin/alerts', label: 'Public Safety Alerts', icon: <FiAlertTriangle /> },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: <FiList /> },
  { to: '/admin/settings', label: 'Admin Settings', icon: <FiSettings /> },
];

const officerLinks = [
  { to: '/officer', label: 'Dashboard Overview', icon: <FiHome />, end: true },
  { to: '/officer/assigned', label: 'Assigned Cases', icon: <FiClipboard /> },
  { to: '/officer/updates', label: 'Investigation Updates', icon: <FiEdit3 /> },
  { to: '/officer/notes', label: 'Investigation Notes', icon: <FiFileText /> },
  { to: '/officer/completed', label: 'Completed Cases', icon: <FiCheckCircle /> },
  { to: '/officer/notifications', label: 'Notifications', icon: <FiBell /> },
  { to: '/officer/profile', label: 'Profile Settings', icon: <FiUser /> },
];

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<CitizenRegisterPage />} />
        <Route path="/login" element={<CitizenLoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/officer-login" element={<OfficerLoginPage />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Route>

      <Route element={<ProtectedRoute roles={['citizen']} />}>
        <Route path="/citizen" element={<DashboardLayout title="Citizen Dashboard" links={citizenLinks} />}>
          <Route index element={<CitizenOverview />} />
          <Route path="report-crime" element={<ReportCrimePage />} />
          <Route path="track" element={<TrackComplaintPage />} />
          <Route path="complaints" element={<MyComplaintsPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="notifications" element={<CitizenNotificationsPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="profile" element={<CitizenProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout title="Police Admin Dashboard" links={adminLinks} />}>
          <Route index element={<AdminOverview />} />
          <Route path="reports" element={<AllReportsPage />} />
          <Route path="reports/pending" element={<ManageComplaintsPage mode="pending" />} />
          <Route path="reports/verified" element={<ManageComplaintsPage mode="verified" />} />
          <Route path="reports/rejected" element={<ManageComplaintsPage mode="rejected" />} />
          <Route path="reports/:id" element={<AdminReportDetailsPage />} />
          <Route path="assign-cases" element={<AssignCasesPage />} />
          <Route path="officers" element={<ManageOfficersPage />} />
          <Route path="citizens" element={<ManageCitizensPage />} />
          <Route path="analytics" element={<CrimeAnalyticsPage />} />
          <Route path="map" element={<CrimeMapPage />} />
          <Route path="generate-reports" element={<GenerateReportsPage />} />
          <Route path="alerts" element={<PublicSafetyAlertsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['officer']} />}>
        <Route path="/officer" element={<DashboardLayout title="Police Officer Dashboard" links={officerLinks} />}>
          <Route index element={<OfficerOverview />} />
          <Route path="assigned" element={<AssignedCasesPage />} />
          <Route path="cases/:id" element={<OfficerCaseDetailsPage />} />
          <Route path="updates" element={<InvestigationUpdatesPage />} />
          <Route path="notes" element={<InvestigationNotesPage />} />
          <Route path="completed" element={<CompletedCasesPage />} />
          <Route path="notifications" element={<OfficerNotificationsPage />} />
          <Route path="profile" element={<OfficerProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
