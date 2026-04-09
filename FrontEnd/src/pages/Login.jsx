import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, set] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const res = await login(email, pw);
    if (res.success) {
      if (res.user.role === "admin") nav("/admin/dashboard");
      else if (res.user.role === "instructor") nav("/instructor/dashboard");
      else nav("/student/dashboard");
    } else {
      alert(res.message || "Failed to login");
      setLoad(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 font-sans bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 p-10 rounded-3xl border border-emerald-900/50 shadow-2xl">
        
        {/* Logo / Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-black">C</span>
            </div>
            <div>
              <p className="font-black text-3xl tracking-tighter text-white">CODE</p>
              <p className="text-[10px] font-bold tracking-widest text-emerald-400 -mt-1">ACADEMY</p>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-center text-white mb-10">
          Welcome Back
        </h1>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => set(e.target.value)} 
              className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={pw} 
              onChange={e => setPw(e.target.value)} 
              className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all mt-6 text-lg shadow-lg shadow-emerald-600/30 active:scale-[0.985]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-10 text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link 
            to="/register" 
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;