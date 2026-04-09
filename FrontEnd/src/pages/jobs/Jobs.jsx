import React, { useState, useEffect } from 'react';
import { publicAPI } from '../../services/api';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [types, setTypes] = useState([]);
    const [selType, setSelType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        publicAPI.getJobs({ type: selType })
            .then(res => { 
                setJobs(res.data.data?.jobs || []); 
                setTypes(res.data.data?.types || []); 
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selType]);

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] flex justify-center items-center bg-zinc-950">
            Loading job openings...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white py-12 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-4 mb-6">
                        <FaBriefcase className="text-5xl text-emerald-400" />
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Job Openings</h1>
                    </div>
                    <p className="text-zinc-400 text-lg max-w-md mx-auto">
                        Find your next opportunity in Nepal’s growing tech industry
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    <button 
                        onClick={() => setSelType('')} 
                        className={`px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                            selType === '' 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
                        }`}
                    >
                        All Types
                    </button>
                    
                    {types.map(t => (
                        <button 
                            key={t} 
                            onClick={() => setSelType(t)} 
                            className={`px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                                selType === t 
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-24 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <p className="text-zinc-400 text-2xl font-medium">No jobs found matching your criteria.</p>
                        <p className="text-zinc-500 mt-4">Try selecting a different job type or check back later.</p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Job Title & Company</th>
                                    <th className="p-6 font-black hidden sm:table-cell">Location & Type</th>
                                    <th className="p-6 font-black hidden md:table-cell">Deadline</th>
                                    <th className="p-6 font-black text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(j => (
                                    <tr 
                                        key={j._id} 
                                        className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0"
                                    >
                                        <td className="p-6">
                                            <div className="font-bold text-white text-xl mb-1">{j.title}</div>
                                            <div className="text-emerald-400 font-medium text-lg">{j.company}</div>
                                            
                                            {/* Mobile view */}
                                            <div className="sm:hidden mt-4 text-sm text-zinc-400">
                                                {j.location} • {j.type} • Due {new Date(j.deadline).toLocaleDateString()}
                                            </div>
                                        </td>
                                        
                                        <td className="p-6 hidden sm:table-cell">
                                            <div className="font-medium text-zinc-300">{j.location}</div>
                                            <div className="mt-3 inline-block bg-emerald-900 text-emerald-400 px-5 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-widest">
                                                {j.type}
                                            </div>
                                        </td>
                                        
                                        <td className="p-6 hidden md:table-cell font-medium text-zinc-400">
                                            {new Date(j.deadline).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                        
                                        <td className="p-6 text-center">
                                            <a 
                                                href={j.applyLink} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
                                            >
                                                Apply Now <FaArrowRight className="inline ml-2" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;