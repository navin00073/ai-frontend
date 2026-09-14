import React, { useState } from 'react';
import {
  CreditCard,
  Radio,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { Student } from '../types';

interface NfcPairingModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  allStudents: Student[];
  onPairComplete: (studentId: string, nfcUid: string) => void;
}

export const NfcPairingModal: React.FC<NfcPairingModalProps> = ({
  student,
  isOpen,
  onClose,
  allStudents,
  onPairComplete
}) => {
  const [nfcUid, setNfcUid] = useState(student.nfcUid || '');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickSamples = [
    '04A1B2C3D4',
    'A1F402B890',
    '9B22C4E510',
    '4C77DF0921',
    '8D19F3A470',
    'E2A0149FB3',
    '66F81B9922'
  ];

  const handleSelectUid = (val: string) => {
    setNfcUid(val);
    const existing = allStudents.find(
      s => s.id !== student.id && s.nfcUid && s.nfcUid.toUpperCase() === val.toUpperCase()
    );
    if (existing) {
      setConflictWarning(`Notice: This NFC card is currently assigned to ${existing.name} (${existing.rollNo}). Reassigning will pair it with ${student.name}.`);
    } else {
      setConflictWarning(null);
    }
  };

  const handleSave = () => {
    if (!nfcUid.trim()) return;
    onPairComplete(student.id, nfcUid.trim().toUpperCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-slate-900 border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Pair RFID / NFC Badge</h2>
              <p className="text-xs text-slate-500">ISO 14443A High-Frequency Smart Card</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Info Card */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center space-x-3.5">
            <img
              src={student.profilePhoto}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{student.name}</h3>
              <p className="text-xs font-mono text-indigo-600 font-semibold">{student.rollNo} • Sec {student.section}</p>
              <p className="text-[11px] text-slate-500">{student.branch}</p>
            </div>
          </div>

          {/* Scanner Simulation Wave */}
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-5 rounded-2xl text-white text-center space-y-2 relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto ring-4 ring-cyan-500/10 animate-pulse">
              <Radio className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-200">Tap Card Against ESP32 Reader</p>
            <p className="text-[11px] text-slate-400">or enter hexadecimal serial UID below</p>
          </div>

          {/* UID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              NFC Serial UID (Hex)
            </label>
            <input
              type="text"
              value={nfcUid}
              onChange={e => handleSelectUid(e.target.value)}
              placeholder="e.g. 04A1B2C3D4"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {conflictWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px]">{conflictWarning}</p>
            </div>
          )}

          {/* Preset quick test cards */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Quick Card Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickSamples.map(sample => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSelectUid(sample)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-colors ${
                    nfcUid === sample ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!nfcUid.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            Pair NFC Card
          </button>
        </div>

      </div>
    </div>
  );
};
