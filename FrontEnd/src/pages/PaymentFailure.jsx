import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { FaExclamationTriangle, FaRedo, FaHeadset } from 'react-icons/fa';

const PaymentFailure = () => {
    const [params] = useSearchParams();
    const nav = useNavigate();
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const esewaData = params.get('data');
        const handleFailure = async () => {
            if (esewaData && token) {
                try {
                    const decoded = JSON.parse(atob(esewaData));
                    if (decoded.transaction_uuid) {
                        const res = await paymentAPI.getPaymentStatus(decoded.transaction_uuid);
                        if (res.data.success) setData(res.data.data);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            setLoading(false);
        };

        handleFailure();
    }, [params, token]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="text-zinc-400">Processing failure details...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 rounded-3xl p-12 text-center">
                <div className="w-24 h-24 mx-auto bg-red-950 rounded-2xl flex items-center justify-center mb-8">
                    <FaExclamationTriangle className="text-5xl text-red-400" />
                </div>

                <h1 className="text-4xl font-black text-white mb-3">Payment Failed</h1>
                <p className="text-red-400 text-lg mb-10">Your payment could not be processed at this time.</p>

                {data?.course && (
                    <div className="bg-zinc-950 border border-red-900/30 rounded-2xl p-8 mb-10 text-left">
                        <div className="space-y-5">
                            <div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Course</div>
                                <div className="text-white font-semibold text-xl mt-1">{data.course.title}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Amount Attempted</div>
                                <div className="text-red-400 text-3xl font-black mt-1">
                                    Rs. {data.amount || data.totalAmount}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {data?.course ? (
                        <button 
                            onClick={() => nav('/admission', { state: { courseId: data.course._id } })}
                            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all"
                        >
                            <FaRedo /> Retry Payment
                        </button>
                    ) : (
                        <button 
                            onClick={() => nav('/courses')}
                            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all"
                        >
                            <FaRedo /> Try Again
                        </button>
                    )}

                    <Link 
                        to="/contact" 
                        className="flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        <FaHeadset /> Contact Support
                    </Link>
                </div>

                <p className="text-xs text-zinc-500 mt-10">
                    If the issue persists, please contact our support team.
                </p>
            </div>
        </div>
    );
};

export default PaymentFailure;