import React, { useState, useEffect } from 'react';
import {
  Student,
  AttendanceRecord,
  ClassSession,
  Device,
  Subject,
  StaffUser,
  ActivityLog,
  SystemSettings
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_SESSIONS,
  INITIAL_DEVICES,
  INITIAL_SUBJECTS,
  INITIAL_STAFF,
  INITIAL_ACTIVITY_LOGS,
  DEFAULT_SETTINGS
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LiveAttendanceView } from './components/LiveAttendanceView';
import { StudentsView } from './components/StudentsView';
import { AddStudentView } from './components/AddStudentView';
import { AttendanceHistoryView } from './components/AttendanceHistoryView';
import { ReportsView } from './components/ReportsView';
import { ClassSessionsView } from './components/ClassSessionsView';
import { CourseSubjectsView } from './components/CourseSubjectsView';
import { StaffDirectoryView } from './components/StaffDirectoryView';
import { Esp32HardwareView } from './components/Esp32HardwareView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { StudentPortalView } from './components/StudentPortalView';
import { FaceEnrollmentModal } from './components/FaceEnrollmentModal';
import { NfcPairingModal } from './components/NfcPairingModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import { LoginModal } from './components/LoginModal';
import { CsvExportModal } from './components/CsvExportModal';
import { playAttendanceSound, speechAnnounce } from './services/BiometricEngine';

