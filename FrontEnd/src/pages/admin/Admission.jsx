import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../services/api';
import { usePayment } from '../../hooks/usePayment';
import { FaUserPlus, FaCheckCircle, FaCreditCard, FaWallet } from 'react-icons/fa';

const Admission = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { processPayment, loading: paying, error: payErr } = usePayment();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [form, setForm] = useState({ 
        courseId: location.state?.courseId || '', 
        paymentMethod: 'esewa', 
        installmentPlanId: '' 
    });

    const selected = courses.find(c => c._id === form.courseId);

    useEffect(() => {
        if (!user) { 
            navigate('/login', { state: { from: '/admission' } }); 
            return; 
        }
        courseAPI.getAllCourses()
            .then(res => setCourses(res.data.courses || []))
            .catch(() => setErr('Failed to load courses'))
            .finally(() => setLoading(false));
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.courseId) return setErr('Please select a course');
        setErr('');
        try { 
            await processPayment(form.paymentMethod, form.courseId, form.installmentPlanId); 
        }
        catch { 
            setErr('Payment failed. Please try again.'); 
        }
    };

    if (loading) return (
        <div className="p-12 text-center text-zinc-400 font-bold min-h-[50vh] bg-zinc-950">
            Loading admission form...
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white py-12 px-6 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-6">
                        <FaUserPlus className="text-3xl" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">Admission Form</h1>
                    <p className="text-zinc-400 mt-3 text-lg">Choose your course and complete secure enrollment</p>
                </div>

                {(err || payErr) && (
                    <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-2xl mb-8 text-center">
                        ⚠️ {err || payErr}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-zinc-900 border border-emerald-900/50 rounded-3xl p-10 shadow-2xl">
                    
                    {/* Student Info */}
                    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 mb-8">
                        <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Enrolling As</div>
                        <p className="font-semibold text-lg text-white">{user?.name}</p>
                        <p className="text-emerald-400 text-sm">{user?.email}</p>
                    </div>

                    {/* Course Selection */}
                    <div className="mb-8">
                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">Select Course</label>
                        <select 
                            value={form.courseId} 
                            onChange={e => setForm({ ...form, courseId: e.target.value })} 
                            required 
                            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 text-white"
                        >
                            <option value="">-- Choose a Program --</option>
                            {courses.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.title} — Rs. {c.fee}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Installment Options */}
                    {selected?.installmentAvailable && (
                        <div className="mb-8">
                            <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Payment Plan</label>
                            <div className="space-y-3">
                                <label className="flex items-center gap-4 bg-zinc-800 border border-zinc-700 hover:border-emerald-600 p-5 rounded-2xl cursor-pointer transition-all">
                                    <input 
                                        type="radio" 
                                        name="plan" 
                                        value="" 
                                        checked={form.installmentPlanId === ''} 
                                        onChange={() => setForm({ ...form, installmentPlanId: '' })} 
                                        className="accent-emerald-500"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">Full Payment</div>
                                        <div className="text-emerald-400">Rs. {selected.fee}</div>
                                    </div>
                                </label>

                                {selected.installmentPlans?.map(p => (
                                    <label key={p._id} className="flex items-center gap-4 bg-zinc-800 border border-zinc-700 hover:border-emerald-600 p-5 rounded-2xl cursor-pointer transition-all">
                                        <input 
                                            type="radio" 
                                            name="plan" 
                                            value={p._id} 
                                            checked={form.installmentPlanId === p._id} 
                                            onChange={() => setForm({ ...form, installmentPlanId: p._id })} 
                                            className="accent-emerald-500"
                                        />
                                        <div>
                                            <div className="font-semibold text-white">{p.numberOfInstallments} Installments</div>
                                            <div className="text-emerald-400">Rs. {p.amountPerInstallment} / month</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment Method */}
                    <div className="mb-10">
                        <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Payment Method</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { val: 'esewa', label: 'eSewa', color: 'bg-emerald-600' },
                                { val: 'khalti', label: 'Khalti', color: 'bg-violet-600' },
                                { val: 'stripe', label: 'Card / Stripe', icon: <FaCreditCard /> },
                            ].map(m => (
                                <label 
                                    key={m.val} 
                                    className={`cursor-pointer border-2 rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3
                                        ${form.paymentMethod === m.val 
                                            ? 'border-emerald-500 bg-emerald-950' 
                                            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900'}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        value={m.val} 
                                        checked={form.paymentMethod === m.val} 
                                        onChange={() => setForm({ ...form, paymentMethod: m.val })} 
                                        className="hidden"
                                    />
                                    {m.icon ? (
                                        <div className="text-3xl text-white">{m.icon}</div>
                                    ) : (
                                        <div className={`${m.color} text-white px-6 py-2 rounded-xl font-bold`}>{m.label}</div>
                                    )}
                                    <span className="font-medium text-sm text-white">{m.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="bg-zinc-800 border border-emerald-900/50 rounded-2xl p-7 mb-10">
                        <div className="text-emerald-400 text-sm font-bold tracking-widest mb-4">WHAT YOU GET</div>
                        {['Pro Industrial Syllabus', 'Live Project Experience', 'Global Certification', 'Lifetime Access'].map(f => (
                            <div key={f} className="flex items-center gap-3 text-zinc-300 py-2">
                                <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={paying} 
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white font-bold py-5 rounded-2xl text-lg transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.985]"
                    >
                        {paying ? 'Redirecting to Payment...' : 'Proceed to Secure Payment'}
                    </button>

                    <p className="text-center text-xs text-zinc-500 mt-6">
                        🔒 Secure 256-bit SSL encrypted payment
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Admission;