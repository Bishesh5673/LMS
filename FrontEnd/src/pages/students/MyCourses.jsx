import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, UPLOAD_URL } from '../../services/api';
import { FaBookOpen, FaArrowRight, FaPlayCircle } from 'react-icons/fa';

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        enrollmentAPI.getMyEnrollments()
            .then(res => setEnrollments(res.data.enrollments || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading your courses...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <FaBookOpen className="text-4xl text-emerald-400" />
                    <h1 className="text-4xl font-black tracking-tight">My Courses</h1>
                </div>

                {enrollments.length === 0 ? (
                    <div className="bg-zinc-900 border border-emerald-900/30 rounded-3xl p-20 text-center">
                        <p className="text-zinc-400 text-2xl mb-6">You haven't enrolled in any courses yet.</p>
                        <Link 
                            to="/courses" 
                            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-semibold transition-all"
                        >
                            Browse Available Courses <FaArrowRight />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrollments.map(e => (
                            <div 
                                key={e._id} 
                                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-600 transition-all group"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 bg-zinc-800">
                                    <img 
                                        src={`${UPLOAD_URL}/${e.course?.thumbnail}`} 
                                        alt={e.course?.title} 
                                        onError={(ev) => { ev.target.src = 'https://picsum.photos/id/1015/400/200'; }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-4 left-4 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                        {e.course?.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-7">
                                    <h3 className="font-bold text-xl text-white line-clamp-2 mb-3 group-hover:text-emerald-400 transition-colors">
                                        {e.course?.title}
                                    </h3>
                                    <p className="text-emerald-400 text-sm mb-6">
                                        by {e.course?.instructor?.name || 'Instructor'}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-8">
                                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                                                style={{ width: `${e.progress || 0}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-400 mt-2">
                                            <span>Progress</span>
                                            <span className="font-medium text-white">{e.progress || 0}%</span>
                                        </div>
                                    </div>

                                    <Link 
                                        to={`/student/course/${e.course?._id}`} 
                                        className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-semibold transition-all group-hover:scale-105"
                                    >
                                        Continue Learning 
                                        <FaPlayCircle />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;