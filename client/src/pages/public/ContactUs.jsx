import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { sendContact } from '../../services/api';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await sendContact(form); toast.success("Message sent!"); setForm({ name: '', email: '', phone: '', message: '' }); }
    catch { toast.error('Failed to send'); }
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', paddingTop: '120px', paddingBottom: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-5%', width: '40%', height: '150%', background: 'radial-gradient(ellipse, rgba(20,184,166,.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '.75rem', letterSpacing: '-.04em' }}>
            Get in Touch
          </motion.h1>
          <p style={{ color: 'var(--text-3)' }}>We'd love to hear from you. Reply within 24h.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: 'Email', val: 'hello@luminary.io', sub: 'Fastest reply' },
              { icon: MapPin, label: 'Location', val: 'Mumbai, India', sub: 'Global community' },
              { icon: Clock, label: 'Hours', val: 'Mon–Fri, 9–6 IST', sub: 'Quick responses' },
            ].map(({ icon: Icon, label, val, sub }) => (
              <div key={label} className="flex gap-4 p-5 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
                <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center shrink-0" style={{ boxShadow: 'var(--sh-teal)' }}>
                  <Icon size={16} color="#0A0A0F" />
                </div>
                <div>
                  <p style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-3)' }}>{label}</p>
                  <p style={{ fontWeight: 700, color: 'var(--text)', marginTop: '.2rem', fontFamily: 'var(--font-display)' }}>{val}</p>
                  <p style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-md)' }}>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[['name', 'Name', 'text', 'Jane Doe'], ['email', 'Email', 'email', 'you@example.com']].map(([k, l, t, ph]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</label>
                      <input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required placeholder={ph} className="inp" />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} required placeholder="Tell us how we can help…"
                    className="inp" style={{ resize: 'none' }} />
                </div>
                <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
                  className="btn-primary" style={{ padding: '.875rem 2rem' }}>
                  <Send size={15} />{loading ? 'Sending…' : 'Send message'}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
