import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, PenLine, Menu, X, Search, LogOut, LayoutDashboard, Shield, ChevronDown, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const loc = useLocation();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { setMobile(false); setDrop(false); }, [loc.pathname]);
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDrop(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Explore' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const ava = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=14B8A6&color=0A0A0F&bold=true`;
  const isAdmin = ['admin', 'editor'].includes(user?.role);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10,10,15,.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : '1px solid transparent',
        }}>
        {/* Scan line effect */}
        {!scrolled && <div className="scan-line" style={{ height: '100%', top: 0 }} />}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8 rounded-lg grad-bg flex items-center justify-center anim-glow"
              style={{ boxShadow: 'var(--sh-teal)' }}>
              <Zap size={16} color="#0A0A0F" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-.02em' }}>
              Lumin<span className="grad-text">ary</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ to, label }) => {
              const active = loc.pathname === to;
              return (
                <Link key={to} to={to}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden group"
                  style={{ color: active ? 'var(--teal)' : 'var(--text-2)' }}>
                  {active && <div className="absolute inset-0 rounded-lg" style={{ background: 'var(--teal-bg)', border: '1px solid var(--teal-border)' }} />}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => nav('/search')}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-3)' }}>
              <Search size={17} />
            </button>
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-3)' }}>
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: .2 }}>
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {user ? (
              <>
                <Link to="/write"
                  className="btn-primary text-sm px-4 py-2"
                  style={{ fontSize: '.85rem', padding: '.5rem 1rem', borderRadius: 'var(--r-md)' }}>
                  <PenLine size={14} /> Write
                </Link>
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDrop(!drop)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition hover:bg-[var(--surface-2)]"
                    style={{ border: '1px solid var(--border)' }}>
                    <img src={ava} alt={user.name} className="w-7 h-7 rounded-lg object-cover" />
                    <ChevronDown size={12} style={{ color: 'var(--text-3)' }} />
                  </button>
                  <AnimatePresence>
                    {drop && (
                      <motion.div initial={{ opacity: 0, y: -10, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .95 }} transition={{ duration: .15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl overflow-hidden"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-xl)' }}>
                        <div className="p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-3)' }}>
                          <div className="flex items-center gap-3">
                            <img src={ava} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{user.name}</p>
                              <span className={`badge badge-${user.role} text-[10px]`}>{user.role}</span>
                            </div>
                          </div>
                        </div>
                        {[
                          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                          ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
                        ].map(({ to, icon: Icon, label }) => (
                          <Link key={to} to={to}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-[var(--surface-3)]"
                            style={{ color: 'var(--text-2)' }}>
                            <Icon size={15} style={{ color: 'var(--teal)' }} /> {label}
                          </Link>
                        ))}
                        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                          <button onClick={logout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm w-full transition hover:bg-red-950/30"
                            style={{ color: '#F87171' }}>
                            <LogOut size={15} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm" style={{ padding: '.5rem 1rem', fontSize: '.85rem' }}>Sign in</Link>
                <Link to="/register" className="btn-primary text-sm" style={{ padding: '.5rem 1rem', fontSize: '.85rem' }}>Get started</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobile(!mobile)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--surface-2)', color: 'var(--text)' }}>
            {mobile ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .2 }}
            className="fixed top-[68px] left-0 right-0 z-40 border-b"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--sh-lg)' }}>
            <div className="p-4 space-y-1">
              {links.map(({ to, label }) => (
                <Link key={to} to={to} className="block px-4 py-3 rounded-xl text-sm font-medium transition hover:bg-[var(--surface-2)]"
                  style={{ color: 'var(--text)' }}>{label}</Link>
              ))}
              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button onClick={toggleTheme} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                {user ? (
                  <>
                    <Link to="/write" className="btn-primary flex-1 text-center text-sm" style={{ fontSize: '.85rem' }}>Write</Link>
                    <button onClick={logout} className="btn-ghost px-3 text-sm" style={{ color: '#F87171', borderColor: 'rgba(248,113,113,.2)' }}>Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-ghost flex-1 text-center text-sm" style={{ fontSize: '.85rem' }}>Sign in</Link>
                    <Link to="/register" className="btn-primary flex-1 text-center text-sm" style={{ fontSize: '.85rem' }}>Get started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
