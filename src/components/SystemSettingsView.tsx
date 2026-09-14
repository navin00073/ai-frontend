import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Volume2,
  Sliders,
  CheckCircle2,
  Save,
  Globe
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SystemSettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="system-settings-view" className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System & Biometric Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure anti-spoofing parameters, late tolerances, audio feedback, and IoT gateway thresholds
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Biometric configuration saved and dispatched to IoT gateways.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Biometrics Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Facial Recognition & Anti-Spoofing</h2>
              <p className="text-[11px] text-slate-500">Cosine similarity matching and micro-texture motion analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-bold text-slate-700">Face Confidence Threshold</label>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {formData.faceConfidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min={70}
                max={98}
                value={formData.faceConfidenceThreshold}
                onChange={e => setFormData({ ...formData, faceConfidenceThreshold: Number(e.target.value) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum vector similarity score required to grant dual-factor access (Recommended: 85%).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Liveness Strictness Mode</label>
              <select
                value={formData.livenessDetectionStrictness}
                onChange={e => setFormData({ ...formData, livenessDetectionStrictness: e.target.value as 'Standard' | 'High' | 'Strict' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Standard">Standard (Motion Tracking + Texture Variance)</option>
                <option value="High">High (Strict Micro-Tremor + Eye Aspect Ratio)</option>
                <option value="Strict">Strict (Active Eye Blink + Passive Depth)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Policy Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Attendance & Punctuality Policy</h2>
              <p className="text-[11px] text-slate-500">Rules governing late arrival thresholds and multi-scan debounce</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Late Grace Period (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={formData.lateGracePeriodMinutes}
                onChange={e => setFormData({ ...formData, lateGracePeriodMinutes: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Class start time + grace period before attendance is automatically flagged as LATE.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Duplicate Scan Cooldown (Seconds)
              </label>
              <input
                type="number"
                min={10}
                max={600}
                value={formData.duplicateCooldownSeconds}
                onChange={e => setFormData({ ...formData, duplicateCooldownSeconds: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ignores rapid repeated card taps for the same student within active session.
              </p>
            </div>
          </div>
        </div>

        {/* Audio & Webhook Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Audio Feedback & Notifications</h2>
              <p className="text-[11px] text-slate-500">Acoustic chimes and text-to-speech feedback at the doorway kiosk</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.audioChimeEnabled}
                onChange={e => setFormData({ ...formData, audioChimeEnabled: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-700">Synthesizer Chime on Dual-Factor Verification</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.speechAnnounceEnabled}
                onChange={e => setFormData({ ...formData, speechAnnounceEnabled: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-700">Text-to-Speech Voice Announcement ("Student Name, Verified")</span>
            </label>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                External Campus Webhook URL
              </label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://api.campus.edu/v1/attendance/events"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
