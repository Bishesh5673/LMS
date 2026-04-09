import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaWallet, FaMoneyBillWave } from 'react-icons/fa';

const AdminFinance = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalRevenue: 0 });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        adminAPI.getFinancialReports()
            .then(res => { 
                setEnrollments(res.data.data.enrollments || []); 
                setStats({ totalRevenue: res.data.data.totalRevenue || 0 }); 
            })
            .catch(() => alert('Failed to load financial data'))
            .finally(() => setLoading(false));
    }, []);

    const updatePayment = async (id, status) => {
        try {
            await adminAPI.updateEnrollmentPaymentStatus(id, { paymentStatus: status });
            setEnrollments(prev => prev.map(e => e._id === id ? { ...e, paymentStatus: status } : e));
        } catch { 
            alert('Failed to update payment status'); 
        }
    };

    const filtered = enrollments.filter(e => {
        const s = search.toLowerCase();
        return (!s || 
                e.student?.name?.toLowerCase().includes(s) || 
                e.course?.title?.toLowerCase().includes(s)) &&
               (!filter || e.paymentStatus === filter);
    });

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading financial reports...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-4">
                        <FaWallet className="text-emerald-400" /> Financial Reports
                    </h1>
                    <p className="text-zinc-400 mt-2 text-lg">Track payments, revenue, and enrollment status</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <FaMoneyBillWave className="text-4xl text-emerald-400" />
                            <div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400">Total Revenue</div>
                                <div className="text-4xl font-black text-emerald-400 mt-1">
                                    Rs. {stats.totalRevenue.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
                        <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Total Enrollments</div>
                        <div className="text-5xl font-black text-white">{enrollments.length}</div>
                    </div>

                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-8">
                        <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">Pending Payments</div>
                        <div className="text-5xl font-black text-amber-400">
                            {enrollments.filter(e => e.paymentStatus === 'pending').length}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Search student or course..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            className="w-full bg-zinc-900 border border-zinc-700 pl-12 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white placeholder:text-zinc-500"
                        />
                    </div>
                    
                    <select 
                        value={filter} 
                        onChange={e => setFilter(e.target.value)} 
                        className="bg-zinc-900 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                    >
                        <option value="">All Payment Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="installment">Installment</option>
                    </select>
                </div>

                {/* Enrollments Table */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900 border border-emerald-900/30 rounded-3xl">
                        <p className="text-zinc-400 text-xl">No records found.</p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-emerald-900/50 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-950 border-b border-emerald-900/50 text-xs uppercase tracking-widest text-zinc-400">
                                    <th className="p-6 font-black">Student</th>
                                    <th className="p-6 font-black">Course</th>
                                    <th className="p-6 font-black">Amount</th>
                                    <th className="p-6 font-black">Payment Status</th>
                                    <th className="p-6 font-black text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(e => (
                                    <tr key={e._id} className="border-b border-zinc-800 hover:bg-zinc-800/70 transition-colors last:border-0">
                                        <td className="p-6">
                                            <div className="font-bold text-white">{e.student?.name}</div>
                                            <div className="text-sm text-zinc-400 mt-1">{e.student?.email}</div>
                                        </td>
                                        <td className="p-6 text-white">{e.course?.title}</td>
                                        <td className="p-6 font-bold text-emerald-400">
                                            Rs. {e.course?.fee?.toLocaleString()}
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-block px-6 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest
                                                ${e.paymentStatus === 'completed' ? 'bg-emerald-900 text-emerald-400' : 
                                                  e.paymentStatus === 'pending' ? 'bg-amber-900 text-amber-400' : 
                                                  e.paymentStatus === 'installment' ? 'bg-blue-900 text-blue-400' : 
                                                  'bg-red-900 text-red-400'}`}>
                                                {e.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            {e.paymentStatus === 'pending' && (
                                                <div className="flex justify-center gap-4">
                                                    <button 
                                                        onClick={() => updatePayment(e._id, 'completed')} 
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                        title="Mark as Completed"
                                                    >
                                                        <FaCheckCircle size={24} />
                                                    </button>
                                                    <button 
                                                        onClick={() => updatePayment(e._id, 'failed')} 
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Mark as Failed"
                                                    >
                                                        <FaTimesCircle size={24} />
                                                    </button>
                                                </div>
                                            )}
                                            {e.paymentStatus === 'completed' && (
                                                <span className="text-emerald-400 text-sm font-medium">✓ Settled</span>
                                            )}
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

export default AdminFinance;