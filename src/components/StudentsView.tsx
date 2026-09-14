import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  ScanFace,
  CreditCard,
  Eye,
  Trash2,
  Grid,
  List,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEnrollFace: (student: Student) => void;
  onPairNfc: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onNavigateToAddStudent: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onEnrollFace,
  onPairNfc,
  onDeleteStudent,
  onNavigateToAddStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const branches = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.branch)));
    return ['All', ...list];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.registerNo.toLowerCase().includes(q) ||
        s.nfcUid.toLowerCase().includes(q);

      const matchesBranch = selectedBranch === 'All' || s.branch === selectedBranch;
      const matchesYear = selectedYear === 'All' || s.yearOfStudy.toString() === selectedYear;

      return matchesSearch && matchesBranch && matchesYear;
    });
  }, [students, searchQuery, selectedBranch, selectedYear]);

  return (
    <div id="students-directory-view" className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Students Biometric Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Registered students with paired 128-D facial embeddings and ISO 14443A NFC badges
          </p>
        </div>
        <button
          id="btn-students-add-new"
          onClick={onNavigateToAddStudent}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-students"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, roll no, NFC UID..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Dropdowns & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {branches.map(b => (
              <option key={b} value={b}>
                {b === 'All' ? 'All Departments' : b}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={student.profilePhoto}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {student.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {student.name}
                  </h3>
                  <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">
                    {student.rollNo} • Sec {student.section}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1" title={student.branch}>
                    {student.degree} • {student.branch}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">NFC UID:</span>
                    <span className="font-mono font-semibold text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                      {student.nfcUid || 'Not Paired'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Face Model:</span>
                    <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{student.faceSamplesCount || 4}/4 Samples</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-xs">
                <button
                  onClick={() => onSelectStudent(student)}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-medium text-[11px] flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
                  title="View Student Profile"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => onEnrollFace(student)}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-medium text-[11px] flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
                  title="Update Face Biometrics"
                >
                  <ScanFace className="w-3.5 h-3.5" />
                  <span>Face</span>
                </button>
                <button
                  onClick={() => onPairNfc(student)}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 font-medium text-[11px] flex items-center justify-center space-x-1 border border-slate-200 transition-colors"
                  title="Pair NFC Badge"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>NFC</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Register No</th>
                  <th className="py-3 px-4">Branch & Year</th>
                  <th className="py-3 px-4">NFC UID</th>
                  <th className="py-3 px-4">Biometrics</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.profilePhoto}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{student.rollNo}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{student.registerNo}</td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700">{student.branch}</span>
                      <span className="text-slate-400 block text-[11px]">Yr {student.yearOfStudy} • Sec {student.section}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 bg-slate-50/50">
                      {student.nfcUid || 'None'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 font-semibold text-[11px]">
                        {student.faceSamplesCount || 4} Samples Enrolled
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEnrollFace(student)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg"
                          title="Face Biometrics"
                        >
                          <ScanFace className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onPairNfc(student)}
                          className="p-1.5 text-slate-600 hover:text-cyan-600 hover:bg-slate-100 rounded-lg"
                          title="NFC Card"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
