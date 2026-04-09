import React, { useEffect, useState } from 'react';
import { adminAPI, UPLOAD_URL } from '../../services/api';

const init = { name: '', role: '', comment: '', rating: 5, isActive: true };

const TestimonialsManagement = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(init);
    const [avatar, setAvatar] = useState(null);
    const [editId, setEditId] = useState(null);

    const fetch = async () => { 
        const res = await adminAPI.getTestimonials(); 
        setItems(res.data?.data || []); 
    };

    useEffect(() => { fetch(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (avatar) fd.append('avatar', avatar);

        try {
            if (editId) {
                await adminAPI.updateTestimonial(editId, fd);
            } else {
                await adminAPI.createTestimonial(fd);
            }
            setForm(init); 
            setAvatar(null); 
            setEditId(null); 
            fetch();
        } catch {
            alert('Failed to save testimonial');
        }
    };

    const handleEdit = (t) => {
        setEditId(t._id);
        setForm({ 
            name: t.name || '', 
            role: t.role || '', 
            comment: t.comment || '', 
            rating: t.rating || 5, 
            isActive: t.isActive ?? true 
        });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black tracking-tight mb-10 flex items-center gap-4">
                    Testimonials Management
                </h1>

                {/* Add / Edit Form */}
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 mb-12">
                    <h2 className="text-2xl font-bold mb-8 text-white">
                        {editId ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Name</label>
                                <input 
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })} 
                                    required 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Role / Position</label>
                                <input 
                                    value={form.role} 
                                    onChange={e => setForm({ ...form, role: e.target.value })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Rating (1-5)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="5" 
                                    value={form.rating} 
                                    onChange={e => setForm({ ...form, rating: Number(e.target.value) })} 
                                    className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white" 
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-8">
                                <input 
                                    type="checkbox" 
                                    id="active" 
                                    checked={form.isActive} 
                                    onChange={e => setForm({ ...form, isActive: e.target.checked })} 
                                    className="accent-emerald-500 w-5 h-5"
                                />
                                <label htmlFor="active" className="text-white font-medium">Show on website (Active)</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Comment / Testimonial</label>
                            <textarea 
                                value={form.comment} 
                                onChange={e => setForm({ ...form, comment: e.target.value })} 
                                required 
                                rows={5} 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white resize-y"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Avatar (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setAvatar(e.target.files?.[0] || null)} 
                                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl text-zinc-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-emerald-950 file:text-emerald-400"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            {editId && (
                                <button 
                                    type="button" 
                                    onClick={() => { setForm(init); setEditId(null); setAvatar(null); }}
                                    className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-600/30"
                            >
                                {editId ? 'Update Testimonial' : 'Add Testimonial'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Testimonials Table */}
                <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                <th className="p-6 font-black">Avatar</th>
                                <th className="p-6 font-black">Name</th>
                                <th className="p-6 font-black">Role</th>
                                <th className="p-6 font-black">Rating</th>
                                <th className="p-6 font-black">Status</th>
                                <th className="p-6 font-black text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(t => (
                                <tr key={t._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                    <td className="p-6">
                                        {t.avatar ? (
                                            <img 
                                                src={`${UPLOAD_URL}/${t.avatar}`} 
                                                alt={t.name} 
                                                className="w-12 h-12 rounded-2xl object-cover border border-emerald-900" 
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">—</div>
                                        )}
                                    </td>
                                    <td className="p-6 font-bold text-white">{t.name}</td>
                                    <td className="p-6 text-zinc-300">{t.role}</td>
                                    <td className="p-6">
                                        <span className="text-amber-400 font-bold">★ {t.rating}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`inline-block px-5 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest
                                            ${t.isActive ? 'bg-emerald-900 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                            {t.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button 
                                                onClick={() => handleEdit(t)} 
                                                className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-blue-400 rounded-2xl text-sm font-semibold transition-all"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (confirm('Delete this testimonial?')) {
                                                        adminAPI.deleteTestimonial(t._id).then(fetch);
                                                    }
                                                }} 
                                                className="px-6 py-2.5 bg-red-950 hover:bg-red-900 text-red-400 rounded-2xl text-sm font-semibold transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center text-zinc-400">
                                        No testimonials yet. Add one above.
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

export default TestimonialsManagement;