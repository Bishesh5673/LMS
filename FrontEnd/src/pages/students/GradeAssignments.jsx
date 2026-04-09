import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaCheckCircle, FaHourglassHalf, FaFileAlt, FaStar } from 'react-icons/fa';

const GradeAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selCourse, setSelCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [subs, setSubs] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ grade: '', feedback: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        instructorAPI.getMyCourses()
            .then(res => setCourses(res.data.courses || []))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selCourse) {
            instructorAPI.getCourseAssignments(selCourse)
                .then(res => setAssignments(res.data.data || res.data.assignments || []));
        }
        setSubs([]);
        setSelected(null);
    }, [selCourse]);

    const fetchSubs = async (id) => {
        try {
            const res = await instructorAPI.getAssignmentSubmissions(id);
            setSubs(res.data.data || res.data.submissions || []);
        } catch {
            alert('Failed to load submissions');
        }
    };

    const submitGrade = async (e) => {
        e.preventDefault();
        if (!selected) return;

        try {
            await instructorAPI.gradeSubmission(selected._id, { 
                grade: Number(form.grade), 
                feedback: form.feedback 
            });
            alert('Grade submitted successfully!');
            setSelected(null);
            setForm({ grade: '', feedback: '' });
            fetchSubs(selected.assignment);
        } catch {
            alert('Failed to submit grade');
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading grading center...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 font-sans bg-zinc-950 min-h-screen pb-20">
            <h1 className="text-4xl font-black text-white tracking-tight mb-10">Grade Submissions</h1>

            {/* Course Selector */}
            <div className="mb-10">
                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Select Course</label>
                <select 
                    value={selCourse} 
                    onChange={e => setSelCourse(e.target.value)} 
                    className="w-full max-w-md bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                >
                    <option value="">-- Select a Course to Grade --</option>
                    {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                </select>
            </div>

            {selCourse && (
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Assignments List */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FaFileAlt className="text-emerald-400" /> Assignments
                        </h3>
                        <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                        <th className="p-6 font-black">Assignment Title</th>
                                        <th className="p-6 font-black text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(a => (
                                        <tr key={a._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                            <td className="p-6 font-medium text-white">{a.title}</td>
                                            <td className="p-6 text-center">
                                                <button 
                                                    onClick={() => fetchSubs(a._id)} 
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-sm font-semibold transition-all"
                                                >
                                                    View Submissions
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {assignments.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="p-20 text-center text-zinc-400">
                                                No assignments found for this course.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Submissions & Grading Panel */}
                    <div className="flex-[2] flex flex-col gap-8">
                        {subs.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Submissions</h3>
                                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                                <th className="p-6 font-black">Student</th>
                                                <th className="p-6 font-black">Status</th>
                                                <th className="p-6 font-black text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subs.map(s => (
                                                <tr key={s._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                                    <td className="p-6 font-medium text-white">{s.student?.name}</td>
                                                    <td className="p-6">
                                                        <span className={`inline-block px-6 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest
                                                            ${s.status === 'graded' ? 'bg-emerald-900 text-emerald-400' : 'bg-amber-900 text-amber-400'}`}>
                                                            {s.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {s.status === 'graded' ? (
                                                            <span className="text-emerald-400 font-bold">Graded: {s.grade}</span>
                                                        ) : (
                                                            <button 
                                                                onClick={() => setSelected(s)} 
                                                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-sm font-semibold transition-all"
                                                            >
                                                                Grade Now
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Grading Form */}
                        {selected && (
                            <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10">
                                <h3 className="text-2xl font-bold mb-8 text-white">
                                    Grading: <span className="text-emerald-400">{selected.student?.name}</span>
                                </h3>

                                <div className="mb-8">
                                    <a 
                                        href={`${UPLOAD_URL}/${selected.fileUrl}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 px-8 py-4 rounded-2xl font-medium transition-all"
                                    >
                                        <FaFileAlt /> View Submitted File
                                    </a>
                                </div>

                                <form onSubmit={submitGrade} className="space-y-8">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Grade (0-100)</label>
                                        <input 
                                            type="number" 
                                            required 
                                            min="0" 
                                            max="100" 
                                            value={form.grade} 
                                            onChange={e => setForm({ ...form, grade: e.target.value })} 
                                            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white text-2xl font-bold" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Feedback / Comments</label>
                                        <textarea 
                                            required 
                                            rows={5} 
                                            value={form.feedback} 
                                            onChange={e => setForm({ ...form, feedback: e.target.value })} 
                                            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button 
                                            type="submit" 
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-lg transition-all"
                                        >
                                            Submit Grade
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setSelected(null)} 
                                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl font-bold text-lg transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!selCourse && (
                <div className="text-center py-20 text-zinc-400">
                    Select a course to start grading submissions.
                </div>
            )}
        </div>
    );
};

export default GradeAssignments;