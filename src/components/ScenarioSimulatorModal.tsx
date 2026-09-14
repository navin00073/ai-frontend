import React from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  Play
} from 'lucide-react';
import { Student, AttendanceRecord, ClassSession } from '../types';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  activeSession: ClassSession | null;
  isSessionActive: boolean;
  onRunScenario: (scenarioType: 'valid_on_time' | 'late' | 'duplicate' | 'mismatch' | 'unknown_tag' | 'session_standby') => void;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  students,
  attendanceRecords,
  activeSession,
  isSessionActive,
  onRunScenario
}) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'valid_on_time' as const,
      title: '1. Valid Dual-Factor (On-Time Entry)',
      description: 'Aarav Sharma presents enrolled card [04A1B2C3D4]. Face matched with 98.6% confidence and verified live motion. Marked PRESENT.',
      icon: CheckCircle2,
      badge: 'Success Flow',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'late' as const,
      title: '2. Late Arrival Check-In',
      description: 'Karthik Raja presents card after the 09:10 AM late threshold. System verifies biometrics but records attendance as LATE.',
      icon: Clock,
      badge: 'Late Policy',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'duplicate' as const,
      title: '3. Duplicate Tap Prevention',
      description: 'Student taps NFC card again in the same class session. Gateway intercepts duplicate and blocks multi-scan fraud (HTTP 409).',
      icon: AlertTriangle,
      badge: 'Anti-Fraud',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'mismatch' as const,
      title: '4. Biometric Identity Mismatch',
      description: 'Camera detects Student A, but card belongs to Student B. Dual-factor correlation fails and security log flags violation.',
      icon: AlertCircle,
      badge: 'Security Rejection',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'unknown_tag' as const,
      title: '5. Unregistered / Rogue RFID Card',
      description: 'Unknown card [FF99AABB11] tapped at ESP32 reader. System halts verification as card is not in campus database.',
      icon: ShieldAlert,
      badge: 'Unenrolled',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'session_standby' as const,
      title: '6. Standby Session Warning',
      description: 'Sensor attempt when class session is toggled to STANDBY. Kiosk instructs staff to turn session LIVE before verification.',
      icon: AlertTriangle,
      badge: 'Operational Warning',
      badgeColor: 'bg-amber-100 text-amber-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-900 border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Attendance Scenario Simulator</h2>
              <p className="text-xs text-slate-500">Test live dual-factor edge cases and validation rules in one click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-5 space-y-3 max-h-[480px] overflow-y-auto">
          {scenarios.map(sc => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-bold text-slate-900">{sc.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.badgeColor}`}>
                        {sc.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {sc.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRunScenario(sc.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Active Session: <strong className="text-slate-800">{activeSession?.subjectName}</strong> ({isSessionActive ? 'LIVE' : 'STANDBY'})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
