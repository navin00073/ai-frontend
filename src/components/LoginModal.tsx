import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Lock,
  User,
  X,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LogIn
} from 'lucide-react';
import { StaffUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: StaffUser) => void;
  allStaff: StaffUser[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  allStaff
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'faculty' | 'student'>('admin');
  const [uidInput, setUidInput] = useState('UID-ADM-1001');
  const [password, setPassword] = useState('admin@2026');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsHelp, setShowCredentialsHelp] = useState(false);

  if (!isOpen) return null;

  const handleTabSwitch = (tab: 'admin' | 'faculty' | 'student') => {
    setActiveTab(tab);
    setErrorMessage(null);
    if (tab === 'admin') {
      setUidInput('UID-ADM-1001');
      setPassword('admin@2026');
    } else if (tab === 'faculty') {
      setUidInput('UID-STF-2088');
      setPassword('faculty@2026');
    } else {
      setUidInput('23CS041');
      setPassword('student@2026');
    }
  };

  const handleQuickLogin = (user: StaffUser) => {
    onLoginSuccess(user);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uidNum: uidInput, password })
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMessage(data.message || 'Invalid credentials. Please verify your UID Number and Password.');
      }
    } catch {
      // Local fallback
      const found = allStaff.find(s => s.uidNum.toLowerCase() === uidInput.trim().toLowerCase());
      if (found) {
        onLoginSuccess(found);
        onClose();
      } else {
        setErrorMessage('Authentication service offline or invalid credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-slate-900 border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white mt-3">Smart Gateway Sign In</h2>
          <p className="text-xs text-slate-400 mt-0.5">Dual-Factor Biometric Administration Portal</p>

          {/* Role selector tabs */}
          <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 mt-4 text-xs font-semibold">
            <button
              onClick={() => handleTabSwitch('admin')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={() => handleTabSwitch('faculty')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                activeTab === 'faculty' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              onClick={() => handleTabSwitch('student')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                activeTab === 'student' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">
                {activeTab === 'student' ? 'Student Roll / Register Number' : 'Staff UID Number'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={uidInput}
                  onChange={e => setUidInput(e.target.value)}
                  placeholder={activeTab === 'student' ? 'e.g. 23CS041' : 'e.g. UID-ADM-1001'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* "Need password?" Accordion */}
          <div className="border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowCredentialsHelp(!showCredentialsHelp)}
              className="w-full flex items-center justify-between text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1"
            >
              <span className="flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need password? View Available Roster</span>
              </span>
              {showCredentialsHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCredentialsHelp && (
              <div className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Quick Demo Accounts (1-Click Switch):</p>
                <div className="space-y-1.5 font-mono">
                  <div
                    onClick={() => handleQuickLogin(allStaff[0])}
                    className="p-1.5 bg-white rounded border border-slate-200 hover:border-indigo-500 cursor-pointer flex items-center justify-between"
                  >
                    <span><strong>Admin:</strong> Dr. Vikram Rao</span>
                    <span className="text-indigo-600">UID-ADM-1001</span>
                  </div>
                  <div
                    onClick={() => handleQuickLogin(allStaff[3] || allStaff[1])}
                    className="p-1.5 bg-white rounded border border-slate-200 hover:border-indigo-500 cursor-pointer flex items-center justify-between"
                  >
                    <span><strong>Faculty:</strong> Prof. Marcus Brody</span>
                    <span className="text-indigo-600">UID-STF-2088</span>
                  </div>
                  <div
                    onClick={() => {
                      const studentUser: StaffUser = {
                        id: 'usr_stu_stud_1',
                        uidNum: '23CS041',
                        username: '23cs041',
                        name: 'Aarav Sharma',
                        role: 'student',
                        designation: 'Undergraduate Student',
                        department: 'Computer Science & Engineering',
                        staffId: '23CS041',
                        email: 'aarav.23cs041@college.edu',
                        phone: '+91 98401 23456',
                        lastLogin: new Date().toISOString(),
                        studentId: 'stud_1'
                      };
                      handleQuickLogin(studentUser);
                    }}
                    className="p-1.5 bg-white rounded border border-slate-200 hover:border-indigo-500 cursor-pointer flex items-center justify-between"
                  >
                    <span><strong>Student:</strong> Aarav Sharma</span>
                    <span className="text-indigo-600">23CS041</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
