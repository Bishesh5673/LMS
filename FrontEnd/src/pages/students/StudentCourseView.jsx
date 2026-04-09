import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseAPI, studentAPI, UPLOAD_URL } from '../../services/api';
import { FaBookOpen, FaFileAlt, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const StudentCourseView = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [course, setCourse] = useState(null);
  const [att, setAtt] = useState({ list: [], total: 0, present: 0, pct: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('syllabus');

  useEffect(() => {
    Promise.all([
      courseAPI.getCourseById(id),
      studentAPI.getMyAttendance(id).catch(() => ({ data: { data: [] } }))
    ]).then(([cr, ar]) => {
      setCourse(cr.data.course);
      const list = ar?.data?.data || [];
      const { total = list.length, present = 0 } = ar?.data?.summary || {};
      setAtt({ 
        list, 
        total, 
        present, 
        pct: total > 0 ? Math.round((present / total) * 100) : 0 
      });
    }).catch(() => { 
      alert('You are not enrolled in this course'); 
      nav('/student/dashboard'); 
    }).finally(() => setLoading(false));
  }, [id, nav]);

  if (loading) return (
    <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
      Loading course...
    </div>
  );

  if (!course) return (
    <div className="p-12 text-center text-red-400 font-bold min-h-[50vh] bg-zinc-950">
      Course not found or access denied
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-emerald-900/50 py-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link 
            to="/student/dashboard" 
            className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 font-medium transition-colors"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full">
            Enrolled
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Course Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-white mb-4">
            {course.title}
          </h1>
          <p className="text-emerald-400 text-lg">Instructor: {course.instructor?.name || 'Admin'}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-10 border-b border-zinc-800 pb-2 overflow-x-auto">
          {['syllabus', 'resources', 'attendance'].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`px-8 py-4 rounded-2xl font-semibold capitalize transition-all whitespace-nowrap
                ${tab === t 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10">
          {/* Syllabus Tab */}
          {tab === 'syllabus' && (
            <div>
              {course.syllabusFile && (
                <a 
                  href={`${UPLOAD_URL}/${course.syllabusFile}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold mb-10 transition-all"
                >
                  <FaFileAlt /> Download Full Syllabus PDF
                </a>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                      <th className="p-6 font-black w-24">Week</th>
                      <th className="p-6 font-black">Topic</th>
                      <th className="p-6 font-black">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.syllabus?.map((s, i) => (
                      <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                        <td className="p-6 font-bold text-emerald-400 text-xl">{s.week}</td>
                        <td className="p-6 font-medium text-white">{s.topic}</td>
                        <td className="p-6 text-zinc-400 leading-relaxed">{s.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {tab === 'resources' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                    <th className="p-6 font-black">Title</th>
                    <th className="p-6 font-black">Type</th>
                    <th className="p-6 font-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {course.resources?.map((r, i) => (
                    <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                      <td className="p-6 font-medium text-white">{r.title}</td>
                      <td className="p-6 text-emerald-400 capitalize">{r.type}</td>
                      <td className="p-6 text-center">
                        <a 
                          href={`${UPLOAD_URL}/${r.fileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-sm font-semibold transition-all"
                        >
                          <FaEye /> View Resource
                        </a>
                      </td>
                    </tr>
                  ))}
                  {(!course.resources || course.resources.length === 0) && (
                    <tr>
                      <td colSpan="3" className="p-20 text-center text-zinc-400">
                        No resources uploaded for this course yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance Tab */}
          {tab === 'attendance' && (
            <div>
              <div className="bg-zinc-800 border border-emerald-900/50 rounded-3xl p-10 mb-12 flex flex-col sm:flex-row gap-12">
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-6xl font-black text-emerald-400 mb-2">{att.present} / {att.total}</div>
                  <div className="text-zinc-400 uppercase tracking-widest text-sm font-bold">Classes Attended</div>
                </div>
                <div className="flex-1 text-center sm:text-left border-t sm:border-t-0 sm:border-l border-emerald-900/50 pt-8 sm:pt-0 sm:pl-12">
                  <div className="text-6xl font-black text-white mb-2">{att.pct}%</div>
                  <div className="text-emerald-400 uppercase tracking-widest text-sm font-bold">Attendance Rate</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                      <th className="p-6 font-black">Date</th>
                      <th className="p-6 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {att.list.map((a, i) => (
                      <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                        <td className="p-6 text-white flex items-center gap-3">
                          <FaCalendarAlt className="text-emerald-400" />
                          {new Date(a.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="p-6">
                          <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest
                            ${a.status === 'present' ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
                            {a.status === 'present' && <FaCheckCircle />}
                            {a.status === 'absent' && <FaTimesCircle />}
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {att.list.length === 0 && (
                      <tr>
                        <td colSpan="2" className="p-20 text-center text-zinc-400">
                          No attendance records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseView;