import React, { useState, useEffect } from 'react';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaAward, FaDownload, FaImage, FaClock } from 'react-icons/fa';

const Certificates = () => {
    const [certs, setCerts] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await studentAPI.getMyCertificates();
                setCerts(res.data?.data || []);

                // Get courses to find completed ones without certificate
                const cRes = await studentAPI.getMyCourses();
                setWaiting((cRes.data?.enrollments || []).filter(e => 
                    e.status === 'completed' && !e.certificateIssued
                ));
            } catch (e) { 
                setErr('Failed to load certificates'); 
            } finally { 
                setLoading(false); 
            }
        };
        load();
    }, []);

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading your certificates...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <FaAward className="text-5xl text-emerald-400" />
                    <h1 className="text-4xl font-black tracking-tight">My Certificates</h1>
                </div>

                {err && (
                    <div className="bg-red-950 border border-red-800 text-red-300 p-6 rounded-3xl mb-10 text-center">
                        {err}
                    </div>
                )}

                {/* Awaiting Certificates */}
                {waiting.length > 0 && (
                    <div className="bg-amber-900/30 border border-amber-800 rounded-3xl p-8 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <FaClock className="text-amber-400" />
                            <h3 className="text-xl font-bold text-amber-400">Awaiting Certificate Upload</h3>
                        </div>
                        <ul className="space-y-3 text-amber-300">
                            {waiting.map(e => (
                                <li key={e._id} className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                    <span>{e.course?.title}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-amber-400/70 text-sm mt-6">
                            Your instructor will upload the certificate soon. Check back later.
                        </p>
                    </div>
                )}

                {certs.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <FaAward className="text-7xl text-zinc-700 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white mb-4">No Certificates Yet</h2>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            Complete your courses and your instructor will issue your official certificates.
                        </p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Certificate Preview</th>
                                    <th className="p-6 font-black">Course</th>
                                    <th className="p-6 font-black hidden sm:table-cell">Issued Date</th>
                                    <th className="p-6 font-black text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certs.map(c => {
                                    const certUrl = c.certificateImage?.startsWith('http') 
                                        ? c.certificateImage 
                                        : `${UPLOAD_URL}${c.certificateImage}`;

                                    return (
                                        <tr key={c._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                            <td className="p-6">
                                                <div className="w-40 h-28 bg-zinc-800 rounded-2xl overflow-hidden border border-emerald-900 shadow-inner">
                                                    <img 
                                                        src={certUrl} 
                                                        alt={c.course?.title} 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-white text-xl">{c.course?.title}</div>
                                                <div className="text-emerald-400 text-sm mt-1">Certified • Verified</div>
                                            </td>
                                            <td className="p-6 hidden sm:table-cell text-zinc-400">
                                                {new Date(c.issuedDate || c.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-6 text-center">
                                                <div className="flex justify-center gap-4">
                                                    <a 
                                                        href={certUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-2xl font-medium transition-all"
                                                    >
                                                        <FaImage /> View
                                                    </a>
                                                    <a 
                                                        href={certUrl} 
                                                        download 
                                                        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-medium transition-all"
                                                    >
                                                        <FaDownload /> Download
                                                    </a>
                                                </div>
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

export default Certificates;