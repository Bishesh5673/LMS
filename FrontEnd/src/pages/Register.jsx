import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", pw: "", cpw: "", avatar: null });
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.pw !== form.cpw) return alert("Passwords mismatch");
    setLoad(true);
    let res;
    if (form.avatar) {
      const fd = new FormData();
      fd.append("name", form.name); 
      fd.append("email", form.email); 
      fd.append("phone", form.phone);
      fd.append("password", form.pw); 
      fd.append("role", "student"); 
      fd.append("avatar", form.avatar);
      res = await register(fd);
    } else {
      res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.pw, role: "student" });
    }
    if (res.success) nav("/student/dashboard");
    else { 
      alert(res.message || "Failed to register"); 
      setLoad(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 font-sans py-12 bg-zinc-950">
      <div className="w-full max-w-lg bg-zinc-900 p-10 md:p-12 rounded-3xl border border-emerald-900/50 shadow-2xl">
        
        {/* Brand Header */}
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

        <h1 className="text-3xl font-black text-center text-white mb-10">Create Account</h1>

        <form onSubmit={submit} className="space-y-6">
          {['name', 'email', 'phone'].map(f => (
            <div key={f}>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </label>
              <input 
                type={f === 'email' ? 'email' : 'text'} 
                required 
                value={form[f]} 
                onChange={e => setForm({ ...form, [f]: e.target.value })} 
                className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
                placeholder={f === 'phone' ? "+977 98XXXXXXXX" : ""}
              />
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={form.pw} 
                onChange={e => setForm({ ...form, pw: e.target.value })} 
                className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Confirm Password</label>
              <input 
                type="password" 
                required 
                value={form.cpw} 
                onChange={e => setForm({ ...form, cpw: e.target.value })} 
                className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white placeholder:text-zinc-500 transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
              Profile Photo (Optional)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setForm({ ...form, avatar: e.target.files[0] })} 
              className="w-full p-3 text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-950 file:text-emerald-400 hover:file:bg-emerald-900 cursor-pointer border border-zinc-700 rounded-2xl bg-zinc-800" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all mt-6 text-lg shadow-lg shadow-emerald-600/30 active:scale-[0.985]"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-10 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;