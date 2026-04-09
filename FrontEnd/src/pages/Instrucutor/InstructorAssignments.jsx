import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaPlus, FaCalendarAlt, FaFileAlt, FaTrash } from 'react-icons/fa';

const InstructorAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selCourse, setSelCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ 
        title: '', 
        description: '', 
        dueDate: '', 
        maxMarks: 100 
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load courses
    useEffect(() => {
        instructorAPI.getMyCourses()
            .then(res => setCourses(res.data.courses || []))
            .finally(() => setLoading(false));
    }, []);

    // Load assignments when a course is selected
    useEffect(() => {
        if (selCourse) {
            instructorAPI.getCourseAssignments(selCourse)
                .then(res => setAssignments(res.data.data || res.data.assignments || []));
        } else {
            setAssignments([]);
        }
    }, [selCourse]);

    const submit = async (e) => {
        e.preventDefault();
        if (!selCourse) return alert("Please select a course first");

        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('dueDate', new Date(form.dueDate).toISOString());
            fd.append('maxMarks', form.maxMarks);

            files.forEach(f => fd.append('attachments', f));

            await instructorAPI.createAssignment(selCourse, fd);

            alert('Assignment created successfully!');
            setShowForm(false);
            setForm({ title: '', description: '', dueDate: '', maxMarks: 100 });
            setFiles([]);

            // Refresh the list
            const res = await instructorAPI.getCourseAssignments(selCourse);
            setAssignments(res.data.data || res.data.assignments || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create assignment');
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading assignments...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-12 px-6 font-sans bg-zinc-950 min-h-screen pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-4xl font-black text-white tracking-tight">Manage Assignments</h1>
                {selCourse && (
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-3.5 rounded-2xl font-semibold transition-all active:scale-95"
                    >
                        {showForm ? 'Cancel' : <><FaPlus /> New Assignment</>}
                    </button>
                )}
            </div>

            {/* Course Selector */}
            <div className="mb-10">
                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Select Course</label>
                <select 
                    value={selCourse} 
                    onChange={e => setSelCourse(e.target.value)} 
                    className="w-full max-w-md bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                >
                    <option value="">-- Choose a Course --</option>
                    {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                </select>
            </div>

            {/* Create Assignment Form */}
            {showForm && selCourse && (
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-white">Create New Assignment</h2>

                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Assignment Title</label>
                                <input 
                                    required 
                                    value={form.title} 
                                    onChange={e => setForm({ ...form, title: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Maximum Marks</label>
                                <input 
                                    required 
                                    type="number" 
                                    value={form.maxMarks} 
                                    onChange={e => setForm({ ...form, maxMarks: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Due Date & Time</label>
                            <input 
                                required 
                                type="datetime-local" 
                                value={form.dueDate} 
                                onChange={e => setForm({ ...form, dueDate: e.target.value })} 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Attachments (Optional)</label>
                            <input 
                                type="file" 
                                multiple 
                                onChange={e => setFiles(Array.from(e.target.files))} 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Description / Instructions</label>
                            <textarea 
                                required 
                                rows={6} 
                                value={form.description} 
                                onChange={e => setForm({ ...form, description: e.target.value })} 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)} 
                                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold transition-all"
                            >
                                Create Assignment
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Assignments List */}
            {selCourse && (
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Assignments</h3>
                        <span className="text-emerald-400 text-sm">{assignments.length} assignments</span>
                    </div>

                    {assignments.length === 0 ? (
                        <div className="p-20 text-center text-zinc-400">
                            No assignments created for this course yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                        <th className="p-6 font-black">Title & Details</th>
                                        <th className="p-6 font-black">Due Date</th>
                                        <th className="p-6 font-black">Max Marks</th>
                                        <th className="p-6 font-black">Attachments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(a => (
                                        <tr key={a._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                            <td className="p-6">
                                                <div className="font-bold text-white mb-2">{a.title}</div>
                                                <div className="text-zinc-400 text-sm line-clamp-2">{a.description}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <FaCalendarAlt />
                                                    <span className={new Date(a.dueDate) < new Date() ? 'text-red-400 line-through' : ''}>
                                                        {new Date(a.dueDate).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 font-bold text-emerald-400">{a.maxMarks}</td>
                                            <td className="p-6 text-sm text-zinc-400">
                                                {a.attachments && a.attachments.length > 0 ? (
                                                    a.attachments.map((f, i) => (
                                                        <a 
                                                            key={i} 
                                                            href={`${UPLOAD_URL}/${f}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="block hover:text-emerald-400 transition-colors"
                                                        >
                                                            File {i+1}
                                                        </a>
                                                    ))
                                                ) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {!selCourse && (
                <div className="text-center py-20 text-zinc-400">
                    Please select a course to manage assignments.
                </div>
            )}
        </div>
    );
};

export default InstructorAssignments;