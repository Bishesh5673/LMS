import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BASE_URL as base, UPLOAD_URL as imgUrl } from "../services/api";

function Home() {
  const [data, setData] = useState({ banners: [], stats: null, courses: [], tests: [] });
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(true);
  const nav = useNavigate();

  const get = async () => {
    try {
      setLoad(true);
      const [b, s, c, t] = await Promise.all([
        fetch(`${base}/banners`).then(r=>r.json()).catch(()=>({})),
        fetch(`${base}/stats`).then(r=>r.json()).catch(()=>({})),
        fetch(`${base}/courses?featured=true&limit=6`).then(r=>r.json()).catch(()=>({})),
        fetch(`${base}/public/testimonials`).then(r=>r.json()).catch(()=>({}))
      ]);
      setData({ banners: b.data || [], stats: s.data || null, courses: c.courses || [], tests: t.data?.slice(0,3) || [] });
    } catch { alert("Failed to load"); } finally { setLoad(false); }
  };
  useEffect(() => { get(); }, []);

  const searchSubmit = (e) => { e.preventDefault(); if(search) nav(`/courses?search=${search}`); };
  if (load) return <div className="p-8 text-center text-slate-500 font-bold">Loading Sikshya Sadan...</div>;

  return (
    <div className="font-sans bg-black text-white pb-12">
      {/* Hero Section - Dark Green & Black Gradient */}
      <div className="bg-gradient-to-br from-black via-green-950 to-black h-[520px] px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
        <div className="max-w-xl space-y-6 z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            Nepal's Most Affordable <span className="text-emerald-400">IT Training</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Learn from industry experts through live sessions or recorded videos with lifetime access.
          </p>

          <button
            onClick={() => nav("/courses")}
            className="bg-emerald-500 hover:bg-emerald-600 transition-all px-8 py-3.5 rounded-2xl text-lg font-semibold shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95"
          >
            Explore Courses
          </button>
        </div>

        <img
          src="https://codeit.com.np/storage/01KD627JZZ3XY67DDAAYY0RPMQ.avif"
          className="rounded-3xl shadow-2xl w-full  h-[430px] mt-10 md:mt-0 object-cover max-w-md border border-emerald-900/50"
          alt="Hero"
        />

        {/* Subtle green accent glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Search Bar */}
      {/* <div className="max-w-3xl mx-auto -mt-10 relative z-20 px-4 md:px-0">
        <div className="bg-zinc-900 border border-emerald-900/50 p-6 rounded-2xl shadow-2xl">
          <form onSubmit={searchSubmit} className="flex flex-col sm:flex-row gap-4">
            <input 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
              placeholder="Find a course..." 
              className="flex-1 bg-zinc-800 text-white border border-zinc-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-xl p-4 placeholder:text-gray-500 outline-none transition-all" 
            />
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold transition-all active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </div> */}

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-12 my-20 px-6 text-center">
        {[['Enrolled Students', data.stats?.totalStudents], ['Global Courses', data.stats?.totalCourses], ['Expert Instructors', data.stats?.totalInstructors], ['Total Enrollments', data.stats?.totalEnrollments]].map(([label, val]) => (
          <div key={label} className="w-1/2 md:w-auto">
            <h2 className="text-4xl md:text-5xl font-black text-emerald-400 mb-2 tracking-tighter">{val || 'N/A'}</h2>
            <p className="text-zinc-400 font-medium uppercase tracking-widest text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <h2 className="text-center text-4xl font-black text-white mb-12">Our Courses</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {data.courses.slice(0,6).map(c => (
          <div key={c._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-600 transition-all group flex flex-col">
            <img 
              src={`${imgUrl}/${c.thumbnail}`} 
              alt="" 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{c.title}</h3>
              <div className="text-zinc-400 text-sm mb-6">By {c.instructor?.name} | {c.skillLevel}</div>
              
              <div className="flex justify-between items-center mt-auto pt-6 border-t border-zinc-800">
                <span className="font-black text-2xl text-emerald-400">Rs. {c.fee}</span>
                <Link 
                  to={`/courses/${c._id}`} 
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button 
          onClick={() => nav("/courses")} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3.5 rounded-2xl font-bold text-lg transition-all hover:scale-105"
        >
          View All Courses
        </button>
      </div>

      {/* Testimonials */}
      <h2 className="text-center text-4xl font-black text-white mt-28 mb-12">Testimonials</h2>
      <div className="max-w-5xl mx-auto flex flex-wrap gap-8 px-6 justify-center">
        {data.tests.map(t => (
          <div key={t._id} className="flex-1 min-w-[300px] bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl relative flex flex-col items-center text-center">
            <span className="absolute top-6 right-6 text-6xl text-emerald-900/50 font-serif">"</span>
            
            <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden mb-6 border-4 border-emerald-900 flex items-center justify-center text-emerald-400 font-black text-3xl">
              {t.image || t.student?.avatar ? (
                <img src={`${imgUrl}/${t.image || t.student?.avatar}`} alt="" className="w-full h-full object-cover" />
              ) : t.name?.charAt(0)}
            </div>

            <p className="italic text-zinc-300 mb-8 relative z-10 leading-relaxed">"{t.comment}"</p>
            
            <div className="font-bold text-white mt-auto">{t.name}</div>
            <div className="text-emerald-500 font-medium text-xs uppercase tracking-widest mt-1">{t.role}</div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-emerald-900 to-black text-white text-center py-24 px-6 mt-28 border-t border-emerald-800">
        <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">
          Ready to take your IT career to the next level?
        </h2>
        <Link 
          to="/admission" 
          className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 inline-block shadow-xl shadow-green-500/30"
        >
          Apply for Admission
        </Link>
      </div>
    </div>
  );
}

export default Home;