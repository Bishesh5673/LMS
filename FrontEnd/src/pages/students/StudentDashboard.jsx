import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaBookOpen, FaCheckCircle, FaTasks, FaCertificate, FaArrowRight, FaClock, FaTrophy } from 'react-icons/fa';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentAPI.getDashboard()
            .then(res => { 
                if (res.data.success) setData(res.data.data); 
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading your dashboard...
        </div>
    );

    const d = data || { 
        enrollments: [], 
        totalCourses: 0, 
        activeCourses: 0, 
        completedCourses: 0, 
        pendingAssignments: 0 
    };

    const stats = [
        { label: 'Total Enrolled', val: d.totalCourses, icon: <FaBookOpen />, color: 'emerald' },
        { label: 'Active Courses', val: d.activeCourses, icon: <FaClock />, color: 'amber' },
        { label: 'Completed', val: d.completedCourses, icon: <FaCheckCircle />, color: 'emerald' },
        { label: 'Pending Tasks', val: d.pendingAssignments, icon: <FaTasks />, color: 'amber' },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight">
                            Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-zinc-400 mt-2 text-lg">Here's your learning progress</p>
                    </div>
                    <Link 
                        to="/courses" 
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-600/30"
                    >
                        Browse Courses <FaArrowRight />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8 hover:border-emerald-600 transition-all group"
                        >
                            <div className="text-emerald-400 text-4xl mb-6 group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div className="text-5xl font-black text-white tracking-tighter mb-2">
                                {stat.val}
                            </div>
                            <div className="text-sm uppercase tracking-widest text-zinc-400 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* My Courses */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black text-white">My Courses</h2>
                            <Link 
                                to="/student/my-courses" 
                                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2"
                            >
                                View All <FaArrowRight />
                            </Link>
                        </div>

                        {d.enrollments.length === 0 ? (
                            <div className="bg-zinc-900 border border-emerald-900/30 rounded-3xl p-16 text-center">
                                <p className="text-zinc-400 text-xl">You haven't enrolled in any courses yet.</p>
                                <Link 
                                    to="/courses" 
                                    className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold"
                                >
                                    Browse Available Courses
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {d.enrollments.slice(0, 4).map(e => (
                                    <div 
                                        key={e._id} 
                                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 hover:border-emerald-600 transition-all group"
                                    >
                                        <div className="md:w-52 flex-shrink-0">
                                            {e.course?.thumbnail ? (
                                                <img 
                                                    src={`${UPLOAD_URL}/${e.course.thumbnail}`} 
                                                    alt={e.course.title}
                                                    className="w-full aspect-video object-cover rounded-2xl" 
                                                />
                                            ) : (
                                                <div className="w-full aspect-video bg-zinc-800 rounded-2xl flex items-center justify-center">
                                                    <FaBookOpen className="text-6xl text-emerald-400 opacity-30" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="font-bold text-2xl text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                                {e.course?.title}
                                            </div>
                                            <div className="text-emerald-400 text-sm mb-4">by {e.course?.instructor?.name}</div>

                                            <div className="mb-6">
                                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-500 rounded-full transition-all" 
                                                        style={{ width: `${e.progress || 0}%` }}
                                                    />
                                                </div>
                                                <div className="text-xs text-zinc-400 mt-2 flex justify-between">
                                                    <span>Progress</span>
                                                    <span className="font-medium text-white">{e.progress || 0}%</span>
                                                </div>
                                            </div>

                                            <Link 
                                                to={`/student/course/${e.course?._id}`} 
                                                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-semibold transition-all"
                                            >
                                                Continue Learning <FaArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Access Sidebar */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-black text-white mb-8">Quick Access</h2>
                        <div className="space-y-4">
                            {[
                                { to: '/student/my-courses', icon: <FaBookOpen />, label: 'My Courses', color: 'emerald' },
                                { to: '/student/assignments', icon: <FaTasks />, label: 'Assignments', color: 'amber' },
                                { to: '/student/certificates', icon: <FaCertificate />, label: 'My Certificates', color: 'emerald' },
                            ].map((item, index) => (
                                <Link 
                                    key={index}
                                    to={item.to} 
                                    className="bg-zinc-900 border border-zinc-800 hover:border-emerald-600 p-8 rounded-3xl flex items-center gap-6 group transition-all"
                                >
                                    <div className={`text-4xl text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">
                                            {item.label}
                                        </div>
                                        <div className="text-zinc-400 text-sm mt-1">Go to section →</div>
                                    </div>
                                    <FaArrowRight className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                                </Link>
                            ))}
                        </div>

                        {/* Motivation Box */}
                        <div className="mt-12 bg-gradient-to-br from-emerald-900 to-zinc-900 border border-emerald-800 rounded-3xl p-10 text-center">
                            <FaTrophy className="text-5xl text-emerald-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-black mb-3">Keep Going!</h3>
                            <p className="text-zinc-400">You're making great progress.<br/>Consistency is the key to mastery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;