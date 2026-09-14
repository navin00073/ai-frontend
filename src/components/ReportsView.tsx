import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface ReportsViewProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onOpenCsvModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students,
  attendanceRecords,
  onOpenCsvModal
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'semester'>('week');

  const presentTotal = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const lateTotal = attendanceRecords.filter(r => r.status === 'LATE').length;
  const totalLogs = presentTotal + lateTotal;
  const overallRate = totalLogs > 0 ? Math.round((presentTotal / totalLogs) * 100) : 100;

  // Department metrics
  const departments = [
    { name: 'Computer Science & Engineering', totalStudents: 7, presentRate: 94, color: 'bg-indigo-600' },
    { name: 'Artificial Intelligence & Data Science', totalStudents: 2, presentRate: 88, color: 'bg-cyan-600' },
    { name: 'Electronics & Communication Engineering', totalStudents: 1, presentRate: 90, color: 'bg-emerald-600' }
  ];

  // Calculate per-student attendance percentage
  const studentEligibility = students.map(s => {
    const logs = attendanceRecords.filter(r => r.studentId === s.id);
    const attended = logs.length;
    const totalPossible = 10; // semester benchmark
    const pct = Math.min(100, Math.round((attended / totalPossible) * 100));
    return {
      student: s,
      attended,
      percentage: pct,
      isAtRisk: pct < 75
    };
  }).sort((a, b) => a.percentage - b.percentage);

  const atRiskStudents = studentEligibility.filter(s => s.isAtRisk);

  return (
    <div id="reports-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Attendance Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Punctuality metrics, departmental aggregations, and academic eligibility alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Time range toggle */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center text-xs font-semibold">
            {(['today', 'week', 'month', 'semester'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  timeRange === t ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenCsvModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Punctuality</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{overallRate}%</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+4.2% higher than prior semester</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Verified Events</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{totalLogs}</h3>
          <p className="text-xs text-slate-500 mt-1">
            Dual-factor NFC + Face correlation
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Risk Watch</p>
          <h3 className="text-3xl font-black text-amber-600 mt-2">{atRiskStudents.length} Students</h3>
          <p className="text-xs text-slate-500 mt-1">Below statutory 75% exam cutoff</p>
        </div>
      </div>

      {/* 2-Column: Department Breakdown & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Attendance Rates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Department-Wise Punctuality Breakdown
          </h2>
          <div className="space-y-4">
            {departments.map((dept, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{dept.name}</span>
                  <span className="font-bold text-slate-900">{dept.presentRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${dept.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${dept.presentRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dept.totalStudents} enrolled students</span>
                  <span>Target: &gt; 85%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Check-In Status Breakdown
          </h2>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-900">On-Time (Present)</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-900">{presentTotal}</span>
                <span className="text-xs text-emerald-700 ml-1">({overallRate}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-900">Late Check-ins</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-900">{lateTotal}</span>
                <span className="text-xs text-amber-700 ml-1">({100 - overallRate}%)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <strong>Late Threshold Rule:</strong> Students scanning greater than 10 minutes past scheduled start time are automatically categorized as LATE according to university policy.
            </div>
          </div>
        </div>

      </div>

      {/* At-Risk Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Semester Exam Eligibility Monitoring</h2>
            <p className="text-xs text-slate-500">Students with attendance percentages near or below mandatory 75% threshold</p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
            Mandatory Cutoff: 75%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Sessions Attended</th>
                <th className="py-2.5 px-3">Percentage</th>
                <th className="py-2.5 px-3 text-right">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentEligibility.slice(0, 6).map(({ student, attended, percentage, isAtRisk }) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{student.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{student.rollNo}</td>
                  <td className="py-2.5 px-3 text-slate-600">{student.branch}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{attended} / 10</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-bold ${percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {percentage}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isAtRisk ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isAtRisk ? 'Risk: Below 75%' : 'Eligible'}
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
