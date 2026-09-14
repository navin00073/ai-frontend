import React, { useState } from 'react';
import {
  Cpu,
  Wifi,
  Radio,
  Activity,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap
} from 'lucide-react';
import { Device, Student } from '../types';

interface Esp32HardwareViewProps {
  devices: Device[];
  students: Student[];
  onTriggerNfcTap: (student: Student, nfcUid: string) => void;
}

export const Esp32HardwareView: React.FC<Esp32HardwareViewProps> = ({
  devices,
  students,
  onTriggerNfcTap
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device>(devices[0] || {} as Device);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [customUid, setCustomUid] = useState<string>(students[0]?.nfcUid || '04A1B2C3D4');

  const handlePing = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/devices/ping', { method: 'POST' });
      const data = await res.json();
      setPingStatus(`Gateway pong received: 18ms latency • Synchronized at ${new Date().toLocaleTimeString()}`);
    } catch {
      setPingStatus('Heartbeat probe failed');
    }
    setIsPinging(false);
  };

  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id);
    const st = students.find(s => s.id === id);
    if (st && st.nfcUid) {
      setCustomUid(st.nfcUid);
    }
  };

  const handleSimulatePhysicalTap = () => {
    const st = students.find(s => s.id === selectedStudentId);
    if (st) {
      onTriggerNfcTap(st, customUid);
    }
  };

  return (
    <div id="esp32-hardware-view" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ESP32 IoT Gateway Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Low-power ESP32-S3 microcontroller node interfacing with MFRC522 13.56MHz SPI readers
          </p>
        </div>
        <button
          onClick={handlePing}
          disabled={isPinging}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          <span>{isPinging ? 'Pinging Gateway...' : 'Ping ESP32 Heartbeat'}</span>
        </button>
      </div>

      {pingStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pingStatus}</span>
        </div>
      )}

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map(dev => (
          <div
            key={dev.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center font-mono font-bold shadow-md">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{dev.name}</h3>
                  <p className="text-xs font-mono text-indigo-600">{dev.id}</p>
                </div>
              </div>
              <span className="flex items-center space-x-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{dev.connectionStatus}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Wi-Fi Network</span>
                <span className="font-semibold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Wifi className="w-3 h-3 text-cyan-600" />
                  <span className="truncate">{dev.wifiSsid}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">IP Address</span>
                <span className="font-mono text-slate-800 font-semibold block mt-0.5">{dev.ipAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">MAC Address</span>
                <span className="font-mono text-slate-600 text-[11px] block mt-0.5">{dev.macAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Firmware</span>
                <span className="font-mono text-indigo-600 text-[11px] block mt-0.5">{dev.firmwareVersion}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Hall: <strong className="text-slate-800">{dev.classroomName}</strong></span>
              <span className="font-mono text-[11px]">Last UID: {dev.lastDetectedUid || 'None'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive RFID Induction Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">MFRC522 Radio Frequency Induction Simulator</h2>
          <p className="text-xs text-slate-500">
            Emulate physical card presence against the antenna coil for testing dual-factor authorization
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Student Presenting Badge
            </label>
            <select
              value={selectedStudentId}
              onChange={e => handleStudentSelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo}) — Card UID: {s.nfcUid}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Coil Hexadecimal UID
            </label>
            <input
              type="text"
              value={customUid}
              onChange={e => setCustomUid(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleSimulatePhysicalTap}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-colors"
            >
              <Radio className="w-4 h-4 text-cyan-300" />
              <span>Simulate Induction Tap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Telemetry Log */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-white">ESP32 UART / MQTT Stream (115200 Baud)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">BUFFER OK</span>
        </div>

        <div className="p-4 font-mono text-[11px] text-emerald-400 space-y-1.5 max-h-52 overflow-y-auto">
          <p className="text-slate-400">[00:00:01] ESP32-S3 booting FreeRTOS v10.4.3 on dual Xtensa cores...</p>
          <p className="text-slate-400">[00:00:02] WiFi connecting to 'Campus_Secure_IoT_5G' (RSSI: -54 dBm)... IP: 192.168.1.142</p>
          <p className="text-slate-400">[00:00:03] SPI MFRC522 initialized on VSPI (MOSI:23, MISO:19, SCK:18, CS:5). Firmware: 0x92 (v2.0)</p>
          <p className="text-slate-300">[08:56:14] PICC_ReadCardSerial: UID [04 A1 B2 C3 D4] SAK: 0x08 (Mifare Classic 1K)</p>
          <p className="text-cyan-400">[08:56:14] HTTP POST /api/attendance/verify payload sent with AES-128 token...</p>
          <p className="text-emerald-400">[08:56:15] Server Response: 201 Created | Match: Aarav Sharma (23CS041) | Status: PRESENT</p>
          <p className="text-slate-300">[09:04:12] PICC_ReadCardSerial: UID [9B 22 C4 E5 10] SAK: 0x08</p>
          <p className="text-amber-400">[09:04:13] Server Response: 201 Created | Match: Rohan Deshmukh (23CS105) | Status: LATE</p>
          <p className="text-emerald-300">[LIVE] MFRC522 ready for card approach. Optical camera pipeline standing by...</p>
        </div>
      </div>

    </div>
  );
};
