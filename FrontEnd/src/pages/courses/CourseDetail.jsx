import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI, demoSlotAPI, studentAPI } from '../../services/api';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const nav = useNavigate();
    const [course, setCourse] = useState(null);
    const [slots, setSlots] = useState([]);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [cRes, dRes] = await Promise.all([
                    courseAPI.getCourseById(id),
                    demoSlotAPI.getSlotsByCourseId(id).catch(() => ({ data: { data: [] } }))
                ]);
                setCourse(cRes.data.course);
                setSlots(dRes?.data?.data || []);
                if (user) {
                    const eRes = await studentAPI.isEnrolled(id);
                    setEnrolled(eRes.data.enrolled);
                }
            } catch (err) { 
                console.error(err); 
            } 
            finally { 
                setLoading(false); 
            }
        };
        fetchAll();
    }, [id, user]);

    const book = async (sId) => {
        if (!user) return nav('/login');
        try {
            await demoSlotAPI.bookSlot(sId);
            alert('Demo slot booked successfully!');
            // Refresh slots
            const refreshed = await demoSlotAPI.getSlotsByCourseId(id);
            setSlots(refreshed.data.data);
        } catch (err) { 
            alert(err.response?.data?.message || 'Failed to book slot'); 
        }
    };

    if (loading) return (
        <div className="p-8 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading course details...
        </div>
    );

    if (!course) return (
        <div className="p-8 text-center text-red-400 font-bold min-h-[50vh] bg-zinc-950">
            Course not found
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 font-sans bg-zinc-950 min-h-screen">
            {/* Hero Section */}
            <div className="bg-zinc-900 border border-emerald-900/50 p-10 md:p-16 rounded-3xl mb-16 shadow-2xl">
                <div className="inline-flex items-center gap-2 bg-emerald-900 text-emerald-400 px-5 py-2 rounded-2xl text-xs font-bold tracking-widest uppercase mb-6">
                    {course.category} • {course.skillLevel}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                    {course.title}
                </h1>

                <p className="text-lg text-zinc-300 md:max-w-3xl leading-relaxed">
                    {course.description}
                </p>

                {/* Course Meta */}
                <div className="flex flex-wrap gap-10 md:gap-16 mt-12 py-8 border-t border-zinc-800">
                    <div>
                        <span className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Instructor</span>
                        <span className="font-bold text-xl text-white">{course.instructor?.name}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Rating</span>
                        <span className="font-bold text-xl text-amber-400">★ {course.rating || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Enrolled</span>
                        <span className="font-bold text-xl text-white">{course.enrolledStudents || 0} students</span>
                    </div>
                    <div>
                        <span className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Fee</span>
                        <span className="font-black text-4xl text-emerald-400">Rs. {course.fee}</span>
                    </div>
                </div>

                {/* Enroll Button */}
                <div className="mt-8">
                    {enrolled ? (
                        <Link 
                            to={`/student/course/${course._id}`} 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all inline-block shadow-lg shadow-emerald-600/30"
                        >
                            Go to My Course
                        </Link>
                    ) : (
                        <Link 
                            to="/admission" 
                            state={{ courseId: course._id }} 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all inline-block shadow-lg shadow-emerald-600/30"
                        >
                            Enroll Now
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Syllabus Section */}
                <div className="flex-[2]">
                    <h2 className="text-3xl font-black text-white mb-8">Course Syllabus</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <tbody>
                                {course.syllabus?.map((s, i) => (
                                    <tr key={i} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
                                        <td className="p-8 w-16 text-emerald-400 font-black text-xl align-top">
                                            {i + 1}.
                                        </td>
                                        <td className="p-8">
                                            <div className="font-bold text-white text-xl mb-3">{s.topic}</div>
                                            <div className="text-zinc-400 leading-relaxed">{s.description}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex-1 flex flex-col gap-10">
                    {/* Demo Slots */}
                    <div>
                        <h2 className="text-2xl font-black text-white mb-6">Demo Slots</h2>
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                            {slots.length === 0 ? (
                                <p className="text-zinc-400 italic">No demo slots available at the moment.</p>
                            ) : (
                                slots.map(s => (
                                    <div key={s._id} className="flex justify-between items-center py-6 border-b border-zinc-800 last:border-0">
                                        <div>
                                            <div className="font-semibold text-white">
                                                {new Date(s.date).toLocaleDateString('en-US', { 
                                                    weekday: 'short', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                            <div className="text-emerald-400 text-sm mt-1">{s.time}</div>
                                        </div>
                                        {s.isFull ? (
                                            <span className="text-red-400 text-xs font-bold uppercase tracking-widest bg-red-950 px-4 py-2 rounded-2xl">Full</span>
                                        ) : (
                                            <button 
                                                onClick={() => book(s._id)} 
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                                            >
                                                Book Slot
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h2 className="text-2xl font-black text-white mb-6">Student Reviews</h2>
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                            {course.reviews?.length === 0 ? (
                                <p className="text-zinc-400 italic">No reviews yet. Be the first to enroll!</p>
                            ) : (
                                course.reviews?.slice(0, 3).map((r, i) => (
                                    <div key={i} className="mb-8 pb-8 border-b border-zinc-800 last:border-0 last:mb-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-semibold text-white">{r.student?.name}</span>
                                            <span className="text-amber-400 font-bold bg-zinc-800 px-3 py-1 rounded-xl text-sm">
                                                ★ {r.rating}/5
                                            </span>
                                        </div>
                                        <div className="text-zinc-400 italic leading-relaxed">
                                            "{r.comment}"
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;