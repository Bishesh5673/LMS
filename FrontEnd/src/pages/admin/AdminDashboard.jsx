import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaBook, 
  FaClipboardList, 
  FaWallet, 
  FaUsersCog, 
  FaChartLine, 
  FaBriefcase, 
  FaCommentDots 
} from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ 
        totalStudents: 0, 
        totalInstructors: 0, 
        totalCourses: 0, 
        totalRevenue: 0, 
        totalEnrollments: 0 
    });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        adminAPI.getStats()
            .then(res => setStats(res.data.data))
            .catch(() => setErr('Failed to load dashboard data'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading Admin Dashboard...
        </div>
    );

    if (err) return (
        <div className="p-12 text-center text-red-400 font-bold min-h-[50vh] bg-zinc-950">
            {err}
        </div>
    );

    const statCards = [
        { 
            label: 'Total Students', 
            val: stats.totalStudents.toLocaleString(), 
            icon: <FaUserGraduate className="text-3xl" /> 
        },
        { 
            label: 'Instructors', 
            val: stats.totalInstructors.toLocaleString(), 
            icon: <FaChalkboardTeacher className="text-3xl" /> 
        },
        { 
            label: 'Courses', 
            val: stats.totalCourses.toLocaleString(), 
            icon: <FaBook className="text-3xl" /> 
        },
        { 
            label: 'Enrollments', 
            val: stats.totalEnrollments.toLocaleString(), 
            icon: <FaClipboardList className="text-3xl" /> 
        },
        { 
            label: 'Total Revenue', 
            val: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, 
            icon: <FaWallet className="text-3xl" /> 
        },
    ];

    const quickLinks = [
        { to: '/admin/users', label: 'Manage Users', icon: <FaUsersCog /> },
        { to: '/admin/finance', label: 'Finance Overview', icon: <FaChartLine /> },
        { to: '/admin/courses', label: 'Manage Courses', icon: <FaBook /> },
        { to: '/admin/jobs', label: 'Job Postings', icon: <FaBriefcase /> },
        { to: '/admin/testimonials', label: 'Testimonials', icon: <FaCommentDots /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tight text-white">Admin Dashboard</h1>
                    <p className="text-zinc-400 mt-2 text-lg">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
                    {statCards.map((stat, index) => (
                        <div 
                            key={index}
                            className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8 hover:border-emerald-600 transition-all group"
                        >
                            <div className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div className="text-4xl font-black text-white mb-2 tracking-tighter">
                                {stat.val}
                            </div>
                            <div className="text-sm uppercase tracking-widest text-zinc-400 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Access Tools */}
                <div>
                    <h2 className="text-3xl font-black text-white mb-8">Management Tools</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {quickLinks.map((link, index) => (
                            <Link 
                                key={index}
                                to={link.to} 
                                className="bg-zinc-900 border border-zinc-800 hover:border-emerald-600 p-8 rounded-3xl group transition-all flex flex-col items-center text-center"
                            >
                                <div className="text-4xl text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                                    {link.icon}
                                </div>
                                <div className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;