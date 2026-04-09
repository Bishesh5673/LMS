import React, { useState, useEffect } from 'react';
import { publicAPI, contactAPI } from '../services/api';

const Contact = () => {
    const [info, setInfo] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [load, setLoad] = useState(false);

    useEffect(() => {
        publicAPI.getSettings().then(res => setInfo(res.data.data.settings)).catch(() => {});
    }, []);

    const submit = async (e) => {
        e.preventDefault(); 
        setLoad(true);
        try {
            await contactAPI.sendMessage(form);
            alert('Message Sent Successfully!');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch { 
            alert('Failed to send message'); 
        }
        finally { 
            setLoad(false); 
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-6 px-6 font-sans bg-zinc-950 min-h-screen pb-20">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Contact Us</h1>
                <p className="text-zinc-400 text-lg max-w-md mx-auto">
                    Have questions? Send us a message and we will get back to you soon.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Contact Info Sidebar */}
                <div className="flex-1 bg-zinc-900 p-8 rounded-3xl border border-emerald-900/50 self-start">
                    <h3 className="text-2xl font-black text-white mb-8">Contact Info</h3>
                    
                    <div className="space-y-8 text-zinc-300">
                        <div>
                            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Phone</div>
                            <p className="text-lg font-medium">{info?.phone || '+977-1-1234567'}</p>
                        </div>
                        
                        <div>
                            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Email</div>
                            <p className="text-lg font-medium">{info?.email || 'info@codeacademy.com'}</p>
                        </div>
                        
                        <div>
                            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Address</div>
                            <p className="text-lg font-medium leading-relaxed">{info?.address || 'Kathmandu, Nepal'}</p>
                        </div>
                    </div>

                    <hr className="my-10 border-zinc-800" />
                    
                    <div>
                        <div className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Business Hours</div>
                        <p className="text-zinc-400">Monday – Friday<br/>9:00 AM – 6:00 PM</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="flex-[2] bg-zinc-900 p-8 md:p-12 rounded-3xl border border-emerald-900/50">
                    <form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Your Name</label>
                                <input 
                                    required 
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })} 
                                    className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Email Address</label>
                                <input 
                                    required 
                                    type="email" 
                                    value={form.email} 
                                    onChange={e => setForm({ ...form, email: e.target.value })} 
                                    className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Subject</label>
                            <input 
                                required 
                                value={form.subject} 
                                onChange={e => setForm({ ...form, subject: e.target.value })} 
                                className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
                                placeholder="How can we help you?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">Message</label>
                            <textarea 
                                required 
                                rows={6} 
                                value={form.message} 
                                onChange={e => setForm({ ...form, message: e.target.value })} 
                                className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 resize-none transition-all" 
                                placeholder="Write your message here..."
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={load} 
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all text-lg shadow-lg shadow-emerald-600/30 active:scale-[0.985]"
                        >
                            {load ? 'Sending Message...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;