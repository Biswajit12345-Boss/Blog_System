import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    const r = await login(form.email, form.password);
    setLoading(false);
    if (r.success) { toast.success('Welcome back!'); nav('/'); }
    else toast.error(r.message);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,.12) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 65%)', filter: 'blur(50px)' }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl grad-bg mx-auto mb-7 flex items-center justify-center anim-glow">
            <Zap size={32} color="#0A0A0F" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-.03em' }}>
            Good to see<br />you again
          </h2>
          <p style={{ color: 'var(--text-3)', lineHeight: 1.75, fontSize: '.95rem' }}>
            Thousands of stories are waiting to illuminate your day.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-9">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-7 h-7 rounded-lg grad-bg flex items-center justify-center"><Zap size={14} color="#0A0A0F" /></div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>Luminary</span>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '.5rem', letterSpacing: '-.03em' }}>Sign in</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '.9rem' }}>New here? <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 700 }}>Create an account</Link></p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="inp" placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  className="inp" placeholder="Your password" style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70" style={{ color: 'var(--text-3)' }}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
              className="btn-primary w-full mt-6" style={{ fontSize: '1rem', padding: '1rem' }}>
              {loading ? 'Signing in…' : <><span>Continue</span><ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
