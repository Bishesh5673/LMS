import React, { useState, useEffect } from 'react';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaCalendarAlt, FaStar, FaPaperPlane, FaFileUpload, FaCheckCircle, FaClock, FaPaperclip } from 'react-icons/fa';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [selected, setSelected] = useState(null);
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        studentAPI.getMyAssignments()
            .then(res => setAssignments(res.data.data || []))
            .catch(e => setErr(e.response?.data?.message || 'Failed to load assignments'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (id) => {
        if (!text.trim() && !file) return alert('Please add text or upload a file');

        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.append('submissionText', text);
            if (file) fd.append('file', file);

            await studentAPI.submitAssignment(id, fd);
            
            alert('Assignment submitted successfully!');
            setSelected(null);
            setText('');
            setFile(null);

            // Refresh assignments
            const res = await studentAPI.getMyAssignments();
            setAssignments(res.data.data || []);
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (a) => {
        if (a.submission?.grade != null) {
            return (
                <span className="inline-flex items-center gap-2 bg-emerald-900 text-emerald-400 px-5 py-2 rounded-2xl text-sm font-bold">
                    <FaCheckCircle /> Graded: {a.submission.grade}%
                </span>
            );
        }
        if (a.submission) {
            return (
                <span className="inline-flex items-center gap-2 bg-amber-900 text-amber-400 px-5 py-2 rounded-2xl text-sm font-bold">
                    Submitted
                </span>
            );
        }
        if (new Date(a.dueDate) < new Date()) {
            return (
                <span className="inline-flex items-center gap-2 bg-red-900 text-red-400 px-5 py-2 rounded-2xl text-sm font-bold">
                    <FaClock /> Overdue
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-400 px-5 py-2 rounded-2xl text-sm font-bold">
                Pending
            </span>
        );
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading assignments...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <FaPaperclip className="text-4xl text-emerald-400" />
                    <h1 className="text-4xl font-black tracking-tight">My Assignments</h1>
                </div>

                {err && (
                    <div className="bg-red-950 border border-red-800 text-red-300 p-6 rounded-3xl mb-10">
                        {err}
                    </div>
                )}

                {assignments.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <p className="text-zinc-400 text-2xl">No assignments found.</p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Assignment</th>
                                    <th className="p-6 font-black">Due Date</th>
                                    <th className="p-6 font-black">Max Marks</th>
                                    <th className="p-6 font-black">Status</th>
                                    <th className="p-6 font-black text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(a => (
                                    <React.Fragment key={a._id}>
                                        <tr className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                            <td className="p-6">
                                                <div className="font-bold text-white mb-2">{a.title}</div>
                                                <div className="text-emerald-400 text-sm">{a.course?.title}</div>
                                                {a.attachments && a.attachments.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {a.attachments.map((f, i) => (
                                                            <a 
                                                                key={i} 
                                                                href={`${UPLOAD_URL}${f.url || f}`} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                                            >
                                                                <FaPaperclip /> File {i+1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6 text-zinc-400">
                                                {new Date(a.dueDate).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </td>
                                            <td className="p-6 font-bold text-emerald-400">{a.maxMarks || 100}</td>
                                            <td className="p-6">
                                                {getStatusBadge(a)}
                                            </td>
                                            <td className="p-6 text-center">
                                                {!a.submission && (
                                                    <button 
                                                        onClick={() => setSelected(selected === a._id ? null : a._id)} 
                                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-sm font-semibold transition-all"
                                                    >
                                                        {selected === a._id ? 'Cancel' : 'Submit Now'}
                                                    </button>
                                                )}
                                                {a.submission && <FaCheckCircle className="text-emerald-400 mx-auto text-2xl" />}
                                            </td>
                                        </tr>

                                        {/* Submission Form */}
                                        {selected === a._id && (
                                            <tr>
                                                <td colSpan="5" className="bg-zinc-950 p-8 border-b border-zinc-800">
                                                    <div className="max-w-2xl mx-auto">
                                                        <h4 className="text-xl font-bold text-white mb-6">Submit Assignment</h4>

                                                        <textarea 
                                                            value={text} 
                                                            onChange={e => setText(e.target.value)} 
                                                            placeholder="Write your answer or paste GitHub link here..." 
                                                            rows={5} 
                                                            className="w-full bg-zinc-900 border border-zinc-700 p-5 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y mb-6"
                                                        />

                                                        <div className="mb-8">
                                                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Attach File (Optional)</label>
                                                            <input 
                                                                type="file" 
                                                                onChange={e => setFile(e.target.files[0])} 
                                                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                                                            />
                                                        </div>

                                                        <div className="flex gap-4">
                                                            <button 
                                                                onClick={() => handleSubmit(a._id)} 
                                                                disabled={submitting} 
                                                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 py-4 rounded-2xl font-bold transition-all"
                                                            >
                                                                {submitting ? 'Submitting...' : 'Submit Assignment'}
                                                            </button>
                                                            <button 
                                                                onClick={() => setSelected(null)} 
                                                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-4 rounded-2xl font-bold transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assignments;