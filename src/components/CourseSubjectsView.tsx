import React from 'react';
import { BookOpen, GraduationCap, Award, BookMarked } from 'lucide-react';
import { Subject } from '../types';

interface CourseSubjectsViewProps {
  subjects: Subject[];
}

export const CourseSubjectsView: React.FC<CourseSubjectsViewProps> = ({ subjects }) => {
  return (
    <div id="course-subjects-view" className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          University Curriculum & Courses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Academic subjects configured for biometric attendance registration & IoT gateway tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(sub => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                  {sub.code}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {sub.credits} Credits
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2.5">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {sub.branch} • {sub.semester}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Biometric Logging Active</span>
              </span>
              <span className="text-[11px] font-mono">Curriculum 2026-27</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
