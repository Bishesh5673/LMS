import React, { useState, useEffect } from 'react';
import { blogAPI, UPLOAD_URL } from '../../services/api';
import { FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [form, setForm] = useState({ 
        title: '', 
        category: 'Technology', 
        content: '', 
        tags: '', 
        status: 'published' 
    });

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        try {
            const res = await blogAPI.getMyBlogs();
            setBlogs(res.data.data || []);
        } catch (err) { 
            console.error(err); 
        } finally { 
            setLoading(false); 
        }
    };

    const resetForm = () => {
        setForm({ title: '', category: 'Technology', content: '', tags: '', status: 'published' });
        setThumbnail(null); 
        setEditId(null); 
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            const slug = form.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            
            data.append('title', form.title);
            data.append('category', form.category);
            data.append('content', form.content);
            data.append('tags', form.tags);
            data.append('slug', editId ? slug : `${slug}-${Date.now()}`);
            data.append('excerpt', form.content.slice(0, 180));
            data.append('isPublished', form.status === 'published');
            
            if (thumbnail) data.append('thumbnail', thumbnail);

            if (editId) {
                await blogAPI.updateBlog(editId, data);
                alert('Blog updated successfully!');
            } else {
                await blogAPI.createBlog(data);
                alert('Blog created successfully!');
            }

            fetchBlogs(); 
            resetForm();
        } catch (err) { 
            alert(err.response?.data?.message || 'Failed to save blog'); 
        }
    };

    const handleEdit = (b) => {
        setForm({ 
            title: b.title, 
            category: b.category, 
            content: b.content, 
            tags: b.tags ? b.tags.join(', ') : '', 
            status: b.isPublished ? 'published' : 'draft' 
        });
        setEditId(b._id); 
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try { 
            await blogAPI.deleteBlog(id); 
            fetchBlogs(); 
        } catch (err) { 
            alert('Failed to delete blog'); 
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading your blogs...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight">Manage My Blogs</h1>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl font-semibold transition-all"
                    >
                        {showForm ? 'Cancel' : <><FaPlus /> New Blog</>}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 mb-12">
                        <h2 className="text-2xl font-bold mb-8">
                            {editId ? 'Edit Blog Post' : 'Create New Blog Post'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Blog Title</label>
                                    <input 
                                        type="text" 
                                        value={form.title} 
                                        onChange={e => setForm({ ...form, title: e.target.value })} 
                                        required 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Category</label>
                                    <select 
                                        value={form.category} 
                                        onChange={e => setForm({ ...form, category: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                                    >
                                        {['Technology', 'Education', 'Career', 'Development', 'Design', 'News', 'Programming'].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Tags (comma separated)</label>
                                <input 
                                    type="text" 
                                    value={form.tags} 
                                    onChange={e => setForm({ ...form, tags: e.target.value })} 
                                    placeholder="react, javascript, tutorial" 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Thumbnail Image</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={e => setThumbnail(e.target.files[0])} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Status</label>
                                    <select 
                                        value={form.status} 
                                        onChange={e => setForm({ ...form, status: e.target.value })} 
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Content</label>
                                <textarea 
                                    value={form.content} 
                                    onChange={e => setForm({ ...form, content: e.target.value })} 
                                    required 
                                    rows={12} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                                />
                            </div>

                            <div className="flex gap-4 justify-end">
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="px-10 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold transition-all"
                                >
                                    {editId ? 'Update Blog' : 'Publish Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Blogs Table */}
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                    {blogs.length === 0 ? (
                        <div className="p-20 text-center text-zinc-400">
                            You haven't created any blogs yet.
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Title</th>
                                    <th className="p-6 font-black">Category</th>
                                    <th className="p-6 font-black">Status</th>
                                    <th className="p-6 font-black">Views</th>
                                    <th className="p-6 font-black">Date</th>
                                    <th className="p-6 font-black text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map(b => (
                                    <tr key={b._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                        <td className="p-6 font-medium text-white">{b.title}</td>
                                        <td className="p-6 text-emerald-400">{b.category}</td>
                                        <td className="p-6">
                                            <span className={`inline-block px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest
                                                ${b.isPublished ? 'bg-emerald-900 text-emerald-400' : 'bg-amber-900 text-amber-400'}`}>
                                                {b.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-zinc-400 flex items-center gap-2">
                                            <FaEye /> {b.views || 0}
                                        </td>
                                        <td className="p-6 text-zinc-400">
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center gap-4">
                                                <button 
                                                    onClick={() => handleEdit(b)} 
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(b._id)} 
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBlogs;