import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  X,
  FileText
} from 'lucide-react';
import { AttendanceRecord, Student } from '../types';

interface CsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceRecords: AttendanceRecord[];
  students: Student[];
}

export const CsvExportModal: React.FC<CsvExportModalProps> = ({
  isOpen,
  onClose,
  attendanceRecords,
  students
}) => {
  const [exportType, setExportType] = useState<'attendance' | 'students'>('attendance');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateAttendanceCsv = () => {
    const headers = ['Record ID', 'Date', 'Time', 'Student Name', 'Roll No', 'Register No', 'Department', 'Subject', 'Faculty', 'Classroom', 'NFC UID', 'Face Confidence (%)', 'Status', 'Verification Method', 'ESP32 Device'];
    const rows = attendanceRecords.map(r => [
      r.id,
      r.date,
      r.time,
      `"${r.studentName}"`,
      r.rollNo,
      r.registerNo,
      `"${r.branch}"`,
      `"${r.subject}"`,
      `"${r.faculty}"`,
      `"${r.classroom}"`,
      r.nfcUid,
      r.faceConfidence,
      r.status,
      `"${r.verificationMethod}"`,
      r.deviceId
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const generateStudentsCsv = () => {
    const headers = ['Student ID', 'Name', 'Roll No', 'Register No', 'Degree', 'Department', 'Year', 'Section', 'NFC UID', 'Face Samples', 'Status', 'Email', 'Phone'];
    const rows = students.map(s => [
      s.id,
      `"${s.name}"`,
      s.rollNo,
      s.registerNo,
      s.degree,
      `"${s.branch}"`,
      s.yearOfStudy,
      s.section,
      s.nfcUid,
      s.faceSamplesCount,
      s.status,
      s.email,
      s.phone
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const csvContent = exportType === 'attendance' ? generateAttendanceCsv() : generateStudentsCsv();

  const handleDownload = () => {
    const filename = exportType === 'attendance' ? `Attendance_Export_${new Date().toISOString().split('T')[0]}.csv` : `Students_Directory_${new Date().toISOString().split('T')[0]}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-900 border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Export Institutional Dataset</h2>
              <p className="text-xs text-slate-500">Standard CSV format compatible with ERP and Excel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setExportType('attendance')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                exportType === 'attendance' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Attendance Audit Logs ({attendanceRecords.length} Rows)
            </button>
            <button
              onClick={() => setExportType('students')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                exportType === 'students' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Enrolled Students Roster ({students.length} Rows)
            </button>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={csvContent}
              rows={8}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-[11px] p-4 rounded-2xl border border-slate-800 focus:outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy CSV'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download .CSV File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
