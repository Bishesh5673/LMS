import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI, UPLOAD_URL } from "../services/api";

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef(null);
  
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [loading, setLoad] = useState(false);

  const changePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData(); 
      fd.append("avatar", file);
      const res = await authAPI.updateProfile(fd);
      if (res.data?.user) updateUser(res.data.user);
      alert("Photo updated successfully!");
    } catch { 
      alert("Failed to upload photo"); 
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const res = await authAPI.updateProfile(form);
      if (res.data?.user) updateUser(res.data.user);
      alert("Profile updated successfully!");
    } catch { 
      alert("Failed to update profile"); 
    }
    finally { 
      setLoad(false); 
    }
  };

  const handleLogout = () => { 
    logout(); 
    nav("/login"); 
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4 font-sans bg-zinc-950 min-h-screen pb-20">
      <div className="bg-zinc-900 p-10 md:p-12 rounded-3xl border border-emerald-900/50 shadow-2xl">
        
        <h1 className="text-4xl font-black text-center text-white mb-10 tracking-tight">My Profile</h1>
        
        {/* Profile Photo Section */}
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 pb-12 border-b border-zinc-800">
          <div className="w-32 h-32 rounded-3xl bg-zinc-800 border-4 border-emerald-900 overflow-hidden flex justify-center items-center text-5xl font-black text-emerald-400 shadow-inner">
            {user?.avatar ? (
              <img 
                src={`${UPLOAD_URL}/${user.avatar}`} 
                alt="avatar" 
                className="w-full h-full object-cover" 
              />
            ) : (
              user?.name?.charAt(0) || "U"
            )}
          </div>
          
          <div className="text-center sm:text-left">
            <button 
              onClick={() => fileRef.current?.click()} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
            >
              Change Photo
            </button>
            <input 
              type="file" 
              ref={fileRef} 
              accept="image/*" 
              onChange={changePhoto} 
              className="hidden" 
            />
            
            <div className="mt-6 text-xs font-black uppercase tracking-widest text-zinc-400">
              Role: <span className="text-emerald-400 font-medium">{user?.role || "Student"}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-8">
          <div>
            <label className="block font-black text-xs uppercase tracking-widest text-zinc-400 mb-3">Email (Read Only)</label>
            <input 
              type="email" 
              value={user?.email || ""} 
              readOnly 
              className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl text-zinc-400 font-medium cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block font-black text-xs uppercase tracking-widest text-zinc-400 mb-3">Full Name</label>
            <input 
              type="text" 
              required 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white font-medium transition-all" 
            />
          </div>

          <div>
            <label className="block font-black text-xs uppercase tracking-widest text-zinc-400 mb-3">Phone Number</label>
            <input 
              type="text" 
              value={form.phone} 
              onChange={e => setForm({ ...form, phone: e.target.value })} 
              className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-white font-medium transition-all" 
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-zinc-800">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white p-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.985]"
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
            
            <button 
              type="button" 
              onClick={handleLogout} 
              className="flex-1 bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-300 p-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.985]"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;