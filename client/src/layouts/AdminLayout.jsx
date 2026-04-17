import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Users, BookOpen, Mail, LogOut, Zap, ChevronLeft, ChevronRight, Sun, Moon, Bell, ExternalLink, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/blogs', label: 'Content', icon: BookOpen },
  { to: '/admin/contact', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const loc = useLocation();
  const [col, setCol] = useState(false);

  if (!user || !['admin', 'editor'].includes(user.role)) return <Navigate to="/" replace />;

  const ava = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=14B8A6&color=0A0A0F`;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <motion.aside animate={{ width: col ? 68 : 240 }} transition={{ duration: .25, ease: 'easeOut' }}
        className="relative flex flex-col border-r shrink-0"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', overflow: 'hidden' }}>
        {/* Top accent */}
        <div style={{ height: '2px', background: 'var(--grad-brand)', opacity: .6 }} />

        {/* Logo */}
        <div className="h-[68px] flex items-center px-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded-xl grad-bg flex items-center justify-center anim-glow" style={{ boxShadow: 'var(--sh-teal)' }}>
              <Zap size={16} color="var(--bg)" strokeWidth={2.5} />
            </div>
            <AnimatePresence>
              {!col && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: .2 }}
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', fontSize: '1rem', letterSpacing: '-.02em' }}>
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to || (to !== '/admin' && loc.pathname.startsWith(to));
            return (
              <Link key={to} to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  background: active ? 'var(--teal-bg)' : 'transparent',
                  color: active ? 'var(--teal)' : 'var(--text-3)',
                  fontWeight: active ? 800 : 400, minWidth: 0,
                  border: active ? '1px solid var(--teal-border)' : '1px solid transparent',
                }}>
                <Icon size={17} className="shrink-0" />
                <AnimatePresence>
                  {!col && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}
                      style={{ fontSize: '.875rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {!col && (
          <div className="px-3 pb-2">
            <Link to="/" target="_blank"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
              <ExternalLink size={14} style={{ color: 'var(--teal)' }} /> Visit Site
            </Link>
          </div>
        )}

        {/* User */}
        <div className="border-t p-3 space-y-1" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <img src={ava} alt={user.name} className="w-8 h-8 rounded-xl object-cover shrink-0" style={{ border: '1px solid var(--teal-border)' }} />
            <AnimatePresence>
              {!col && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0 flex-1">
                  <p style={{ fontSize: '.8rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                  <span className={`badge badge-${user.role} text-[9px]`}>{user.role}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition"
            style={{ color: '#F87171', fontFamily: 'var(--font-display)', fontWeight: 700 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={14} className="shrink-0" />{!col && <span>Sign out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCol(!col)}
          className="absolute -right-3 top-[82px] w-6 h-6 rounded-full border flex items-center justify-center transition z-10"
          style={{ background: 'var(--surface)', borderColor: 'var(--border-2)', color: 'var(--text-3)', boxShadow: 'var(--sh-sm)' }}>
          {col ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <div className="h-[68px] border-b flex items-center justify-between px-6 shrink-0"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div />
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-3)' }}>
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-3)' }}>
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--teal)' }} />
            </button>
            <img src={ava} alt={user.name} className="w-8 h-8 rounded-xl object-cover" style={{ border: '1px solid var(--teal-border)' }} />
          </div>
        </div>
        <main className="flex-1 overflow-auto">{<Outlet />}</main>
      </div>

      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border-2)', borderRadius: '12px', fontSize: '.875rem', fontFamily: 'var(--font-body)', boxShadow: 'var(--sh-xl)' },
        success: { iconTheme: { primary: 'var(--teal)', secondary: 'var(--bg)' } },
      }} />
    </div>
  );
}
