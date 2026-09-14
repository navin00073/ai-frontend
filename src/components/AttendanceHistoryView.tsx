import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ArrowUpDown
} from 'lucide-react';
import { AttendanceRecord, Student, Subject } from '../types';

interface AttendanceHistoryViewProps {
  attendanceRecords: AttendanceRecord[];
  students: Student[];
  subjects: Subject[];
  onOpenCsvModal: () => void;
}

export const AttendanceHistoryView: React.FC<AttendanceHistoryViewProps> = ({
  attendanceRecords,
  students,
  subjects,
  onOpenCsvModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  const subjectNames = useMemo(() => {
    const list = Array.from(new Set(attendanceRecords.map(r => r.subject)));
    return ['All', ...list];
  }, [attendanceRecords]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        r.studentName.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.nfcUid.toLowerCase().includes(q);

      const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
      const matchesDate = !selectedDate || r.date === selectedDate;

      return matchesSearch && matchesSubject && matchesStatus && matchesDate;
    });
  }, [attendanceRecords, searchQuery, selectedSubject, selectedStatus, selectedDate]);

  const presentCount = filteredRecords.filter(r => r.status === 'PRESENT').length;
  const lateCount = filteredRecords.filter(r => r.status === 'LATE').length;

  return (
    <div id="attendance-history-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Attendance Archive & Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit trail of all dual-factor verified attendance events with hardware timestamps
          </p>
        </div>
        <button
          onClick={onOpenCsvModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Filtered CSV</span>
        </button>
      </div>

      {/* Stats Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Entries</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{filteredRecords.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">On-Time (Present)</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{presentCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Late Arrivals</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{lateCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student, roll no, NFC..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Subject */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 max-w-xs truncate"
          >
            {subjectNames.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="PRESENT">PRESENT</option>
            <option value="LATE">LATE</option>
          </select>

          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />

          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear Date
            </button>
          )}
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Method & Device</th>
                <th className="py-3 px-4">Face Confidence</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(rec => {
                const student = students.find(s => s.id === rec.studentId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{rec.date}</p>
                      <p className="font-mono text-[11px] text-slate-400">{rec.time}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={student?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                          alt={rec.studentName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{rec.studentName}</p>
                          <p className="text-[11px] text-slate-400">{rec.branch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{rec.rollNo}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{rec.subject}</p>
                      <p className="text-[11px] text-slate-400">{rec.classroom} • {rec.faculty}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-700 font-medium">{rec.verificationMethod}</p>
                      <p className="font-mono text-[11px] text-slate-400">Card: {rec.nfcUid} • {rec.deviceId}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-indigo-600">{rec.faceConfidence}%</span>
                      {rec.livenessScore && (
                        <span className="text-slate-400 block text-[10px]">
                          Liveness: {rec.livenessScore}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
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
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No attendance records match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
