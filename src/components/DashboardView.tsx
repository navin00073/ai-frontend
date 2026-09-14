import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Cpu,
  Video,
  CreditCard,
  UserPlus,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Student, AttendanceRecord, ClassSession, Device, ActivityLog } from '../types';
import { TabType } from './Sidebar';

interface DashboardViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  activeSession: ClassSession | null;
  activeDevice: Device | null;
  cameraConnected: boolean;
  esp32Online: boolean;
  activityLogs: ActivityLog[];
  isSessionActive: boolean;
  onOpenSessionModal: () => void;
  onNavigateToTab: (tab: TabType) => void;
  onOpenCsvModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  attendanceRecords,
  activeSession,
  activeDevice,
  cameraConnected,
  esp32Online,
  activityLogs,
  isSessionActive,
  onOpenSessionModal,
  onNavigateToTab,
  onOpenCsvModal
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter(r => r.date === today);
  const presentCount = todayRecords.filter(r => r.status === 'PRESENT').length;
  const lateCount = todayRecords.filter(r => r.status === 'LATE').length;
  const totalMarked = presentCount + lateCount;
  const punctualityRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 100;

  // Hourly volume simulation
  const hours = [
    { label: '08:00 - 09:00 AM', count: 2, height: '40%' },
    { label: '09:00 - 10:00 AM', count: 2, height: '40%' },
    { label: '10:00 - 11:00 AM', count: 4, height: '80%' },
    { label: '11:00 - 12:00 PM', count: 0, height: '4%' },
    { label: '12:00 - 01:00 PM', count: 0, height: '4%' }
  ];

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Top Welcome & Active Session Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-slate-800 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isSessionActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSessionActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isSessionActive ? 'Active Class Session LIVE' : 'Gateway in Standby'}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeDevice?.wifiSsid || 'Campus_Secure_IoT_5G'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black mt-2 text-white tracking-tight">
              {activeSession ? activeSession.subjectName : 'No Active Session'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Code: <strong className="text-white">{activeSession?.subjectCode || 'CS501'}</strong></span>
              <span>•</span>
              <span>Faculty: <strong className="text-white">{activeSession?.facultyName || 'Prof. Marcus Brody'}</strong></span>
              <span>•</span>
              <span>Hall: <strong className="text-white">{activeSession?.classroomName || 'Room 402'}</strong></span>
              <span>•</span>
              <span>Window: <strong className="text-white">{activeSession?.startTime || '09:00'} - {activeSession?.closingTime || '10:00'}</strong></span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-dash-launch-camera"
              onClick={() => onNavigateToTab('live-camera')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live Camera</span>
            </button>
            <button
              id="btn-dash-session-manager"
              onClick={onOpenSessionModal}
              className="flex items-center space-x-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              <span>Manage Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{students.length}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
              <span>100% Face & NFC Paired</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Verified Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Verified</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{totalMarked} / {students.length}</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              <strong className="text-slate-900">{presentCount}</strong> On-Time • <strong className="text-amber-600">{lateCount}</strong> Late
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Punctuality Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Punctuality Rate</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{punctualityRate}%</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Threshold: &lt; {activeSession?.lateThreshold || '09:10'} AM
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* ESP32 Hardware */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">ESP32 IoT Gateways</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {esp32Online ? '2 / 2 Online' : '1 Gateway Degraded'}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>RFID-RC522 Ready</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span>Quick System Shortcuts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToTab('live-camera')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open Camera Kiosk</span>
          </button>
          <button
            onClick={() => onNavigateToTab('nfc-registration')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pair Student NFC Card</span>
          </button>
          <button
            onClick={() => onNavigateToTab('add-student')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-600" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={onOpenCsvModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2-Column: Live Attendance Stream & Hourly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Today's Live Attendance Stream */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Live Attendance Stream</h2>
              <p className="text-xs text-slate-500">Real-time records automatically verified via dual-factor NFC + AI Face Recognition</p>
            </div>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-xs text-indigo-600 font-bold hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">NFC UID</th>
                  <th className="py-2.5 px-3">Face Conf</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayRecords.slice(0, 5).map((rec) => {
                  const student = students.find(s => s.id === rec.studentId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={student?.profilePhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80'}
                            alt={rec.studentName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-bold text-slate-900">{rec.studentName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{rec.rollNo}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{rec.time}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{rec.nfcUid}</td>
                      <td className="py-2.5 px-3 font-semibold text-indigo-600">{rec.faceConfidence}%</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'PRESENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'LATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 cols: Telemetry & Activity Logs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Live Gateway Telemetry</h2>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              POLLING ACTIVE
            </span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {activityLogs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 text-xs flex items-start space-x-2.5"
              >
                <div className="mt-0.5 shrink-0">
                  {log.type === 'ATTENDANCE_VERIFIED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : log.type === 'SECURITY_ALERT' ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : log.type === 'USER_LOGIN' ? (
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Activity className="w-4 h-4 text-cyan-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                      {log.type}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] mt-0.5 leading-snug break-words">
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
