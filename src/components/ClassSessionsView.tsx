import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';
import { ClassSession, Subject, StaffUser } from '../types';

interface ClassSessionsViewProps {
  sessions: ClassSession[];
  subjects: Subject[];
  staff: StaffUser[];
  onToggleSession: (sessionId: string) => void;
  onCreateSession: (session: Partial<ClassSession>) => void;
}

export const ClassSessionsView: React.FC<ClassSessionsViewProps> = ({
  sessions,
  subjects,
  staff,
  onToggleSession,
  onCreateSession
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || 'sub_1',
    subjectName: subjects[0]?.name || 'Computer Vision & Deep Learning',
    subjectCode: subjects[0]?.code || 'CS501',
    facultyName: 'Prof. Marcus Brody',
    classroomName: 'Smart Classroom 402',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    closingTime: '10:00',
    lateThreshold: '09:10',
    academicYear: '2026-2027',
    semester: 'Semester 5',
    isActive: false
  });

  const handleSubjectChange = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    if (sub) {
      setFormData({
        ...formData,
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code
      });
    }
  };

  const handleSave = () => {
    onCreateSession(formData);
    setIsCreateOpen(false);
  };

  return (
    <div id="class-sessions-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Academic Class Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define active attendance windows, late threshold tolerances, and smart hall routing
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map(sess => (
          <div
            key={sess.id}
            className={`rounded-2xl border p-5 transition-all ${
              sess.isActive
                ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {sess.subjectCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-tight">
                  {sess.subjectName}
                </h3>
              </div>
              <button
                onClick={() => onToggleSession(sess.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sess.isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${sess.isActive ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                <span>{sess.isActive ? 'ACTIVE (LIVE)' : 'Activate'}</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{sess.facultyName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{sess.classroomName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{sess.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{sess.startTime} - {sess.closingTime}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Late Grace Limit:</span>
              <span className="font-mono font-bold text-amber-600">&lt; {sess.lateThreshold} AM</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Session Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 text-slate-900 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Schedule Class Session</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Subject Course</label>
                <select
                  value={formData.subjectId}
                  onChange={e => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Assign Faculty</label>
                <input
                  type="text"
                  value={formData.facultyName}
                  onChange={e => setFormData({ ...formData, facultyName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Classroom / Hall</label>
                <input
                  type="text"
                  value={formData.classroomName}
                  onChange={e => setFormData({ ...formData, classroomName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Late Threshold</label>
                  <input
                    type="time"
                    value={formData.lateThreshold}
                    onChange={e => setFormData({ ...formData, lateThreshold: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={formData.closingTime}
                    onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-set-active"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="chk-set-active" className="text-slate-700 font-semibold">
                  Make this session ACTIVE (LIVE) immediately
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
              >
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
