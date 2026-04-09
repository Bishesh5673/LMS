import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaFileUpload, FaPlus, FaTrash, FaEye } from 'react-icons/fa';

const UploadResources = () => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ 
        title: '', 
        description: '', 
        type: 'document', 
        file: null 
    });

    useEffect(() => {
        instructorAPI.getMyCourses()
            .then(res => setCourses(res.data.courses || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!course) {
            setResources([]);
            return;
        }
        instructorAPI.getCourseResources(course)
            .then(res => setResources(res.data.data || []))
            .catch(err => console.error(err));
    }, [course]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!course) return alert('Please select a course');
        if (!form.file) return alert('Please select a file to upload');

        try {
            setUploading(true);
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('type', form.type);
            fd.append('file', form.file);

            await instructorAPI.uploadResource(course, fd);
            
            alert('Resource uploaded successfully!');
            setForm({ title: '', description: '', type: 'document', file: null });
            document.getElementById('resource-file').value = '';

            // Refresh resources
            const res = await instructorAPI.getCourseResources(course);
            setResources(res.data.data || []);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload resource');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this resource?')) return;
        try {
            await instructorAPI.deleteResource(id);
            setResources(prev => prev.filter(r => r._id !== id));
        } catch {
            alert('Failed to delete resource');
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading resources...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <FaFileUpload className="text-4xl text-emerald-400" />
                    <h1 className="text-4xl font-black tracking-tight">Upload Resources</h1>
                </div>

                {/* Course Selector */}
                <div className="mb-10">
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Select Course</label>
                    <select 
                        value={course} 
                        onChange={e => setCourse(e.target.value)} 
                        className="w-full max-w-md bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                    >
                        <option value="">-- Choose a Course --</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                {course && (
                    <>
                        {/* Upload Form */}
                        <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 mb-12">
                            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                <FaPlus /> Upload New Resource
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Resource Title</label>
                                        <input 
                                            value={form.title} 
                                            onChange={e => setForm({ ...form, title: e.target.value })} 
                                            required 
                                            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Type</label>
                                        <select 
                                            value={form.type} 
                                            onChange={e => setForm({ ...form, type: e.target.value })} 
                                            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                                        >
                                            <option value="document">Document (PDF, DOC, etc.)</option>
                                            <option value="video">Video</option>
                                            <option value="presentation">Presentation</option>
                                            <option value="code">Source Code</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Description (Optional)</label>
                                    <textarea 
                                        value={form.description} 
                                        onChange={e => setForm({ ...form, description: e.target.value })} 
                                        rows={3} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Upload File</label>
                                    <input 
                                        id="resource-file"
                                        type="file" 
                                        onChange={e => setForm({ ...form, file: e.target.files[0] })} 
                                        required 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={uploading} 
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 py-4 rounded-2xl font-bold text-lg transition-all"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Resource'}
                                </button>
                            </form>
                        </div>

                        {/* Resources List */}
                        <h2 className="text-3xl font-black mb-8">Uploaded Resources</h2>

                        {resources.length === 0 ? (
                            <div className="text-center py-20 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                                <p className="text-zinc-400 text-xl">No resources uploaded yet for this course.</p>
                            </div>
                        ) : (
                            <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                            <th className="p-6 font-black">Title</th>
                                            <th className="p-6 font-black">Type</th>
                                            <th className="p-6 font-black">Description</th>
                                            <th className="p-6 font-black text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map(r => (
                                            <tr key={r._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                                <td className="p-6 font-medium text-white">{r.title}</td>
                                                <td className="p-6 text-emerald-400 capitalize">{r.type}</td>
                                                <td className="p-6 text-zinc-400 text-sm">{r.description || '—'}</td>
                                                <td className="p-6 text-center">
                                                    <div className="flex justify-center gap-4">
                                                        <a 
                                                            href={r.fileUrl ? `${UPLOAD_URL}${r.fileUrl}` : r.url} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                                                        >
                                                            <FaEye /> View
                                                        </a>
                                                        <button 
                                                            onClick={() => handleDelete(r._id)} 
                                                            className="text-red-400 hover:text-red-300 flex items-center gap-2"
                                                        >
                                                            <FaTrash /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadResources;