import React, { useState, useEffect } from 'react';
import { courseAPI, UPLOAD_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaBook } from 'react-icons/fa';

const ManageCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [syllabus, setSyllabus] = useState([{ week: 1, topic: '', description: '' }]);
    
    const initialCourse = { 
        title: '', 
        category: 'Programming', 
        skillLevel: 'Beginner', 
        duration: '', 
        fee: '', 
        description: '', 
        startDate: '', 
        installmentAvailable: false, 
        prerequisites: '' 
    };
    
    const [form, setForm] = useState(initialCourse);
    const [files, setFiles] = useState({ thumb: null, pdf: null });

    const load = async () => {
        setLoading(true);
        try {
            const res = await courseAPI.getInstructorCourses();
            setCourses(res.data.courses || []);
        } catch {
            alert('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const edit = (c) => {
        setEditing(c._id);
        setShowForm(true);
        setForm({ 
            ...c, 
            prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.join(', ') : c.prerequisites || '', 
            startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '' 
        });
        setSyllabus(c.syllabus?.length > 0 ? c.syllabus : [{ week: 1, topic: '', description: '' }]);
        setFiles({ thumb: null, pdf: null });
        window.scrollTo(0, 0);
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(form).forEach(k => {
                if (k === 'prerequisites') {
                    fd.append(k, JSON.stringify(form.prerequisites.split(',').map(i => i.trim()).filter(Boolean)));
                } else {
                    fd.append(k, form[k]);
                }
            });
            fd.append('syllabus', JSON.stringify(syllabus));
            if (files.thumb) fd.append('thumbnail', files.thumb);
            if (files.pdf) fd.append('syllabusFile', files.pdf);

            if (editing) {
                await courseAPI.updateCourse(editing, fd);
                alert('Course updated successfully!');
            } else {
                await courseAPI.createCourse(fd);
                alert('Course created successfully!');
            }

            setShowForm(false);
            setEditing(null);
            setForm(initialCourse);
            setSyllabus([{ week: 1, topic: '', description: '' }]);
            setFiles({ thumb: null, pdf: null });
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save course');
        }
    };

    const del = async (id) => {
        if (!confirm('Delete this course?')) return;
        try {
            await courseAPI.deleteCourse(id);
            load();
        } catch {
            alert('Failed to delete course');
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading your courses...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 font-sans bg-zinc-950 min-h-screen pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                    <FaBook className="text-emerald-400" /> Manage Courses
                </h1>
                <button 
                    onClick={() => { 
                        setShowForm(!showForm); 
                        setEditing(null); 
                        setForm(initialCourse); 
                        setSyllabus([{ week: 1, topic: '', description: '' }]); 
                    }} 
                    className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-semibold transition-all"
                >
                    {showForm ? 'Close Form' : <><FaPlus /> New Course</>}
                </button>
            </div>

            {/* Course Form */}
            {showForm && (
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-white">
                        {editing ? 'Edit Course' : 'Create New Course'}
                    </h2>

                    <form onSubmit={submit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Course Title</label>
                                <input 
                                    required 
                                    value={form.title} 
                                    onChange={e => setForm({ ...form, title: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Category</label>
                                <input 
                                    required 
                                    value={form.category} 
                                    onChange={e => setForm({ ...form, category: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Skill Level</label>
                                <select 
                                    value={form.skillLevel} 
                                    onChange={e => setForm({ ...form, skillLevel: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Duration (Hours)</label>
                                <input 
                                    required 
                                    type="number" 
                                    value={form.duration} 
                                    onChange={e => setForm({ ...form, duration: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Fee (Rs)</label>
                                <input 
                                    required 
                                    type="number" 
                                    value={form.fee} 
                                    onChange={e => setForm({ ...form, fee: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Start Date</label>
                                <input 
                                    required 
                                    type="date" 
                                    value={form.startDate} 
                                    onChange={e => setForm({ ...form, startDate: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Prerequisites (comma separated)</label>
                            <input 
                                value={form.prerequisites} 
                                onChange={e => setForm({ ...form, prerequisites: e.target.value })} 
                                placeholder="Basic HTML, CSS, JavaScript" 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Description</label>
                            <textarea 
                                required 
                                rows={5} 
                                value={form.description} 
                                onChange={e => setForm({ ...form, description: e.target.value })} 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <input 
                                type="checkbox" 
                                id="installment" 
                                checked={form.installmentAvailable} 
                                onChange={e => setForm({ ...form, installmentAvailable: e.target.checked })} 
                                className="accent-emerald-500 w-5 h-5"
                            />
                            <label htmlFor="installment" className="text-white font-medium cursor-pointer">Installment Payment Available</label>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Thumbnail & Syllabus PDF</label>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        onChange={e => setFiles({ ...files, thumb: e.target.files[0] })} 
                                        accept="image/*" 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                                    />
                                    <p className="text-xs text-zinc-500 mt-2">Course Thumbnail (Image)</p>
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        onChange={e => setFiles({ ...files, pdf: e.target.files[0] })} 
                                        accept=".pdf" 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                                    />
                                    <p className="text-xs text-zinc-500 mt-2">Syllabus PDF</p>
                                </div>
                            </div>
                        </div>

                        {/* Syllabus Builder */}
                        <div className="pt-8 border-t border-zinc-800">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xl font-bold text-white">Syllabus Modules</h4>
                                <button 
                                    type="button" 
                                    onClick={() => setSyllabus([...syllabus, { week: syllabus.length + 1, topic: '', description: '' }])} 
                                    className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2"
                                >
                                    + Add Module
                                </button>
                            </div>

                            <div className="space-y-6">
                                {syllabus.map((s, i) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-4 bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
                                        <input 
                                            value={s.topic} 
                                            onChange={e => {
                                                const n = [...syllabus];
                                                n[i].topic = e.target.value;
                                                setSyllabus(n);
                                            }} 
                                            placeholder="Module Topic" 
                                            className="flex-1 bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                            required 
                                        />
                                        <input 
                                            value={s.description} 
                                            onChange={e => {
                                                const n = [...syllabus];
                                                n[i].description = e.target.value;
                                                setSyllabus(n);
                                            }} 
                                            placeholder="Module Description" 
                                            className="flex-[2] bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                            required 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setSyllabus(syllabus.filter((_, idx) => idx !== i))} 
                                            className="px-6 py-4 bg-red-950 hover:bg-red-900 text-red-400 rounded-2xl text-sm font-semibold transition-all"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-bold text-lg transition-all"
                            >
                                {editing ? 'Update Course' : 'Create Course'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Courses List */}
            <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                            <th className="p-6 font-black">Course</th>
                            <th className="p-6 font-black">Details</th>
                            <th className="p-6 font-black">Enrolled</th>
                            <th className="p-6 font-black text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                <td className="p-6">
                                    <div className="font-bold text-white">{c.title}</div>
                                    <div className="text-emerald-400 text-sm mt-1">{c.category}</div>
                                </td>
                                <td className="p-6 text-zinc-400 text-sm">
                                    Rs. {c.fee} • {c.duration} hrs • {c.skillLevel}
                                </td>
                                <td className="p-6 font-bold text-emerald-400">{c.enrolledStudents || 0}</td>
                                <td className="p-6 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button 
                                            onClick={() => edit(c)} 
                                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button 
                                                onClick={() => del(c._id)} 
                                                className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-20 text-center text-zinc-400">
                                    You haven't created any courses yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCourses;