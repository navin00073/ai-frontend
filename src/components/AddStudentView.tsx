import React, { useState } from 'react';
import {
  UserPlus,
  ScanFace,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student } from '../types';

interface AddStudentViewProps {
  onSaveStudent: (studentData: Partial<Student>, proceedToFace: boolean) => void;
  onCancel: () => void;
}

export const AddStudentView: React.FC<AddStudentViewProps> = ({
  onSaveStudent,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    registerNo: '',
    branch: 'Computer Science & Engineering',
    degree: 'B.Tech',
    yearOfStudy: 3,
    section: 'A',
    nfcUid: '',
    email: '',
    phone: '',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  ];

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.rollNo.trim()) errs.rollNo = 'Roll Number is required (e.g. 23CS099)';
    if (!formData.registerNo.trim()) errs.registerNo = 'University Register No is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (proceedToFace: boolean) => {
    if (!validate()) return;
    onSaveStudent(formData, proceedToFace);
  };

  return (
    <div id="add-student-view" className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Enroll New Student
            </h1>
            <p className="text-xs text-slate-500">
              Register biometric credentials, roll details, and ISO 14443A NFC card
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        
        {/* Profile Avatar Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
            Student Photo / Avatar
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={formData.profilePhoto}
              alt="Selected"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-xs"
            />
            <div className="flex flex-wrap gap-2">
              {sampleAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, profilePhoto: url })}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                    formData.profilePhoto === url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Siddharth Verma"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Class Roll Number *
            </label>
            <input
              type="text"
              value={formData.rollNo}
              onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
              placeholder="e.g. 23CS150"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.rollNo && <p className="text-[11px] text-rose-600 mt-1">{errors.rollNo}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              University Register No *
            </label>
            <input
              type="text"
              value={formData.registerNo}
              onChange={e => setFormData({ ...formData, registerNo: e.target.value })}
              placeholder="e.g. 310623104150"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
            {errors.registerNo && <p className="text-[11px] text-rose-600 mt-1">{errors.registerNo}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Department / Branch
            </label>
            <select
              value={formData.branch}
              onChange={e => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
              <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Year of Study & Section
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={formData.yearOfStudy}
                onChange={e => setFormData({ ...formData, yearOfStudy: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>
              <select
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
                <option value="C">Sec C</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              NFC Card UID (Optional)
            </label>
            <input
              type="text"
              value={formData.nfcUid}
              onChange={e => setFormData({ ...formData, nfcUid: e.target.value })}
              placeholder="e.g. 5A92B104F2"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Campus Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="student@college.edu"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98400 00000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Save Record
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all"
          >
            <ScanFace className="w-4 h-4" />
            <span>Save & Enroll Face Biometrics</span>
          </button>
        </div>

      </div>

    </div>
  );
};
