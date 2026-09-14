import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  UserPlus,
  Mail,
  Phone,
  Search,
  Key,
  X
} from 'lucide-react';
import { StaffUser } from '../types';

interface StaffDirectoryViewProps {
  staff: StaffUser[];
  onAddStaff: (member: Partial<StaffUser>) => void;
}

export const StaffDirectoryView: React.FC<StaffDirectoryViewProps> = ({
  staff,
  onAddStaff
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: 'faculty' as 'admin' | 'faculty',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    email: '',
    phone: '+91 98400 00000',
    uidNum: `UID-STF-${Math.floor(2000 + Math.random() * 800)}`,
    staffId: `STF-FAC-${Math.floor(10 + Math.random() * 80)}`
  });

  const filtered = staff.filter(s => {
    const q = search.toLowerCase();
    const matchesQuery = s.name.toLowerCase().includes(q) || s.uidNum.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleSave = () => {
    if (!formData.name) return;
    onAddStaff({
      ...formData,
      username: formData.name.toLowerCase().replace(/\s+/g, '.')
    });
    setIsModalOpen(false);
  };

  return (
    <div id="staff-directory-view" className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Staff & Administrator UID Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Authorized academic personnel, gateway access tokens, and administrative credentials
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by staff name, UID number..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="faculty">Faculty Members</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(st => (
          <div
            key={st.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                {st.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                st.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {st.role}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{st.name}</h3>
              <p className="text-xs font-semibold text-slate-600">{st.designation}</p>
              <p className="text-[11px] text-slate-500">{st.department}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">UID Number:</span>
                <span className="font-mono font-bold text-indigo-600">{st.uidNum}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Staff ID:</span>
                <span className="font-mono text-slate-700">{st.staffId}</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{st.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{st.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-slate-900 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add Staff / Administrator</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Robert Langdon"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Role Permission</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as 'admin' | 'faculty' })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Assigned UID Number</label>
                <input
                  type="text"
                  value={formData.uidNum}
                  onChange={e => setFormData({ ...formData, uidNum: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-indigo-600 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Campus Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="faculty@college.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
