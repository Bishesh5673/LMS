import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instructorAPI } from '../../services/api';
import { FaUsers, FaClipboardList, FaPlus, FaFileUpload, FaCheckSquare, FaBook, FaEdit, FaGraduationCap, FaChartBar } from 'react-icons/fa';

const InstructorDashboard = () => {
    const [stats, setStats] = useState({ 
        totalCourses: 0, 
        totalStudents: 0, 
        pendingSubmissions: 0 
    });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        instructorAPI.getDashboard()
            .then(res => { 
                const d = res.data.data; 
                setStats({ 
                    totalCourses: d.totalCourses || 0, 
                    totalStudents: d.totalStudents || 0, 
                    pendingSubmissions: d.pendingGrading || 0 
                }); 
                setCourses(d.courses || []); 
            })
            .catch(() => setErr('Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading instructor dashboard...
        </div>
    );

    if (err) return (
        <div className="p-12 text-center text-red-400 font-bold min-h-[50vh] bg-zinc-950">
            {err}
        </div>
    );

    const quickActions = [
        { 
            to: '/instructor/assignments', 
            icon: <FaPlus />, 
            label: 'Create Assignment', 
            desc: 'Add new tasks for students' 
        },
        { 
            to: '/instructor/grade-assignments', 
            icon: <FaCheckSquare />, 
            label: 'Grade Assignments', 
            desc: 'Review student submissions' 
        },
        { 
            to: '/instructor/attendance', 
            icon: <FaUsers />, 
            label: 'Take Attendance', 
            desc: 'Mark daily attendance' 
        },
        { 
            to: '/instructor/resources', 
            icon: <FaFileUpload />, 
            label: 'Upload Resources', 
            desc: 'Share study materials' 
        },
        { 
            to: '/instructor/blogs', 
            icon: <FaEdit />, 
            label: 'Write Blog', 
            desc: 'Publish articles' 
        },
        { 
            to: '/instructor/verify-completion', 
            icon: <FaGraduationCap />, 
            label: 'Verify Completion', 
            desc: 'Issue certificates' 
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight">Instructor Dashboard</h1>
                        <p className="text-zinc-400 mt-2">Welcome back! Here's your teaching overview.</p>
                    </div>
                    <Link 
                        to="/instructor/courses" 
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-600/30"
                    >
                        <FaPlus /> Add New Course
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
                        <div className="flex items-center gap-4">
                            <div className="text-emerald-400 text-4xl"><FaBook /></div>
                            <div>
                                <div className="text-5xl font-black text-white tracking-tighter">{stats.totalCourses}</div>
                                <div className="text-sm uppercase tracking-widest text-zinc-400 mt-1">Total Courses</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
                        <div className="flex items-center gap-4">
                            <div className="text-emerald-400 text-4xl"><FaUsers /></div>
                            <div>
                                <div className="text-5xl font-black text-white tracking-tighter">{stats.totalStudents}</div>
                                <div className="text-sm uppercase tracking-widest text-zinc-400 mt-1">Total Students</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
                        <div className="flex items-center gap-4">
                            <div className="text-amber-400 text-4xl"><FaClipboardList /></div>
                            <div>
                                <div className="text-5xl font-black text-white tracking-tighter">{stats.pendingSubmissions}</div>
                                <div className="text-sm uppercase tracking-widest text-zinc-400 mt-1">Pending Grading</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-3xl font-black mb-8">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {quickActions.map((action, index) => (
                        <Link 
                            key={index}
                            to={action.to} 
                            className="bg-zinc-900 border border-zinc-800 hover:border-emerald-600 p-8 rounded-3xl group transition-all flex gap-6 items-start"
                        >
                            <div className="text-4xl text-emerald-400 mt-1 group-hover:scale-110 transition-transform">
                                {action.icon}
                            </div>
                            <div>
                                <div className="font-bold text-xl text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {action.label}
                                </div>
                                <div className="text-zinc-400 text-sm leading-relaxed">
                                    {action.desc}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Your Courses */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black">Your Courses</h2>
                        <Link to="/instructor/courses" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2">
                            View All <FaBook />
                        </Link>
                    </div>

                    {courses.length === 0 ? (
                        <div className="bg-zinc-900 border border-emerald-900/30 rounded-3xl p-16 text-center">
                            <p className="text-zinc-400 text-xl">You haven't created any courses yet.</p>
                            <Link 
                                to="/instructor/courses" 
                                className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold"
                            >
                                Create Your First Course
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                        <th className="p-6 font-black">Course Title</th>
                                        <th className="p-6 font-black">Category</th>
                                        <th className="p-6 font-black">Enrolled Students</th>
                                        <th className="p-6 font-black text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.slice(0, 5).map(c => (
                                        <tr key={c._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                            <td className="p-6 font-medium text-white">{c.title}</td>
                                            <td className="p-6 text-emerald-400">{c.category}</td>
                                            <td className="p-6 text-white">{c.enrolledStudents || 0}</td>
                                            <td className="p-6 text-center">
                                                <Link 
                                                    to={`/instructor/courses/${c._id}`} 
                                                    className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-2"
                                                >
                                                    Manage Course →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;