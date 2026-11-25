# CrimeTrack AI – Smart Crime Reporting & Public Safety Management System

CrimeTrack AI is a full-stack, role-based crime reporting and public safety management platform. Citizens can report incidents, upload evidence, track complaint status, and get public-safety assistance. Police administrators can review complaints, verify/reject/assign cases, manage officers/citizens, monitor analytics and hotspots, publish alerts, and view audit logs. Police officers can manage assigned cases, add investigation notes, and update case progress.

> **Important:** This project is for demonstration/educational use with fictional seed data. AI features are **assistive only** and must **not** be used to identify suspects, determine guilt, or make enforcement decisions.

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, JavaScript, Chart.js (`react-chartjs-2`), React Router, Axios, React Toastify, Leaflet + OpenStreetMap
- **Backend:** Node.js, Express.js, Mongoose, JWT authentication, bcrypt password hashing, multer file uploads
- **Database:** MongoDB
- **AI Service:** Python, Flask, scikit-learn (offline/local TF-IDF + Naive Bayes classifier), rule-based summarization/duplicate detection/chatbot fallback

## Project Structure

```text
crime-track-ai/
  client/                  # React frontend (Vite)
    src/
      components/
      context/
      layouts/
      pages/{public,citizen,admin,officer}
      routes/
      services/
  server/                  # Node.js + Express backend
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    uploads/               # Evidence uploads (created/served by backend)
    utils/
      seed.js              # Demo data seeder
  ai-service/              # Python AI microservice
    app.py
    classifier.py
    summarizer.py
    duplicate_detector.py
    requirements.txt
  .env.example
  README.md
```

## Core Features

### Citizen
- Register/login (JWT + role-based access)
- Submit crime reports with incident details, location, date/time, and evidence uploads
- AI-assisted category suggestion, summary suggestion, and possible-duplicate warning (advisory)
- Track complaint status by complaint ID
- View complaint history/details/timeline
- Receive notifications and view public safety alerts
- AI public safety assistant (reporting help, tracking help, emergency info, safety tips)

### Police Administrator
- Secure admin login and dashboard with live statistics/charts/map
- View, verify, reject, and manage all complaints
- Assign cases to officers and track assignment progress
- Manage officers and citizens
- Crime analytics, hotspot map, and report export (CSV)
- Publish/manage public safety alerts
- View audit logs and system activity

### Police Officer
- Secure officer login and dashboard
- View assigned and completed cases
- Access complaint details and evidence (authorized)
- Add investigation notes and progress updates
- Update case status (e.g. Under Investigation, Resolved)
- View notifications and profile settings

### Security & Data Handling
- Password hashing with bcrypt
- JWT/session-token based authentication
- Role-based authorization middleware
- File upload validation (type/size) and controlled storage
- Audit logging for key actions
- Complaint tracking endpoint returns limited public info unless requester is authorized owner/admin/officer

## Prerequisites

- **Node.js** 18+ and **npm** (tested with Node 24.x / npm 11.x)
- **Python** 3.10+ and **pip** (tested with Python 3.14)
- **MongoDB** running locally or MongoDB Atlas connection string
  - Local default URI: `mongodb://127.0.0.1:27017/crimetrack_ai`

## 1) Environment Configuration

Create environment files from the examples:

### Root (`.env` in project root, optional but recommended)
Copy `.env.example` to `.env` and adjust if needed:
```env
MONGO_URI=mongodb://127.0.0.1:27017/crimetrack_ai
JWT_SECRET=change_this_to_a_strong_secret
PORT=5000
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### Server (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/crimetrack_ai
JWT_SECRET=change_this_to_a_strong_secret
PORT=5000
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### Client (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> Note: The backend loads environment variables from `server/.env` (and supports running with root-level config in development). Keep `JWT_SECRET` private in real deployments.

## 2) Install Dependencies

Open separate terminals for each service.

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

### AI Service (Python)
```bash
cd ai-service
python -m pip install -r requirements.txt
```

On Windows, you may use `py -m pip install -r requirements.txt` if `python` is not mapped.

## 3) Seed Demo Data

Make sure MongoDB is running, then from `server/`:
```bash
npm run seed
```

This creates/refreshes fictional demo data including:
- 1 admin, 3 officers, 5 citizens
- 15 demo crime reports (`CT-DEMO-0001` to `CT-DEMO-0015`) with varied statuses/categories/dates/locations
- Complaint status histories, assigned cases, investigation notes, notifications, alerts, and audit logs

### Demo Credentials (fictional)
- **Admin:** `admin@crimetrack.demo` / `Password@123`
- **Officers:** `officer1@crimetrack.demo`, `officer2@crimetrack.demo`, `officer3@crimetrack.demo` / `Password@123`
- **Citizens:** `citizen1@crimetrack.demo` ... `citizen5@crimetrack.demo` / `Password@123`
- **Citizen (Noor, with sample complaints):** `noor@crimetrack.demo` / `Password@123`

## 4) Run the Application

Run all three services (in separate terminals):

### Backend API (port 5000)
```bash
cd server
npm run dev
```
(or `npm start`)

### Frontend (port 5173)
```bash
cd client
npm run dev
```

### AI Service (port 8000)
```bash
cd ai-service
python app.py
```
(or `py app.py` on Windows)

Open the app at: **http://localhost:5173**

Health checks:
- Backend: `http://localhost:5000/api/health`
- AI service: `http://localhost:8000/health`

