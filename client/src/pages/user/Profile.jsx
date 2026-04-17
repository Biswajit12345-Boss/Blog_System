import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Twitter, Github, Linkedin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', bio: user?.bio || '', website: user?.website || '', avatar: user?.avatar || '',
    socialLinks: { twitter: user?.socialLinks?.twitter || '', linkedin: user?.socialLinks?.linkedin || '', github: user?.socialLinks?.github || '' }
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('profile');

  const ava = form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=14B8A6&color=0A0A0F&size=128`;

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await updateProfile(form); updateUser(data); toast.success('Profile updated!'); }
    catch { toast.error('Failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <img src={ava} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover" style={{ border: '1px solid var(--teal-border)', boxShadow: 'var(--sh-teal)' }} />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ background: '#22C55E', borderColor: 'var(--bg)' }}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>{user?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge badge-${user?.role}`}>{user?.role}</span>
              <span style={{ color: 'var(--text-3)', fontSize: '.78rem' }}>{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
          {[['profile', 'Profile'], ['social', 'Social Links']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className="px-5 py-3 text-sm font-bold border-b-2 -mb-px transition"
              style={{ color: tab === k ? 'var(--teal)' : 'var(--text-3)', borderColor: tab === k ? 'var(--teal)' : 'transparent' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          {tab === 'profile' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-6 space-y-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Display Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="inp" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Avatar URL</label>
                <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                  <input type="url" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} placeholder="https://…" className="inp" style={{ flex: 1 }} />
                  {form.avatar && <img src={form.avatar} alt="preview" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Tell readers about yourself…" className="inp" style={{ resize: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>Website</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://yoursite.com" className="inp" style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-6 space-y-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
              {[
                { k: 'twitter', icon: Twitter, l: 'Twitter / X', ph: 'https://twitter.com/username' },
                { k: 'linkedin', icon: Linkedin, l: 'LinkedIn', ph: 'https://linkedin.com/in/username' },
                { k: 'github', icon: Github, l: 'GitHub', ph: 'https://github.com/username' },
              ].map(({ k, icon: Icon, l, ph }) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                    <input type="url" value={form.socialLinks[k]} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, [k]: e.target.value } })}
                      placeholder={ph} className="inp" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          <motion.button type="submit" disabled={loading} whileTap={{ scale: .98 }}
            className="btn-primary mt-5" style={{ fontSize: '.9rem' }}>
            <Save size={15} />{loading ? 'Saving…' : 'Save Changes'}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