export default function App() {
  // Navigation & User
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<StaffUser>(INITIAL_STAFF[0]);

  // Core Data
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [sessions, setSessions] = useState<ClassSession[]>(INITIAL_SESSIONS);
  const [activeSession, setActiveSession] = useState<ClassSession | null>(INITIAL_SESSIONS[0]);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  // Hardware State
  const [cameraConnected, setCameraConnected] = useState(true);
  const [esp32Online, setEsp32Online] = useState(true);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForFace, setSelectedStudentForFace] = useState<Student | null>(null);
  const [selectedStudentForNfc, setSelectedStudentForNfc] = useState<Student | null>(null);

  // Fetch initial data from Express backend if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studRes, attRes, sessRes, devRes, staffRes, logRes] = await Promise.allSettled([
          fetch('/api/students').then(r => r.json()),
          fetch('/api/attendance').then(r => r.json()),
          fetch('/api/sessions').then(r => r.json()),
          fetch('/api/devices').then(r => r.json()),
          fetch('/api/staff').then(r => r.json()),
          fetch('/api/activity-logs').then(r => r.json())
        ]);

        if (studRes.status === 'fulfilled' && studRes.value?.data) {
          setStudents(studRes.value.data);
        }
        if (attRes.status === 'fulfilled' && attRes.value?.data) {
          setAttendanceRecords(attRes.value.data);
        }
        if (sessRes.status === 'fulfilled' && sessRes.value?.data) {
          setSessions(sessRes.value.data);
          const active = sessRes.value.data.find((s: ClassSession) => s.isActive);
          if (active) {
            setActiveSession(active);
            setIsSessionActive(true);
          }
        }
        if (devRes.status === 'fulfilled' && devRes.value?.data) {
          setDevices(devRes.value.data);
        }
        if (staffRes.status === 'fulfilled' && staffRes.value?.data) {
          setStaff(staffRes.value.data);
        }
        if (logRes.status === 'fulfilled' && logRes.value?.data) {
          setActivityLogs(logRes.value.data);
        }
      } catch (err) {
        console.warn("Backend API sync fallback to local state:", err);
      }
    };
    fetchData();
  }, []);

  // Toggle Session Active State
  const handleToggleSession = async () => {
    const nextState = !isSessionActive;
    setIsSessionActive(nextState);

    if (activeSession) {
      const updated = { ...activeSession, isActive: nextState };
      setActiveSession(updated);
      setSessions(sessions.map(s => (s.id === updated.id ? updated : s)));

      // Call API
      try {
        await fetch(`/api/sessions/${activeSession.id}/toggle`, { method: 'PUT' });
      } catch {
        // local state fallback
      }
    }

    const timeStr = new Date().toTimeString().split(' ')[0];
    const log: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: timeStr,
      type: 'SESSION_TOGGLE',
      message: `Session "${activeSession?.subjectName}" toggled to ${nextState ? 'LIVE' : 'STANDBY'}.`
    };
    setActivityLogs([log, ...activityLogs]);
  };

  // When attendance is marked from Live Attendance View
  const handleAttendanceMarked = (newRecord: AttendanceRecord) => {
    setAttendanceRecords([newRecord, ...attendanceRecords]);

    const timeStr = new Date().toTimeString().split(' ')[0];
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: timeStr,
      type: 'ATTENDANCE_VERIFIED',
      message: `${newRecord.studentName} (${newRecord.rollNo}) verified via ${newRecord.verificationMethod} with status ${newRecord.status}.`
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  const handleVerificationFailed = (msg: string) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      timestamp: timeStr,
      type: 'SECURITY_ALERT',
      message: msg
    };
    setActivityLogs([newLog, ...activityLogs]);
  };

  // Run scenario from Simulator
  const handleRunScenario = async (scenarioType: 'valid_on_time' | 'late' | 'duplicate' | 'mismatch' | 'unknown_tag' | 'session_standby') => {
    setCurrentTab('live-camera');

    if (scenarioType === 'session_standby') {
      setIsSessionActive(false);
      return;
    }

    // Ensure session is live for other scenarios
    if (!isSessionActive) {
      setIsSessionActive(true);
    }

    if (scenarioType === 'valid_on_time') {
      const stud = students[0]; // Aarav Sharma
      try {
        const res = await fetch('/api/attendance/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nfc_uid: stud.nfcUid,
            matched_student_id: stud.id,
            face_confidence: 98.6,
            liveness_score: 0.95
          })
        });
        const data = await res.json();
        if (data.attendance) {
          handleAttendanceMarked(data.attendance);
          playAttendanceSound('success');
          speechAnnounce(`${stud.name}, verified.`);
        }
      } catch {
        // local
      }
    } else if (scenarioType === 'late') {
      const stud = students[4]; // Karthik Raja
      const now = new Date().toTimeString().split(' ')[0];
      const lateRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: now,
        studentId: stud.id,
        studentName: stud.name,
        rollNo: stud.rollNo,
        registerNo: stud.registerNo,
        branch: stud.branch,
        degree: stud.degree,
        yearOfStudy: stud.yearOfStudy,
        section: stud.section,
        subject: activeSession?.subjectName || 'Computer Vision & Deep Learning',
        faculty: activeSession?.facultyName || 'Prof. Marcus Brody',
        classroom: activeSession?.classroomName || 'Smart Classroom 402',
        nfcUid: stud.nfcUid,
        faceConfidence: 96.2,
        entryTime: now,
        status: 'LATE',
        verificationMethod: 'NFC + Face Recognition',
        deviceId: 'ESP32_CLASSROOM_01',
        sessionId: activeSession?.id || 'sess_1',
        livenessScore: 0.93
      };
      handleAttendanceMarked(lateRecord);
      playAttendanceSound('late');
      speechAnnounce(`${stud.name}, marked late.`);
    } else if (scenarioType === 'duplicate') {
      playAttendanceSound('duplicate');
      speechAnnounce('Duplicate attendance ignored.');
      handleVerificationFailed('Duplicate tap prevented: Aarav Sharma was already marked in this session.');
    } else if (scenarioType === 'mismatch') {
      playAttendanceSound('error');
      handleVerificationFailed('Identity Mismatch: Card [66F81B9922] presented by Priya Narayanan belongs to Devadathan Nair!');
    } else if (scenarioType === 'unknown_tag') {
      playAttendanceSound('error');
      handleVerificationFailed('Rogue Card Detected: Unregistered NFC UID [FF99AABB11] rejected at doorway gateway.');
    }
  };

  // Add Student Handler
  const handleSaveStudent = async (studentData: Partial<Student>, proceedToFace: boolean) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await res.json();
      const saved = data.data || { ...studentData, id: `stud_${Date.now()}` };
      setStudents([saved, ...students]);

      if (proceedToFace) {
        setSelectedStudentForFace(saved);
      } else {
        setCurrentTab('students');
      }
    } catch {
      const saved: Student = {
        id: `stud_${Date.now()}`,
        name: studentData.name || 'New Student',
        rollNo: studentData.rollNo || '23CS150',
        registerNo: studentData.registerNo || '310623104150',
        branch: studentData.branch || 'Computer Science & Engineering',
        degree: studentData.degree || 'B.Tech',
        yearOfStudy: studentData.yearOfStudy || 3,
        section: studentData.section || 'A',
        nfcUid: studentData.nfcUid || '',
        faceId: `FACE_EMB_${studentData.rollNo}`,
        email: studentData.email || '',
        phone: studentData.phone || '',
        profilePhoto: studentData.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        status: 'Active',
        faceSamplesCount: 4,
        registeredAt: new Date().toISOString().split('T')[0]
      };
      setStudents([saved, ...students]);
      if (proceedToFace) {
        setSelectedStudentForFace(saved);
      } else {
        setCurrentTab('students');
      }
    }
  };

  // Face Enrollment Finish
  const handleEnrollFaceComplete = (studentId: string, embedding: number[]) => {
    setStudents(
      students.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            faceSamplesCount: 4,
            faceEmbedding: embedding,
            faceId: `FACE_EMB_${s.rollNo}`
          };
        }
        return s;
      })
    );
    const s = students.find(st => st.id === studentId);
    if (s) {
      const timeStr = new Date().toTimeString().split(' ')[0];
      const log: ActivityLog = {
        id: `log_${Date.now()}`,
        timestamp: timeStr,
        type: 'ENROLLMENT',
        message: `4/4 facial biometric angle vectors enrolled for ${s.name} (${s.rollNo}).`
      };
      setActivityLogs([log, ...activityLogs]);
    }
  };

  // NFC Pairing Finish
  const handlePairNfcComplete = (studentId: string, nfcUid: string) => {
    setStudents(
      students.map(s => {
        if (s.id === studentId) {
          return { ...s, nfcUid };
        }
        return s;
      })
    );
    const s = students.find(st => st.id === studentId);
    if (s) {
      const timeStr = new Date().toTimeString().split(' ')[0];
      const log: ActivityLog = {
        id: `log_${Date.now()}`,
        timestamp: timeStr,
        type: 'ENROLLMENT',
        message: `ISO 14443A NFC card [${nfcUid}] paired to ${s.name} (${s.rollNo}).`
      };
      setActivityLogs([log, ...activityLogs]);
    }
  };

  // Delete Student
  const handleDeleteStudent = async (studentId: string) => {
    const s = students.find(st => st.id === studentId);
    setStudents(students.filter(st => st.id !== studentId));
    try {
      await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
    } catch {
      // local
    }
    if (s) {
      const timeStr = new Date().toTimeString().split(' ')[0];
      const log: ActivityLog = {
        id: `log_${Date.now()}`,
        timestamp: timeStr,
        type: 'ENROLLMENT',
        message: `Student ${s.name} (${s.rollNo}) record removed from roster.`
      };
      setActivityLogs([log, ...activityLogs]);
    }
  };

  // Today's live count
  const today = new Date().toISOString().split('T')[0];
  const liveTodayCount = attendanceRecords.filter(r => r.date === today).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        activeSession={activeSession}
        isSessionActive={isSessionActive}
        onToggleSession={handleToggleSession}
        activeDevice={devices[0] || null}
        onOpenSimulator={() => setIsSimulatorModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onSwitchUser={user => {
          setCurrentUser(user);
          if (user.role === 'student') {
            setCurrentTab('student-portal');
          } else {
            setCurrentTab('dashboard');
          }
        }}
        allStaff={staff}
      />

      {/* Main Body Shell (Sidebar + Content Stage) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={currentUser.role}
          liveCount={liveTodayCount}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            
            {/* View Switching */}
            {currentTab === 'dashboard' && (
              <DashboardView
                students={students}
                attendanceRecords={attendanceRecords}
                activeSession={activeSession}
                activeDevice={devices[0] || null}
                cameraConnected={cameraConnected}
                esp32Online={esp32Online}
                activityLogs={activityLogs}
                isSessionActive={isSessionActive}
                onOpenSessionModal={() => setCurrentTab('sessions')}
                onNavigateToTab={setCurrentTab}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
              />
            )}

            {currentTab === 'live-camera' && (
              <LiveAttendanceView
                students={students}
                attendanceRecords={attendanceRecords}
                activeSession={activeSession}
                activeDevice={devices[0] || null}
                activityLogs={activityLogs}
                isSessionActive={isSessionActive}
                onToggleSession={handleToggleSession}
                onAttendanceMarked={handleAttendanceMarked}
                onVerificationFailed={handleVerificationFailed}
                onCameraStateChange={setCameraConnected}
              />
            )}

            {currentTab === 'students' && (
              <StudentsView
                students={students}
                onSelectStudent={setSelectedStudentForProfile}
                onEnrollFace={setSelectedStudentForFace}
                onPairNfc={setSelectedStudentForNfc}
                onDeleteStudent={handleDeleteStudent}
                onNavigateToAddStudent={() => setCurrentTab('add-student')}
              />
            )}

            {currentTab === 'add-student' && (
              <AddStudentView
                onSaveStudent={handleSaveStudent}
                onCancel={() => setCurrentTab('students')}
              />
            )}

            {currentTab === 'face-registration' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h1 className="text-xl font-bold text-slate-900">Direct Face Registration Wizard</h1>
                <p className="text-xs text-slate-500">Select an enrolled student to update their 4-angle facial signature:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {students.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStudentForFace(st)}
                      className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-2xl border border-slate-200 flex items-center space-x-3 text-left transition-colors"
                    >
                      <img src={st.profilePhoto} alt={st.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{st.name}</p>
                        <p className="text-[11px] font-mono text-indigo-600">{st.rollNo}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'nfc-registration' && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h1 className="text-xl font-bold text-slate-900">Direct NFC Badge Pairing Gateway</h1>
                <p className="text-xs text-slate-500">Select an enrolled student to link an ISO 14443A RFID card UID:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {students.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStudentForNfc(st)}
                      className="p-3 bg-slate-50 hover:bg-cyan-50 rounded-2xl border border-slate-200 flex items-center space-x-3 text-left transition-colors"
                    >
                      <img src={st.profilePhoto} alt={st.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{st.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">NFC: {st.nfcUid || 'Unpaired'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'history' && (
              <AttendanceHistoryView
                attendanceRecords={attendanceRecords}
                students={students}
                subjects={subjects}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                students={students}
                attendanceRecords={attendanceRecords}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
              />
            )}

            {currentTab === 'sessions' && (
              <ClassSessionsView
                sessions={sessions}
                subjects={subjects}
                staff={staff}
                onToggleSession={handleToggleSession}
                onCreateSession={newSess => {
                  const s: ClassSession = {
                    id: `sess_${Date.now()}`,
                    subjectId: newSess.subjectId || 'sub_1',
                    subjectName: newSess.subjectName || 'Course',
                    subjectCode: newSess.subjectCode || 'CS501',
                    facultyId: 'fac_1',
                    facultyName: newSess.facultyName || 'Faculty',
                    classroomId: 'cr_101',
                    classroomName: newSess.classroomName || 'Room 402',
                    date: newSess.date || new Date().toISOString().split('T')[0],
                    startTime: newSess.startTime || '09:00',
                    closingTime: newSess.closingTime || '10:00',
                    lateThreshold: newSess.lateThreshold || '09:10',
                    academicYear: newSess.academicYear || '2026-2027',
                    semester: newSess.semester || 'Semester 5',
                    isActive: newSess.isActive || false
                  };
                  if (s.isActive) {
                    sessions.forEach(sess => sess.isActive = false);
                    setActiveSession(s);
                    setIsSessionActive(true);
                  }
                  setSessions([s, ...sessions]);
                }}
              />
            )}

            {currentTab === 'subjects' && (
              <CourseSubjectsView subjects={subjects} />
            )}

            {currentTab === 'staff-directory' && (
              <StaffDirectoryView
                staff={staff}
                onAddStaff={newSt => {
                  const created: StaffUser = {
                    id: `usr_${Date.now()}`,
                    uidNum: newSt.uidNum || `UID-STF-${Math.floor(2000 + Math.random() * 800)}`,
                    username: (newSt.name || '').toLowerCase().replace(/\s+/g, '.'),
                    name: newSt.name || 'Staff Member',
                    role: newSt.role || 'faculty',
                    designation: newSt.designation || 'Faculty Member',
                    department: newSt.department || 'Computer Science & Engineering',
                    staffId: newSt.staffId || `STF-FAC-${Math.floor(10 + Math.random() * 80)}`,
                    email: newSt.email || '',
                    phone: newSt.phone || '+91 98400 00000',
                    lastLogin: new Date().toISOString()
                  };
                  setStaff([...staff, created]);
                }}
              />
            )}

            {currentTab === 'esp32' && (
              <Esp32HardwareView
                devices={devices}
                students={students}
                onTriggerNfcTap={(st, uid) => {
                  setCurrentTab('live-camera');
                  const now = new Date().toTimeString().split(' ')[0];
                  const newRec: AttendanceRecord = {
                    id: `att_${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    time: now,
                    studentId: st.id,
                    studentName: st.name,
                    rollNo: st.rollNo,
                    registerNo: st.registerNo,
                    branch: st.branch,
                    degree: st.degree,
                    yearOfStudy: st.yearOfStudy,
                    section: st.section,
                    subject: activeSession?.subjectName || 'Computer Vision',
                    faculty: activeSession?.facultyName || 'Prof. Marcus Brody',
                    classroom: activeSession?.classroomName || 'Room 402',
                    nfcUid: uid,
                    faceConfidence: 98.4,
                    entryTime: now,
                    status: 'PRESENT',
                    verificationMethod: 'NFC + Face Recognition',
                    deviceId: 'ESP32_CLASSROOM_01',
                    sessionId: activeSession?.id || 'sess_1',
                    livenessScore: 0.95
                  };
                  handleAttendanceMarked(newRec);
                  playAttendanceSound('success');
                  speechAnnounce(`${st.name}, verified.`);
                }}
              />
            )}

            {currentTab === 'settings' && (
              <SystemSettingsView
                settings={settings}
                onSaveSettings={setSettings}
              />
            )}

            {currentTab === 'student-portal' && (
              <StudentPortalView
                currentUser={currentUser}
                students={students}
                attendanceRecords={attendanceRecords}
              />
            )}

          </div>
        </main>
      </div>

      {/* Modals */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          isOpen={true}
          onClose={() => setSelectedStudentForProfile(null)}
          attendanceRecords={attendanceRecords}
        />
      )}

      {selectedStudentForFace && (
        <FaceEnrollmentModal
          student={selectedStudentForFace}
          isOpen={true}
          onClose={() => setSelectedStudentForFace(null)}
          onEnrollmentComplete={handleEnrollFaceComplete}
        />
      )}

      {selectedStudentForNfc && (
        <NfcPairingModal
          student={selectedStudentForNfc}
          isOpen={true}
          onClose={() => setSelectedStudentForNfc(null)}
          allStudents={students}
          onPairComplete={handlePairNfcComplete}
        />
      )}

      <ScenarioSimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        students={students}
        attendanceRecords={attendanceRecords}
        activeSession={activeSession}
        isSessionActive={isSessionActive}
        onRunScenario={handleRunScenario}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={user => {
          setCurrentUser(user);
          if (user.role === 'student') {
            setCurrentTab('student-portal');
          } else {
            setCurrentTab('dashboard');
          }
        }}
        allStaff={staff}
      />

      <CsvExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        attendanceRecords={attendanceRecords}
        students={students}
      />

    </div>
  );
}
