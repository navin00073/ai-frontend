import React from 'react';
import {
  LayoutDashboard,
  Video,
  History,
  BarChart3,
  Users,
  UserPlus,
  ScanFace,
  CreditCard,
  Calendar,
  BookOpen,
  ShieldCheck,
  Cpu,
  Settings,
  GraduationCap
} from 'lucide-react';
import { Role } from '../types';

export type TabType =
  | 'dashboard'
  | 'live-camera'
  | 'history'
  | 'reports'
  | 'students'
  | 'add-student'
  | 'face-registration'
  | 'nfc-registration'
  | 'sessions'
  | 'subjects'
  | 'staff-directory'
  | 'esp32'
  | 'settings'
  | 'student-portal';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: Role;
  liveCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  liveCount
}) => {
  // If role is student, show personalized navigation
  if (userRole === 'student') {
    return (
      <aside id="app-sidebar-student" className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-800">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Student Portal</p>
          <p className="text-sm font-semibold text-white mt-0.5">My Attendance</p>
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <button
            id="nav-student-portal"
            onClick={() => onSelectTab('student-portal')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'student-portal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Attendance Overview</span>
          </button>
          <button
            id="nav-student-history"
            onClick={() => onSelectTab('history')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>My Class History</span>
          </button>
        </nav>
      </aside>
    );
  }

  const operationsItems = [
    { id: 'dashboard' as TabType, label: 'Admin Dashboard', icon: LayoutDashboard },
    {
      id: 'live-camera' as TabType,
      label: 'Live Attendance',
      icon: Video,
      badge: liveCount > 0 ? `${liveCount} Live` : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    { id: 'history' as TabType, label: 'Attendance History', icon: History },
    { id: 'reports' as TabType, label: 'Reports & Analytics', icon: BarChart3 }
  ];

  const studentBiometricItems = [
    { id: 'students' as TabType, label: 'Students Directory', icon: Users },
    { id: 'add-student' as TabType, label: 'Add Student', icon: UserPlus },
    { id: 'face-registration' as TabType, label: 'Face Registration', icon: ScanFace },
    { id: 'nfc-registration' as TabType, label: 'NFC Card Pairing', icon: CreditCard }
  ];

  const adminIotItems = [
    { id: 'sessions' as TabType, label: 'Class Sessions', icon: Calendar },
    { id: 'subjects' as TabType, label: 'Course Subjects', icon: BookOpen },
    { id: 'staff-directory' as TabType, label: 'Staff & Admin UID Roster', icon: ShieldCheck },
    { id: 'esp32' as TabType, label: 'ESP32 NFC Hardware', icon: Cpu },
    { id: 'settings' as TabType, label: 'System Settings', icon: Settings }
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
      <div className="flex-1 p-3 space-y-6 overflow-y-auto">
        
        {/* Operations */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Operations & Live Feeds
          </p>
          <div className="space-y-1">
            {operationsItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Biometrics */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Students & Biometrics
          </p>
          <div className="space-y-1">
            {studentBiometricItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Administration & IoT */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Administration & IoT
          </p>
          <div className="space-y-1">
            {adminIotItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Dual-Factor v2.4</span>
        <span className="text-emerald-400 font-mono">100% Synced</span>
      </div>
    </aside>
  );
};
