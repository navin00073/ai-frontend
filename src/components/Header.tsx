import React, { useState } from 'react';
import {
  ScanFace,
  Radio,
  Wifi,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Sliders,
  Download
} from 'lucide-react';
import { StaffUser, ClassSession, Device } from '../types';

interface HeaderProps {
  currentUser: StaffUser;
  activeSession: ClassSession | null;
  isSessionActive: boolean;
  onToggleSession: () => void;
  activeDevice: Device | null;
  onOpenSimulator: () => void;
  onOpenLoginModal: () => void;
  onSwitchUser: (user: StaffUser) => void;
  allStaff: StaffUser[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeSession,
  isSessionActive,
  onToggleSession,
  activeDevice,
  onOpenSimulator,
  onOpenLoginModal,
  onSwitchUser,
  allStaff
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <ScanFace className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  AI Smart Attendance
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  ESP32 • RFID
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dual-Factor Biometric & IoT Attendance Gateway
              </p>
            </div>
          </div>

          {/* Center Status Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Live Session Toggle */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                id="btn-toggle-session"
                onClick={onToggleSession}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSessionActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSessionActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>Session: {isSessionActive ? 'LIVE' : 'STANDBY'}</span>
              </button>
              {activeSession && (
                <span className="text-[11px] text-slate-400 px-3 truncate max-w-[200px]" title={activeSession.subjectName}>
                  {activeSession.subjectCode} • {activeSession.classroomName}
                </span>
              )}
            </div>

            {/* ESP32 Hardware Status */}
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">
                {activeDevice?.id || 'ESP32_01'}:
              </span>
              <span className="flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{activeDevice?.connectionStatus || 'ONLINE'}</span>
              </span>
            </div>
          </div>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center space-x-2.5">
            {/* Download Full-Stack ZIP */}
            <a
              id="btn-download-fullstack-zip"
              href="/api/download-zip"
              download="ai-smart-attendance-fullstack.zip"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all shadow-xs"
              title="Download Complete Full-Stack Project ZIP (Frontend + Backend)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download ZIP</span>
            </a>

            {/* Quick Scenario Simulator */}
            <button
              id="btn-quick-simulator"
              onClick={onOpenSimulator}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl transition-all shadow-xs"
              title="Test Dual-Factor Scenarios"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulate Scenarios</span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-white" />
                  ) : currentUser.role === 'faculty' ? (
                    <Briefcase className="w-4 h-4 text-white" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-indigo-300 capitalize font-medium mt-0.5">
                    {currentUser.role} • {currentUser.uidNum}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400">{currentUser.designation}</p>
                    <p className="text-[10px] text-indigo-400 font-mono mt-0.5">{currentUser.uidNum}</p>
                  </div>

                  {/* Switch Role / Quick Accounts */}
                  <div className="px-2 py-2">
                    <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Quick Switch Persona
                    </p>
                    {allStaff.slice(0, 3).map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          onSwitchUser(st);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          currentUser.id === st.id ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="truncate">{st.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{st.role}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 px-2 pt-2 space-y-1">
                    <a
                      href="/api/download-zip"
                      download="ai-smart-attendance-fullstack.zip"
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Full-Stack ZIP</span>
                    </a>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenLoginModal();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-indigo-300 hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Switch Account / Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
