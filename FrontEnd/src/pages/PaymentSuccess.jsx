import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { FaCheckCircle, FaArrowRight, FaTrophy } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const { token } = useAuth();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [data, setData] = useState(null);
    const [count, setCount] = useState(5);

    useEffect(() => {
        const verify = async () => {
            const esewa = params.get('data');
            const stripe = params.get('session_id');
            const pidx = params.get('pidx');
            const eid = params.get('enrollmentId');

            try {
                let res;
                if (esewa) {
                    res = await paymentAPI.verifyEsewa({ data: esewa });
                } else if (stripe) {
                    res = await paymentAPI.verifyStripe({ sessionId: stripe, enrollmentId: eid });
                } else if (pidx) {
                    res = await paymentAPI.verifyKhalti({ pidx, enrollmentId: eid });
                } else if (eid) {
                    res = await paymentAPI.getPaymentStatus(eid);
                } else {
                    return setErr('Invalid payment request');
                }

                if (res?.data?.success) {
                    setData(res.data.enrollment || res.data.data);
                } else {
                    setErr(res?.data?.message || 'Payment verification failed');
                }
            } catch (e) {
                setErr(e.response?.data?.message || 'Verification error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (params.get('data') || token) {
            verify();
        } else {
            setErr('Please log in to view payment status');
            setLoading(false);
        }
    }, [params, token]);

    // Auto redirect countdown
    useEffect(() => {
        if (!loading && !err && count > 0) {
            const timer = setInterval(() => {
                setCount(prev => {
                    if (prev <= 1) {
                        nav('/student/dashboard');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [loading, err, count, nav]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 mx-auto mb-6"></div>
                <p className="text-zinc-400 text-xl">Verifying your payment...</p>
            </div>
        </div>
    );

    if (err) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 rounded-3xl p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-red-950 rounded-2xl flex items-center justify-center text-4xl mb-8">❌</div>
                <h2 className="text-3xl font-black text-white mb-4">Payment Failed</h2>
                <p className="text-red-400 mb-10">{err}</p>
                <Link 
                    to="/courses" 
                    className="inline-block w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all"
                >
                    Back to Courses
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-emerald-900/50 rounded-3xl p-12 text-center">
                <div className="w-24 h-24 mx-auto bg-emerald-900/50 rounded-full flex items-center justify-center mb-8">
                    <FaCheckCircle className="text-6xl text-emerald-400" />
                </div>

                <h1 className="text-4xl font-black text-white mb-3">Payment Successful!</h1>
                <p className="text-emerald-400 text-lg mb-10">Thank you for your purchase</p>

                {data && (
                    <div className="bg-zinc-950 border border-emerald-900/30 rounded-2xl p-8 mb-10 text-left">
                        <div className="space-y-5">
                            <div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Course</div>
                                <div className="text-white font-semibold text-xl mt-1">{data.course?.title}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Amount Paid</div>
                                <div className="text-emerald-400 text-3xl font-black mt-1">
                                    Rs. {data.paidAmount || data.totalAmount || data.amount}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Status</div>
                                <div className="text-emerald-400 font-medium capitalize mt-1">{data.paymentStatus || 'Completed'}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-zinc-400 mb-8">
                    Redirecting to your dashboard in <span className="text-emerald-400 font-bold">{count}</span> seconds...
                </div>

                <Link 
                    to="/student/dashboard" 
                    className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-12 rounded-2xl transition-all w-full justify-center"
                >
                    Go to Dashboard Now <FaArrowRight />
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;