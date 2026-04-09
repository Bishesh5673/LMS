import React, { useState, useEffect } from 'react';
import { publicAPI, UPLOAD_URL } from '../services/api';

const About = () => {
    const [data, setData] = useState({ s: null, i: [], p: [] });
    const [load, setLoad] = useState(true);

    useEffect(() => {
        Promise.all([publicAPI.getSettings(), publicAPI.getInstructors()]).then(([sRes, iRes]) => {
            setData({ 
                s: sRes.data.data.settings, 
                p: sRes.data.data.partners, 
                i: iRes.data.data 
            });
        }).catch(() => alert('Failed to load')).finally(() => setLoad(false));
    }, []);

    if (load) return (
        <div className="p-8 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading...
        </div>
    );

    return (
        <div className="font-sans bg-zinc-950 text-white pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-zinc-900 to-black py-24 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Empowering Nepal's <span className="text-emerald-400">IT Ecosystem</span>
                </h1>
                <p className="max-w-3xl mx-auto text-xl text-zinc-400">
                    Code Academy is dedicated to bridging the talent gap in Nepal's growing tech industry.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-6xl mx-auto my-20 px-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-zinc-900 p-10 md:p-14 rounded-3xl border border-emerald-900/50">
                    <h2 className="text-3xl font-black text-emerald-400 mb-6">Our Mission</h2>
                    <p className="italic text-zinc-300 text-lg leading-relaxed">
                        "{data.s?.mission || 'To provide world-class IT education accessible to every aspiring developer in Nepal.'}"
                    </p>
                </div>
                
                <div className="flex-1 bg-zinc-900 p-10 md:p-14 rounded-3xl border border-emerald-900/50">
                    <h2 className="text-3xl font-black text-emerald-400 mb-6">Our Vision</h2>
                    <p className="italic text-zinc-300 text-lg leading-relaxed">
                        "{data.s?.vision || 'To become the benchmark for technical excellence and innovation in Nepal’s IT education.'}"
                    </p>
                </div>
            </div>

            {/* Instructors Section */}
            <h2 className="text-center text-4xl font-black text-white mt-10 mb-12">Our Instructors</h2>
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 px-6">
                {data.i.map(ins => (
                    <div 
                        key={ins._id} 
                        className="w-full sm:w-72 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center hover:border-emerald-600 transition-all group"
                    >
                        <div className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-zinc-800 flex items-center justify-center overflow-hidden border-4 border-emerald-900 group-hover:border-emerald-600 transition-colors">
                            {ins.avatar ? (
                                <img 
                                    src={`${UPLOAD_URL}/${ins.avatar}`} 
                                    alt={ins.name} 
                                    className="w-full h-full object-cover rounded-2xl" 
                                />
                            ) : (
                                <span className="text-5xl font-black text-emerald-400">
                                    {ins.name.charAt(0)}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{ins.name}</h3>
                        <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest">
                            {ins.expertise?.slice(0, 3).join(', ') || 'Expert Instructor'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Partners Section */}
            <h2 className="text-center text-4xl font-black text-white mt-24 mb-12">Our Partners</h2>
            <div className="max-w-6xl mx-auto px-6 py-12 flex justify-center items-center flex-wrap gap-16">
                {data.p?.map(p => (
                    <img 
                        key={p._id} 
                        src={`${UPLOAD_URL}/${p.logo}`} 
                        alt={p.name} 
                        className="h-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer" 
                    />
                ))}
            </div>
        </div>
    );
};

export default About;