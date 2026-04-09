import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UPLOAD_URL } from "../services/api";

import {
  FaGraduationCap,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
  FaCodepen,
} from "react-icons/fa";

function Navbar() {
  const auth = useAuth();
  const user = auth?.user || null;
  const logout = auth?.logout || (() => {});
  const isAuthenticated = !!auth?.isAuthenticated;
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Blog", path: "/blog" },
    { name: "Jobs", path: "/jobs" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const isHeroPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (hideNavbar) return null;

  const isTransparent = isHeroPage && !scrolled;

  return (
    <>
      {/* NAVBAR */}
      <div
        className={`${isHeroPage ? 'fixed' : 'sticky'} top-0 w-full z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-zinc-950 border-b border-emerald-900"
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 h-16">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FaCodepen className="text-white text-2xl" />
            </div>

            <div>
              <p
                className={`font-black text-2xl tracking-tighter ${
                  isTransparent ? "text-white" : "text-white"
                }`}
              >
                CODE
              </p>
              <p
                className={`text-[10px] font-bold tracking-[3px] text-emerald-400 -mt-1`}
              >
                ACADEMY
              </p>
            </div>
          </NavLink>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-emerald-400 ${
                  location.pathname === link.path
                    ? "text-emerald-400 font-semibold"
                    : isTransparent
                    ? "text-white"
                    : "text-zinc-300"
                }`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* DESKTOP AUTH SECTION */}
          <div className="hidden lg:flex items-center gap-4">

            {isAuthenticated ? (
              <div className="relative group">

                <div
                  className={`flex items-center gap-3 px-5 py-2 rounded-2xl cursor-pointer transition-all hover:bg-zinc-900 border ${
                    isTransparent
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-zinc-900 border-emerald-900 text-white"
                  }`}
                >
                  <div className="h-8 w-8 rounded-xl bg-emerald-700 overflow-hidden flex items-center justify-center text-sm font-bold border border-emerald-600">
                    {user?.avatar ? (
                      <img
                        src={`${UPLOAD_URL}/${user.avatar}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <span className="font-medium">{user?.name}</span>
                  <FaChevronDown size={12} className="text-emerald-400" />
                </div>

                {/* DROPDOWN */}
                <div className="hidden group-hover:flex flex-col absolute right-0 top-full pt-3 w-56 z-50">
                  <div className="bg-zinc-900 border border-emerald-900 rounded-2xl shadow-2xl p-2 text-sm text-zinc-200">
                    <NavLink
                      to={`/${user?.role}/dashboard`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <FaTachometerAlt /> Dashboard
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <FaUser /> Profile
                    </NavLink>

                    {(user?.role === "instructor" || user?.role === "admin") && (
                      <>
                        <NavLink
                          to="/instructor/blogs"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl transition-colors"
                        >
                          Blogs
                        </NavLink>
                        <NavLink
                          to="/instructor/verify-completion"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 rounded-xl transition-colors"
                        >
                          Verify Completion
                        </NavLink>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-950/50 text-red-400 rounded-xl transition-colors w-full text-left"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={`font-medium px-4 py-2 transition-colors ${
                    isTransparent ? "text-white hover:text-emerald-400" : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Sign In
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-semibold transition-all active:scale-95 shadow-lg shadow-emerald-600/30"
                >
                  Enroll Free
                </NavLink>
              </>
            )}

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className={`lg:hidden text-3xl transition-colors ${
              isTransparent ? "text-white" : "text-emerald-400"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-zinc-950 text-white p-6 pt-20 lg:hidden flex flex-col gap-2 overflow-y-auto z-50">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="text-xl font-medium py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink 
                to={`/${user?.role}/dashboard`} 
                className="py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/profile" 
                className="py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>
              {(user?.role === "instructor" || user?.role === "admin") && (
                <>
                  <NavLink 
                    to="/instructor/blogs" 
                    className="py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Blogs
                  </NavLink>
                  <NavLink 
                    to="/instructor/verify-completion" 
                    className="py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Verify Completion
                  </NavLink>
                </>
              )}
              <button 
                onClick={handleLogout} 
                className="text-left py-4 px-2 text-red-400 hover:text-red-500 transition-colors border-b border-zinc-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                className="py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </NavLink>
              <NavLink 
                to="/register" 
                className="py-4 px-2 border-b border-zinc-800 hover:text-emerald-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Create Account
              </NavLink>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;