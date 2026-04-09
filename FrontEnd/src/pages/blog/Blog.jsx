import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../../services/api';

const Blog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [blogRes, metaRes] = await Promise.all([
                    publicAPI.getAllBlogs({ category, search }),
                    publicAPI.getBlogMeta()
                ]);
                setBlogs(blogRes.data.data.blogs || []);
                setMeta(metaRes.data.data);
            } catch (err) { 
                console.error(err); 
            } finally { 
                setLoading(false); 
            }
        };
        load();
    }, [category, search]);

    if (loading) return (
        <div className="p-8 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading blog posts...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 font-sans bg-zinc-950 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Our Blog</h1>
                <p className="text-zinc-400 mt-4 text-lg max-w-md mx-auto">
                    Insights, tutorials, and stories from the world of tech and innovation
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Blog List */}
                <div className="flex-[2]">
                    {blogs.length === 0 ? (
                        <div className="text-center py-24 bg-zinc-900 border border-zinc-800 rounded-3xl">
                            <FaSearch className="mx-auto text-6xl text-zinc-600 mb-6" />
                            <p className="text-zinc-400 text-2xl font-medium">No posts found</p>
                            <p className="text-zinc-500 mt-3">Try changing your search term or category</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {blogs.map(b => (
                                <div 
                                    key={b._id} 
                                    className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-600 transition-all group flex flex-col md:flex-row gap-8 p-8"
                                >
                                    {/* Thumbnail */}
                                    <div className="md:w-80 flex-shrink-0">
                                        {b.thumbnail ? (
                                            <img 
                                                src={`${UPLOAD_URL}/${b.thumbnail}`} 
                                                alt={b.title} 
                                                className="w-full aspect-video md:aspect-square object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full aspect-video md:aspect-square bg-zinc-800 rounded-2xl flex items-center justify-center">
                                                <span className="text-6xl text-emerald-400 opacity-50">📝</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-zinc-500 mb-4">
                                            <span className="bg-emerald-900/80 text-emerald-400 px-4 py-1.5 rounded-full font-medium">
                                                {b.category}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FaCalendarAlt className="text-emerald-500" />
                                                {new Date(b.createdAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>

                                        <Link 
                                            to={`/blog/${b.slug}`} 
                                            className="text-2xl md:text-3xl font-bold text-white hover:text-emerald-400 transition-colors line-clamp-3 leading-tight mb-5"
                                        >
                                            {b.title}
                                        </Link>

                                        <p className="text-zinc-400 text-[15.5px] leading-relaxed mb-8 flex-1 line-clamp-4">
                                            {b.content?.replace(/<[^>]*>?/gm, '').substring(0, 180)}...
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800">
                                            <small className="text-zinc-500">By {b.author?.name}</small>
                                            
                                            <Link 
                                                to={`/blog/${b.slug}`} 
                                                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors group-hover:gap-3"
                                            >
                                                Read Full Article 
                                                <FaArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="flex-1 space-y-8 lg:sticky lg:top-8 lg:self-start">
                    {/* Search Box */}
                    <div className="bg-zinc-900 border border-emerald-900/50 p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <FaSearch className="text-emerald-400 text-xl" />
                            <h3 className="text-xl font-bold text-white">Search Articles</h3>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search articles..." 
                            defaultValue={search}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchParams(e.target.value ? { search: e.target.value } : {});
                                }
                            }}
                            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-500"
                        />
                    </div>

                    {/* Categories */}
                    <div className="bg-zinc-900 border border-emerald-900/50 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            Categories
                        </h3>
                        <div className="space-y-2">
                            <button 
                                onClick={() => setSearchParams({})} 
                                className={`w-full text-left px-6 py-4 rounded-2xl transition-all font-medium ${!category ? 'bg-emerald-600 text-white shadow-md' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                            >
                                All Posts
                            </button>
                            
                            {meta?.categories?.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setSearchParams({ category: cat })} 
                                    className={`w-full text-left px-6 py-4 rounded-2xl transition-all font-medium ${category === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;