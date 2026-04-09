import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaGraduationCap, FaSearch, FaCheckCircle, FaUserGraduate, FaTimesCircle, FaEye } from 'react-icons/fa';

const VerifyCompletion = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [busy, setBusy] = useState(null);
    const [certFiles, setCertFiles] = useState({});

    const load = async () => {
        try {
            setLoading(true);
            const [sr, cr] = await Promise.all([
                instructorAPI.getMyStudents(), 
                instructorAPI.getMyCourses()
            ]);
            setEnrollments(sr.data.enrollments || []);
            setCourses(cr.data.courses || []);
        } catch (err) { 
            alert('Failed to load data'); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { load(); }, []);

    const markComplete = async (id) => {
        if (!confirm('Mark this enrollment as completed?')) return;
        try {
            setBusy(id);
            await instructorAPI.updateEnrollment(id, { status: 'completed' });
            setEnrollments(p => p.map(e => e._id === id ? { ...e, status: 'completed' } : e));
        } catch (err) { 
            alert(err.response?.data?.message || 'Failed to mark complete'); 
        } finally { 
            setBusy(null); 
        }
    };

    const revoke = async (id) => {
        if (!confirm('Revoke completion? Student will need to be verified again.')) return;
        try {
            setBusy(id);
            await instructorAPI.updateEnrollment(id, { status: 'active' });
            setEnrollments(p => p.map(e => e._id === id ? { ...e, status: 'active' } : e));
        } catch (err) { 
            alert(err.response?.data?.message || 'Failed to revoke'); 
        } finally { 
            setBusy(null); 
        }
    };

    const uploadCert = async (id) => {
        const file = certFiles[id];
        if (!file) return alert('Please select a certificate image first');
        
        try {
            setBusy(`upload-${id}`);
            const fd = new FormData();
            fd.append('certificateImage', file);
            await instructorAPI.uploadCertificate(id, fd);
            alert('Certificate uploaded successfully!');
            load();
            setCertFiles(p => { const n = { ...p }; delete n[id]; return n; });
        } catch (err) { 
            alert(err.response?.data?.message || 'Failed to upload certificate'); 
        } finally { 
            setBusy(null); 
        }
    };

    const attPct = (e) => {
        const total = e.attendance?.length || 0;
        if (!total) return 0;
        const present = e.attendance.filter(a => a.status === 'present').length;
        return Math.round((present / total) * 100);
    };

    const filtered = enrollments.filter(e =>
        (!courseFilter || e.course?._id === courseFilter) &&
        (!statusFilter || e.status === statusFilter) &&
        (!search || 
            e.student?.name?.toLowerCase().includes(search.toLowerCase()) || 
            e.student?.email?.toLowerCase().includes(search.toLowerCase())
        )
    );

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading certification center...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <FaGraduationCap className="text-4xl text-emerald-400" />
                    <h1 className="text-4xl font-black tracking-tight">Certification Center</h1>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search student by name or email..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            className="w-full bg-zinc-900 border border-zinc-700 pl-12 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-500"
                        />
                    </div>

                    <select 
                        value={courseFilter} 
                        onChange={e => setCourseFilter(e.target.value)} 
                        className="bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white md:w-80"
                    >
                        <option value="">All Courses</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>

                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)} 
                        className="bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white md:w-56"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <p className="text-zinc-400 text-xl">No students match your filters.</p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Student</th>
                                    <th className="p-6 font-black">Course</th>
                                    <th className="p-6 font-black">Attendance</th>
                                    <th className="p-6 font-black">Payment</th>
                                    <th className="p-6 font-black">Status</th>
                                    <th className="p-6 font-black text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(e => {
                                    const done = e.status === 'completed';
                                    const paid = ['completed', 'installment'].includes(e.paymentStatus);
                                    const uploading = busy === `upload-${e._id}`;

                                    return (
                                        <tr key={e._id} className={`border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors ${done ? 'bg-emerald-950/30' : ''}`}>
                                            <td className="p-6">
                                                <div className="font-bold text-white">{e.student?.name}</div>
                                                <div className="text-sm text-zinc-400">{e.student?.email}</div>
                                            </td>
                                            <td className="p-6 text-white">{e.course?.title}</td>
                                            <td className="p-6 text-emerald-400 font-medium">
                                                {attPct(e)}% <span className="text-zinc-500">({e.attendance?.length || 0} classes)</span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`font-medium ${paid ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {e.paymentStatus || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                {done ? (
                                                    <span className="inline-flex items-center gap-2 bg-emerald-900 text-emerald-400 px-5 py-2 rounded-2xl text-sm font-bold">
                                                        <FaCheckCircle /> Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 bg-amber-900 text-amber-400 px-5 py-2 rounded-2xl text-sm font-bold">
                                                        Active
                                                    </span>
                                                )}
                                                {e.certificateIssued && (
                                                    <div className="text-xs text-emerald-400 mt-2">🎓 Certificate Issued</div>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                {done ? (
                                                    <div className="space-y-4">
                                                        {!e.certificateIssued && (
                                                            <button 
                                                                onClick={() => revoke(e._id)} 
                                                                disabled={busy === e._id}
                                                                className="w-full bg-red-950 hover:bg-red-900 text-red-400 py-3 rounded-2xl text-sm font-semibold transition-all"
                                                            >
                                                                Revoke Completion
                                                            </button>
                                                        )}

                                                        <div className="flex gap-3">
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                onChange={ev => setCertFiles(p => ({ ...p, [e._id]: ev.target.files?.[0] || null }))} 
                                                                className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-2xl text-sm text-zinc-300"
                                                            />
                                                            <button 
                                                                onClick={() => uploadCert(e._id)} 
                                                                disabled={uploading || !certFiles[e._id]}
                                                                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 px-6 py-3 rounded-2xl text-sm font-semibold transition-all"
                                                            >
                                                                {uploading ? 'Uploading...' : e.certificateIssued ? 'Replace Cert' : 'Upload Cert'}
                                                            </button>
                                                        </div>

                                                        {e.certificateUrl && (
                                                            <a 
                                                                href={`${UPLOAD_URL}/${e.certificateUrl}`} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-2"
                                                            >
                                                                <FaEye /> View Certificate
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => markComplete(e._id)} 
                                                        disabled={busy === e._id || !paid}
                                                        className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all ${paid ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                                                        title={!paid ? 'Payment must be completed first' : ''}
                                                    >
                                                        <FaUserGraduate /> {busy === e._id ? 'Processing...' : 'Verify & Complete'}
                                                    </button>
                                                )}
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

export default VerifyCompletion;