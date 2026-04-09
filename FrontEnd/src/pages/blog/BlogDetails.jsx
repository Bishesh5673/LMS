import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaChevronLeft, FaEye, FaFacebook, FaTwitter, FaLinkedin, FaQuoteRight } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../../services/api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await publicAPI.getBlogBySlug(slug);
                setBlog(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
            <div className="text-center">
                <h2 className="text-4xl font-black">Article Not Found</h2>
                <Link to="/blog" className="text-emerald-400 hover:text-emerald-300 mt-6 inline-block">← Back to Blog</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-zinc-950 text-white min-h-screen">
            {/* Top Navigation Bar */}
            <div className="bg-zinc-900 border-b border-emerald-900/50 sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
                    <Link 
                        to="/blog" 
                        className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 font-semibold transition-colors"
                    >
                        <FaChevronLeft /> Back to Blog
                    </Link>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="hidden md:flex items-center gap-2 text-zinc-400">
                            <FaEye className="text-emerald-400" /> 
                            {blog.views || 0} Views
                        </div>
                        <div className="h-5 w-px bg-zinc-700 hidden md:block"></div>
                        <div className="flex gap-5">
                            <button className="hover:text-blue-400 transition-colors"><FaFacebook size={22} /></button>
                            <button className="hover:text-sky-400 transition-colors"><FaTwitter size={22} /></button>
                            <button className="hover:text-indigo-400 transition-colors"><FaLinkedin size={22} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-6 pt-16 pb-24">
                {/* Category & Title */}
                <div className="text-center mb-12">
                    <span className="inline-block px-6 py-2 bg-emerald-900 text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                        {blog.category}
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-white">
                        {blog.title}
                    </h1>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap justify-center gap-10 mb-16 text-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl border border-emerald-900">
                            {blog.author?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Written by</p>
                            <p className="font-semibold text-white">{blog.author?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-900/30 flex items-center justify-center text-emerald-400 text-2xl">
                            <FaCalendarAlt />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Published</p>
                            <p className="font-semibold text-white">
                                {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-16 rounded-3xl overflow-hidden border border-emerald-900/30 shadow-2xl">
                    <img
                        src={blog.thumbnail ? `${UPLOAD_URL}/${blog.thumbnail}` : 'https://picsum.photos/id/1015/1200/600'}
                        className="w-full h-auto object-cover"
                        alt={blog.title}
                    />
                </div>

                {/* Article Content */}
                <div 
                    className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-white prose-headings:font-black 
                        prose-p:text-zinc-300 prose-strong:text-white
                        prose-a:text-emerald-400 hover:prose-a:text-emerald-300
                        prose-blockquote:border-l-emerald-500 prose-blockquote:text-zinc-400
                        prose-code:bg-zinc-900 prose-code:text-emerald-300"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-20 flex flex-wrap gap-3">
                        {blog.tags.map(tag => (
                            <span 
                                key={tag} 
                                className="px-6 py-3 bg-zinc-900 border border-zinc-700 text-emerald-400 rounded-2xl text-sm font-medium hover:bg-emerald-900 hover:border-emerald-600 transition-all cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Author Bio */}
                <div className="mt-24 bg-zinc-900 border border-emerald-900/50 rounded-3xl p-12">
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="h-28 w-28 rounded-3xl bg-zinc-800 border-4 border-emerald-900 flex items-center justify-center text-5xl font-black text-emerald-400 flex-shrink-0">
                            {blog.author?.name?.charAt(0) || '?'}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-black text-white mb-4">
                                About {blog.author?.name}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-lg">
                                {blog.author?.bio || `${blog.author?.name} is a passionate tech educator and contributor at Code Academy.`}
                            </p>
                        </div>
                    </div>
                </div>
            </article>

            {/* Newsletter / CTA */}
            <div className="border-t border-emerald-900/30 bg-zinc-900 py-20">
                <div className="max-w-2xl mx-auto text-center px-6">
                    <h3 className="text-3xl font-black mb-4">Stay in the Loop</h3>
                    <p className="text-zinc-400 mb-10">Get the latest tech insights and tutorials delivered to your inbox.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className="flex-1 bg-zinc-800 border border-zinc-700 p-5 rounded-2xl focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-500" 
                        />
                        <button className="bg-emerald-600 hover:bg-emerald-500 px-10 py-5 rounded-2xl font-bold transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;