## MongoDB Setup

### Local MongoDB
1. Install/start MongoDB Community Server.
2. Ensure it is listening on `mongodb://127.0.0.1:27017` (default).
3. Use `MONGO_URI=mongodb://127.0.0.1:27017/crimetrack_ai` in env files.
4. Run `npm run seed` from `server/`.

### MongoDB Atlas
1. Create a cluster/database user and allow network access.
2. Set `MONGO_URI` in `server/.env` to your Atlas connection string.
3. Run seed and start services as above.

## Main Pages / Routes

### Public
- `/` Home
- `/about` About Us
- `/features` Features
- `/how-it-works` How It Works
- `/contact` Contact / Emergency Info
- `/register` Citizen Registration
- `/login` Citizen Login
- `/admin/login` Admin Login
- `/officer/login` Officer Login

### Citizen Dashboard (`/citizen/*`)
- Overview, Report a Crime, Track Complaint, My Complaints, Complaint Details, Notifications, AI Assistant, Profile

### Admin Dashboard (`/admin/*`)
- Overview, All Reports, Manage Complaints, Assign Cases, Manage Officers, Manage Citizens, Analytics, Crime Map, Generate Reports, Alerts, Audit Logs, Settings, Report Details

### Officer Dashboard (`/officer/*`)
- Overview, Assigned Cases, Case Details, Investigation Updates, Investigation Notes, Completed Cases, Notifications, Profile

## REST API (high level)

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- **Users/Citizens:** `GET/PUT/DELETE /api/users/citizens` (admin), `GET /api/users/citizens/:id`, `PUT /api/users/me/profile`
- **Reports:** `POST /api/reports`, `GET /api/reports`, `GET /api/reports/my`, `GET /api/reports/:id`, `GET /api/reports/track/:complaintId`, `PUT /api/reports/:id/status`, `DELETE /api/reports/:id`
- **Officers:** `GET/POST/PUT/DELETE /api/officers`
- **Cases:** `GET /api/cases/assigned`, `PUT /api/cases/:id/update`, `POST /api/cases/:id/notes`
- **Dashboard:** `GET /api/dashboard/admin`, `GET /api/dashboard/citizen`, `GET /api/dashboard/officer`
- **Analytics:** `GET /api/analytics/monthly`, `GET /api/analytics/categories`, `GET /api/analytics/status`, `GET /api/analytics/weekly`, `GET /api/analytics/hotspots`
- **Notifications:** `GET /api/notifications`, `PUT /api/notifications/:id/read`, `PUT /api/notifications/read-all`
- **AI:** `POST /api/ai/classify`, `POST /api/ai/summarize`, `POST /api/ai/duplicate-check`, `POST /api/ai/chat`
- **Additional (supporting UI/admin):** `/api/alerts`, `/api/audit-logs`, `/api/health`

## Database Collections (MongoDB)

Primary collections/models:
- `users` – registered users and roles
- `policeofficers` – officer profile/department/badge/availability
- `crimereports` – crime complaints, evidence, AI suggestions, assignment/status
- `complaintstatuses` – status history/timeline per complaint
- `assignedcases` – case assignment records
- `investigationnotes` – officer investigation notes and progress
- `notifications` – user notifications
- `publicsafetyalerts` – admin-published alerts
- `auditlogs` – action traceability

## AI Behavior and Safety Notes

- **Category classification:** suggests a likely crime category from description (offline model in AI service; backend fallback available)
- **Summarization:** generates a short assistive summary of complaint text
- **Duplicate detection:** flags possible similar complaints for review (advisory, not automatic rejection)
- **Chatbot:** answers general questions about reporting, tracking, safety tips, and emergency contacts
- **Safety constraints:** AI outputs are advisory only. The system does **not** identify suspects, determine guilt, or make enforcement decisions. Human/admin/officer review is required for case actions.

## Troubleshooting

- **MongoDB connection error:** ensure MongoDB is running and `MONGO_URI` is correct.
- **CORS/API errors:** confirm `CLIENT_URL` in server env matches frontend URL and `VITE_API_URL` points to backend `/api`.
- **AI suggestions unavailable:** start the AI service on port 8000; backend includes local fallback behavior for core AI endpoints, but running the AI service is recommended for the full architecture.
- **File uploads:** ensure `server/uploads/` exists and is writable; backend serves uploads from `/uploads`.
- **Port conflicts:** update `PORT`, `CLIENT_URL`, `AI_SERVICE_URL`, or Vite port and corresponding env values.

## Notes

- Evidence uploads are restricted to allowed file types and size limits.
- Seed script resets demo records (including demo users/reports) to provide a consistent demonstration dataset.
- For production use, additional hardening is required (HTTPS, secret management, storage strategy, rate limiting tuning, monitoring, backups, etc.).
