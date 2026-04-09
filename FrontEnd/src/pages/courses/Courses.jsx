import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseAPI, UPLOAD_URL } from '../../services/api';

const Courses = () => {
    const [params, setParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: params.get('search') || '', 
        category: params.get('category') || '',
        skillLevel: params.get('skillLevel') || '', 
        sort: params.get('sort') || 'newest'
    });

    useEffect(() => {
        setLoading(true);
        courseAPI.getAllCourses(filters)
            .then(res => { 
                setCourses(res.data.courses); 
                setCats(res.data.categories || []); 
            })
            .catch(() => alert('Failed to load courses'))
            .finally(() => setLoading(false));
            
        const clean = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
        setParams(clean);
    }, [filters, setParams]);

    const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }));

    if (loading) return (
        <div className="p-8 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading courses...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto py-6 px-6 font-sans bg-zinc-950 min-h-screen pb-20">
            <h1 className="text-4xl md:text-5xl font-black text-white text-center mb-12 tracking-tight">
                Explore Our Courses
            </h1>
            
            {/* Filters Bar */}
            <div className="bg-zinc-900 border border-emerald-900/50 p-6 rounded-3xl shadow-xl mb-12">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <input 
                        placeholder="Search courses..." 
                        value={filters.search} 
                        onChange={e => setF('search', e.target.value)} 
                        className="w-full md:flex-1 p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
                    />
                    
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 flex-1">
                        <select 
                            value={filters.category} 
                            onChange={e => setF('category', e.target.value)} 
                            className="w-full sm:flex-1 p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white font-medium transition-all"
                        >
                            <option value="">All Categories</option>
                            {cats.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        
                        <select 
                            value={filters.skillLevel} 
                            onChange={e => setF('skillLevel', e.target.value)} 
                            className="w-full sm:flex-1 p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white font-medium transition-all"
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        
                        <select 
                            value={filters.sort} 
                            onChange={e => setF('sort', e.target.value)} 
                            className="w-full sm:flex-1 p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white font-medium transition-all"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                    <p className="text-zinc-400 font-medium text-xl">No courses match your filters.</p>
                    <p className="text-zinc-500 mt-2">Try changing your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(c => (
                        <div 
                            key={c._id} 
                            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-600 group transition-all duration-300 flex flex-col"
                        >
                            <div className="relative overflow-hidden h-52 bg-zinc-800">
                                <img 
                                    src={`${UPLOAD_URL}/${c.thumbnail}`} 
                                    alt="" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-2xl shadow">
                                    {c.category}
                                </div>
                            </div>
                            
                            <div className="p-7 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                                    {c.title}
                                </h3>
                                
                                <div className="text-zinc-400 text-sm mb-6 flex items-center justify-between">
                                    <span className="font-medium">{c.skillLevel}</span>
                                    {c.rating && (
                                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                                            ★ {c.rating}
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-end mt-auto pt-6 border-t border-zinc-800">
                                    <div>
                                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Course Fee</div>
                                        <span className="font-black text-3xl text-emerald-400">Rs. {c.fee}</span>
                                    </div>
                                    <Link 
                                        to={`/courses/${c._id}`} 
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;