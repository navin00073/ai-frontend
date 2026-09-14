# Frontend (Website) — AI Smart Attendance System

This is the **dining area** of the app — the part people see and click on
(dashboard, student list, login page, etc). It gets its data by calling
the backend's `/api/...` addresses.

## How to run

1. First, start the backend (see `../backend/README.md`) — it must
   already be running on http://localhost:3000
2. Then run this frontend:

```bash
cd frontend
npm install
npm run dev
```

It will start at: http://localhost:5173

Any request this website makes to `/api/...` is automatically
forwarded to the backend at port 3000 (this is set up in
`vite.config.ts`, in the `server.proxy` part).
