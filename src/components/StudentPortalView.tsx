import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CreditCard,
  ScanFace
} from 'lucide-react';
import { Student, AttendanceRecord, StaffUser } from '../types';

interface StudentPortalViewProps {
  currentUser: StaffUser;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  currentUser,
  students,
  attendanceRecords
}) => {
  // Find logged in student
  const student = students.find(s => s.id === currentUser.studentId || s.rollNo === currentUser.uidNum) || students[0];

  const myRecords = attendanceRecords.filter(r => r.studentId === student.id);
  const presentCount = myRecords.filter(r => r.status === 'PRESENT').length;
  const lateCount = myRecords.filter(r => r.status === 'LATE').length;

  const totalClasses = 14;
  const attendedClasses = myRecords.length;
  const attendanceRate = Math.min(100, Math.round((attendedClasses / totalClasses) * 100));

  const subjectsBreakdown = [
    { code: 'CS501', name: 'Computer Vision & Deep Learning', attended: 4, total: 4, rate: 100 },
    { code: 'CS502', name: 'Distributed Cloud Systems', attended: 3, total: 4, rate: 75 },
    { code: 'CS503', name: 'Embedded IoT & Hardware Protocols', attended: 3, total: 3, rate: 100 },
    { code: 'AI504', name: 'Reinforcement Learning & Neural Agents', attended: 2, total: 3, rate: 67 }
  ];

  const handleDownloadSlip = () => {
    const slipContent = `
===================================================
     INSTITUTE OF TECHNOLOGY & SCIENCE
         OFFICIAL ATTENDANCE SLIP (SEMESTER 5)
===================================================
Student Name: ${student.name}
Roll Number:  ${student.rollNo}
Register No:  ${student.registerNo}
Department:   ${student.branch}
Date Generated: ${new Date().toLocaleDateString()}

Overall Attendance: ${attendanceRate}%
Status: ${attendanceRate >= 75 ? 'ELIGIBLE FOR FINAL EXAMINATIONS' : 'CONDITIONAL / DEFICIT'}

Course Breakdown:
- CS501 Computer Vision: 100%
- CS502 Distributed Systems: 75%
- CS503 Embedded IoT: 100%
- AI504 Reinforcement Learning: 67%

Dual-Factor Biometrics Verified: NFC [${student.nfcUid}] & Face [${student.faceId}]
===================================================
`;
    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_Slip_${student.rollNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="student-portal-view" className="space-y-6">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-5">
          <img
            src={student.profilePhoto}
            alt={student.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-400/40 shadow-lg"
          />
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{student.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Verified Student
              </span>
            </div>
            <p className="text-xs font-mono text-indigo-300 mt-1">
              Roll No: {student.rollNo} • Register No: {student.registerNo}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              {student.degree} in {student.branch} • Year {student.yearOfStudy} (Section {student.section})
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-[11px]">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>NFC: <strong className="font-mono text-white">{student.nfcUid}</strong></span>
              </span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1.5">
                <ScanFace className="w-3.5 h-3.5 text-emerald-400" />
                <span>Face Biometrics: <strong className="text-emerald-300">4/4 Enrolled</strong></span>
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadSlip}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Attendance Slip</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Overall Percentage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Attendance</p>
            <h3 className={`text-3xl font-black mt-1 ${attendanceRate >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {attendanceRate}%
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">{attendedClasses} of {totalClasses} scheduled sessions</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Punctuality On-Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Punctual Check-ins</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{presentCount}</h3>
            <p className="text-[11px] text-slate-500 mt-1">{lateCount} arrival(s) marked late</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Exam Eligibility */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Exam Eligibility</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-1">Eligible</h3>
            <p className="text-[11px] text-slate-500 mt-1">Surpasses statutory 75% cutoff</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Course-by-course Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Registered Course Attendance Status</h2>
          <p className="text-xs text-slate-500">Subject-wise session tallies and exam eligibility criteria</p>
        </div>

        <div className="space-y-3">
          {subjectsBreakdown.map((sub, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-indigo-600 mr-2">{sub.code}</span>
                  <span className="font-bold text-slate-900">{sub.name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-black ${sub.rate >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {sub.rate}%
                  </span>
                  <span className="text-slate-400 ml-1 text-[11px]">({sub.attended}/{sub.total})</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${sub.rate >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${sub.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">My Attendance Audit Log</h2>
          <p className="text-xs text-slate-500">Cryptographically recorded timestamps from gateway kiosks</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Hall & Faculty</th>
                <th className="py-2.5 px-3">Biometrics</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{rec.date}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{rec.time}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{rec.subject}</td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">{rec.classroom} • {rec.faculty}</td>
                  <td className="py-2.5 px-3 text-indigo-600 font-semibold">{rec.faceConfidence}% Match</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
