import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    
    const initialForm = { 
        title: '', 
        company: '', 
        location: '', 
        type: 'Full-time', 
        description: '', 
        requirements: '', 
        applyLink: '', 
        deadline: '', 
        isActive: true 
    };
    
    const [form, setForm] = useState(initialForm);

    const load = async () => {
        setLoading(true);
        try {
            const res = await jobAPI.getAll();
            setJobs(res.data.data || []);
        } catch {
            alert('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const edit = (j) => {
        setEditing(j._id);
        setForm({ 
            ...j, 
            requirements: Array.isArray(j.requirements) ? j.requirements.join(', ') : j.requirements || '', 
            deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '' 
        });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const submit = async (e) => {
        e.preventDefault();
        const payload = { 
            ...form, 
            requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean) 
        };

        try {
            if (editing) {
                await jobAPI.update(editing, payload);
                alert('Job updated successfully!');
            } else {
                await jobAPI.create(payload);
                alert('Job posted successfully!');
            }

            setShowForm(false);
            setEditing(null);
            setForm(initialForm);
            load();
        } catch (err) {
            alert('Failed to save job');
        }
    };

    const del = async (id) => {
        if (!confirm('Delete this job posting?')) return;
        try {
            await jobAPI.delete(id);
            load();
        } catch {
            alert('Failed to delete job');
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading job postings...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
                        <FaBriefcase className="text-emerald-400" /> Manage Job Postings
                    </h1>
                    <button 
                        onClick={() => { 
                            setShowForm(!showForm); 
                            setEditing(null); 
                            setForm(initialForm); 
                        }} 
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-2xl font-semibold transition-all"
                    >
                        {showForm ? 'Close Form' : <><FaPlus /> Post New Job</>}
                    </button>
                </div>

                {/* Job Form */}
                {showForm && (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 mb-16">
                        <h2 className="text-3xl font-bold mb-10 text-white">
                            {editing ? 'Edit Job Posting' : 'Create New Job Posting'}
                        </h2>

                        <form onSubmit={submit} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Job Title</label>
                                    <input 
                                        required 
                                        value={form.title} 
                                        onChange={e => setForm({ ...form, title: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Company Name</label>
                                    <input 
                                        required 
                                        value={form.company} 
                                        onChange={e => setForm({ ...form, company: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Location</label>
                                    <input 
                                        required 
                                        value={form.location} 
                                        onChange={e => setForm({ ...form, location: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Job Type</label>
                                    <select 
                                        value={form.type} 
                                        onChange={e => setForm({ ...form, type: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Apply Link (URL)</label>
                                    <input 
                                        required 
                                        type="url" 
                                        value={form.applyLink} 
                                        onChange={e => setForm({ ...form, applyLink: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Application Deadline</label>
                                    <input 
                                        required 
                                        type="date" 
                                        value={form.deadline} 
                                        onChange={e => setForm({ ...form, deadline: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Job Description</label>
                                <textarea 
                                    required 
                                    rows={5} 
                                    value={form.description} 
                                    onChange={e => setForm({ ...form, description: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Requirements (comma separated)</label>
                                <input 
                                    value={form.requirements} 
                                    onChange={e => setForm({ ...form, requirements: e.target.value })} 
                                    placeholder="React, Node.js, 2+ years experience" 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <input 
                                    type="checkbox" 
                                    id="isActive" 
                                    checked={form.isActive} 
                                    onChange={e => setForm({ ...form, isActive: e.target.checked })} 
                                    className="accent-emerald-500 w-5 h-5"
                                />
                                <label htmlFor="isActive" className="text-white font-medium cursor-pointer">Active Job Listing</label>
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-bold text-lg transition-all"
                                >
                                    {editing ? 'Update Job Posting' : 'Post New Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Jobs List */}
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                <th className="p-6 font-black">Job Title</th>
                                <th className="p-6 font-black">Company</th>
                                <th className="p-6 font-black">Status</th>
                                <th className="p-6 font-black text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(j => (
                                <tr key={j._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                    <td className="p-6">
                                        <div className="font-bold text-white">{j.title}</div>
                                        <div className="text-emerald-400 text-sm mt-1 flex items-center gap-2">
                                            <FaMapMarkerAlt /> {j.location}
                                        </div>
                                    </td>
                                    <td className="p-6 text-white font-medium">{j.company}</td>
                                    <td className="p-6">
                                        <span className={`inline-block px-6 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest
                                            ${j.isActive ? 'bg-emerald-900 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                            {j.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button 
                                                onClick={() => edit(j)} 
                                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button 
                                                onClick={() => del(j._id)} 
                                                className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center text-zinc-400">
                                        No job postings yet. Create one above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JobsManagement;