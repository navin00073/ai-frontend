import React from 'react';
import {
  X,
  Mail,
  Phone,
  ScanFace,
  CreditCard,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  attendanceRecords: AttendanceRecord[];
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
  attendanceRecords
}) => {
  if (!isOpen || !student) return null;

  const studentAttendance = attendanceRecords.filter(r => r.studentId === student.id);
  const presentCount = studentAttendance.filter(r => r.status === 'PRESENT').length;
  const lateCount = studentAttendance.filter(r => r.status === 'LATE').length;
  const totalClasses = 12; // Standard semester semester sessions
  const attendedClasses = studentAttendance.length;
  const attendanceRate = Math.round((attendedClasses / totalClasses) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-900 border border-slate-200">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <img
              src={student.profilePhoto}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <h2 className="text-lg font-bold text-white">{student.name}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {student.status}
                </span>
              </div>
              <p className="text-xs font-mono text-indigo-300 mt-0.5">
                Roll No: {student.rollNo} • Reg No: {student.registerNo}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {student.degree} in {student.branch} (Year {student.yearOfStudy}, Sec {student.section})
              </p>
            </div>
          </div>
        </div>

        {/* Biometrics & Attendance Stats */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
              <p className={`text-xl font-black mt-1 ${attendanceRate >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {attendanceRate}%
              </p>
              <p className="text-[10px] text-slate-500">{attendedClasses} of {totalClasses} classes</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Face Model</span>
              <p className="text-xs font-bold text-slate-900 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{student.faceSamplesCount || 4}/4 Samples</span>
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{student.faceId}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">NFC Badge</span>
              <p className="text-xs font-mono font-bold text-indigo-600 mt-1">
                {student.nfcUid || 'Unpaired'}
              </p>
              <p className="text-[10px] text-slate-500">ISO 14443A Tag</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{student.email || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{student.phone || 'N/A'}</span>
            </div>
          </div>

          {/* Recent Attendance Records */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Recent Attendance History ({studentAttendance.length})
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAttendance.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-slate-600">{rec.date}</td>
                      <td className="py-2 px-3 font-medium text-slate-900 truncate max-w-[140px]">{rec.subject}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{rec.time}</td>
                      <td className="py-2 px-3 text-slate-500 text-[11px]">{rec.verificationMethod}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {studentAttendance.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No recorded sessions for this student yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
