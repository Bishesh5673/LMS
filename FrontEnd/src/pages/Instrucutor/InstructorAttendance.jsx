import React, { useState, useEffect } from 'react';
import { instructorAPI } from '../../services/api';
import { FaUsers, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const getLocalDate = (d = new Date()) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const InstructorAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);
    const [date, setDate] = useState(getLocalDate());
    const [marked, setMarked] = useState({});

    useEffect(() => {
        instructorAPI.getMyCourses()
            .then(res => setCourses(res.data.courses || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!course) {
            setStudents([]);
            setMarked({});
            return;
        }
        instructorAPI.getMyStudents(course)
            .then(res => setStudents(res.data.enrollments || []))
            .catch(err => console.error(err));
    }, [course]);

    useEffect(() => {
        if (!students.length) return;
        const m = {};
        students.forEach(e => {
            const rec = e.attendance?.find(a => getLocalDate(a.date) === date);
            if (rec) m[e._id] = rec.status;
        });
        setMarked(m);
    }, [date, students]);

    const mark = async (enrollmentId, status) => {
        try {
            setMarking(enrollmentId + '_' + status);
            const res = await instructorAPI.markAttendance(enrollmentId, { date, status });
            if (res.data.success) {
                setMarked(prev => ({ ...prev, [enrollmentId]: status }));
                setStudents(prev => prev.map(e => {
                    if (e._id !== enrollmentId) return e;
                    const list = [...(e.attendance || [])];
                    const idx = list.findIndex(a => getLocalDate(a.date) === date);
                    if (idx >= 0) list[idx] = { ...list[idx], status };
                    else list.push({ date, status });
                    return { ...e, attendance: list };
                }));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setMarking(null);
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading attendance...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <FaUsers className="text-4xl text-emerald-400" />
                    <h1 className="text-4xl font-black tracking-tight">Course Attendance</h1>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 bg-zinc-900 border border-emerald-900/50 p-8 rounded-3xl">
                    <div className="flex-1">
                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Select Course</label>
                        <select 
                            value={course} 
                            onChange={e => setCourse(e.target.value)} 
                            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                        >
                            <option value="">-- Choose a Course --</option>
                            {courses.map(c => (
                                <option key={c._id} value={c._id}>{c.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400" />
                            <input 
                                type="date" 
                                value={date} 
                                max={getLocalDate()} 
                                onChange={e => setDate(e.target.value)} 
                                className="w-full bg-zinc-800 border border-zinc-700 pl-12 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                            />
                        </div>
                    </div>
                </div>

                {!course ? (
                    <div className="text-center py-20 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <p className="text-zinc-400 text-xl">Select a course to mark attendance</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <p className="text-zinc-400 text-xl">No students enrolled in this course yet.</p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Student</th>
                                    <th className="p-6 font-black">Email</th>
                                    <th className="p-6 font-black">Today's Status</th>
                                    <th className="p-6 font-black text-center">Mark Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(e => {
                                    const status = marked[e._id];
                                    const busy = marking?.startsWith(e._id);

                                    return (
                                        <tr key={e._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                            <td className="p-6">
                                                <div className="font-bold text-white">{e.student?.name}</div>
                                            </td>
                                            <td className="p-6 text-zinc-400">{e.student?.email}</td>
                                            <td className="p-6">
                                                {status ? (
                                                    <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl text-sm font-bold capitalize
                                                        ${status === 'present' ? 'bg-emerald-900 text-emerald-400' : 
                                                          status === 'late' ? 'bg-amber-900 text-amber-400' : 
                                                          'bg-red-900 text-red-400'}`}>
                                                        {status === 'present' && <FaCheckCircle />}
                                                        {status === 'late' && <FaClock />}
                                                        {status === 'absent' && <FaTimesCircle />}
                                                        {status}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-500">Not marked yet</span>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex justify-center gap-3">
                                                    {[
                                                        { label: 'Present', value: 'present', color: 'emerald' },
                                                        { label: 'Late', value: 'late', color: 'amber' },
                                                        { label: 'Absent', value: 'absent', color: 'red' }
                                                    ].map(({ label, value, color }) => (
                                                        <button 
                                                            key={value}
                                                            onClick={() => mark(e._id, value)} 
                                                            disabled={busy}
                                                            className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all
                                                                ${status === value 
                                                                    ? `bg-${color}-600 text-white` 
                                                                    : `bg-zinc-800 hover:bg-zinc-700 text-${color}-400 border border-${color}-900`}`}
                                                        >
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorAttendance;