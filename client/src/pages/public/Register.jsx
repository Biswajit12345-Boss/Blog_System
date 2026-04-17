import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PERKS = ['Publish unlimited stories', 'Rich editor with image upload', 'Analytics dashboard', 'Comments & community'];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const r = await register(form.name, form.email, form.password);
    setLoading(false);
    if (r.success) { toast.success('Welcome to Luminary!'); nav('/'); }
    else toast.error(r.message);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Left info panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center relative overflow-hidden p-14"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,.10) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center" style={{ boxShadow: 'var(--sh-teal)' }}><Zap size={16} color="#0A0A0F" /></div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '-.02em' }}>Luminary</span>
          </Link>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.05, letterSpacing: '-.04em' }}>
            Your writing<br />journey<br /><span className="grad-text">starts now</span>
          </h2>
          <p style={{ color: 'var(--text-3)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
            Join thousands of writers crafting stories that define tomorrow.
          </p>
          <div className="space-y-3">
            {PERKS.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 grad-bg" style={{ boxShadow: 'var(--sh-teal)' }}>
                  <Check size={11} color="#0A0A0F" strokeWidth={3} />
                </div>
                <span style={{ fontSize: '.9rem', color: 'var(--text-2)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-9">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '.5rem', letterSpacing: '-.03em' }}>Create account</h1>
            <p style={{ color: 'var(--text-3)', fontSize: '.9rem' }}>Already a writer? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 700 }}>Sign in</Link></p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {[
              { k: 'name', l: 'Full Name', t: 'text', ph: 'Jane Doe' },
              { k: 'email', l: 'Email', t: 'email', ph: 'you@example.com' },
            ].map(({ k, l, t, ph }) => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required className="inp" placeholder={ph} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '.82rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  className="inp" placeholder="Min 6 characters" style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <p style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>
              By joining you agree to our <a href="#" style={{ color: 'var(--teal)' }}>Terms</a> & <a href="#" style={{ color: 'var(--teal)' }}>Privacy Policy</a>.
            </p>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
              className="btn-primary w-full mt-2" style={{ fontSize: '1rem', padding: '1rem' }}>
              {loading ? 'Creating account…' : <><span>Create account</span><ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
