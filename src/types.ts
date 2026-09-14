export type Role = 'admin' | 'faculty' | 'student';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  registerNo: string;
  branch: string;
  degree: string;
  yearOfStudy: number;
  section: string;
  nfcUid: string;
  faceId: string;
  faceEmbedding?: number[];
  email: string;
  phone: string;
  profilePhoto: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  faceSamplesCount: number;
  registeredAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'DUPLICATE';

export interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  registerNo: string;
  branch: string;
  degree: string;
  yearOfStudy: number;
  section: string;
  subject: string;
  faculty: string;
  classroom: string;
  nfcUid: string;
  faceConfidence: number;
  entryTime: string;
  status: AttendanceStatus;
  verificationMethod: string;
  deviceId: string;
  sessionId: string;
  livenessScore: number;
}

export interface ClassSession {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyId: string;
  facultyName: string;
  classroomId: string;
  classroomName: string;
  date: string;
  startTime: string;
  closingTime: string;
  lateThreshold: string;
  academicYear: string;
  semester: string;
  isActive: boolean;
}

export interface Device {
  id: string;
  name: string;
  classroomId: string;
  classroomName: string;
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  wifiStatus: 'CONNECTED' | 'DISCONNECTED';
  wifiSsid: string;
  ipAddress: string;
  macAddress: string;
  lastCommunication: string;
  nfcReaderStatus: 'READY' | 'BUSY' | 'ERROR';
  lastDetectedUid: string;
  apiStatus: string;
  apiKey: string;
  firmwareVersion: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  branch: string;
  semester: string;
  credits: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: string;
  message: string;
}

export interface StaffUser {
  id: string;
  uidNum: string;
  username: string;
  name: string;
  role: Role;
  designation: string;
  department: string;
  staffId: string;
  email: string;
  phone: string;
  lastLogin: string;
  studentId?: string;
}

export interface SystemSettings {
  faceConfidenceThreshold: number;
  livenessDetectionStrictness: 'Standard' | 'High' | 'Strict';
  lateGracePeriodMinutes: number;
  duplicateCooldownSeconds: number;
  audioChimeEnabled: boolean;
  speechAnnounceEnabled: boolean;
  offlineBufferMode: boolean;
  webhookUrl: string;
}

export interface VerificationBannerState {
  type: 'SUCCESS' | 'LATE' | 'DUPLICATE' | 'FAILED' | 'VERIFYING';
  title: string;
  message: string;
  studentName?: string;
  rollNo?: string;
}

export interface DetectedFace {
  id: string;
  box: { x: number; y: number; width: number; height: number };
  confidence: number;
  embedding: number[];
  liveness: {
    isLive: boolean;
    livenessScore: number;
    blinkDetected: boolean;
    motionDetected: boolean;
    textureScore: number;
  };
  matchedStudent?: {
    id: string;
    name: string;
    rollNo: string;
    branch: string;
    yearOfStudy: number;
    photo: string;
    confidencePercent: number;
  };
}
