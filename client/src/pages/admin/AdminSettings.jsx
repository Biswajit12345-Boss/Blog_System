import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Palette, Globe, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Luminary', tagline: 'Stories that illuminate the world',
    accentColor: '#14B8A6', registration: true, comments: true,
    notifications: true, maintenance: false,
  });

  const save = () => toast.success('Settings saved!');

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', letterSpacing: '-.02em' }}>Site Settings</h1>
      <div className="space-y-5">
        {[
          { icon: Globe, title: 'General', content: (
            <div className="space-y-4">
              {[['Site Name', 'siteName', 'text', 'Luminary'], ['Tagline', 'tagline', 'text', 'Your tagline here']].map(([l, k, t, ph]) => (
                <div key={k}>
                  <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 800, color: 'var(--text-3)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</label>
                  <input type={t} value={settings[k]} onChange={e => setSettings({ ...settings, [k]: e.target.value })} placeholder={ph} className="inp" />
                </div>
              ))}
            </div>
          )},
          { icon: Palette, title: 'Appearance', content: (
            <div className="flex items-center gap-4">
              <label style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text-2)' }}>Brand Color</label>
              <input type="color" value={settings.accentColor} onChange={e => setSettings({ ...settings, accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-0" style={{ background: 'transparent' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.85rem', color: 'var(--text-3)' }}>{settings.accentColor}</span>
            </div>
          )},
          { icon: Bell, title: 'Features', content: (
            <div className="space-y-4">
              {[['registration', 'Allow public registration'], ['comments', 'Enable comments'], ['notifications', 'Email notifications'], ['maintenance', 'Maintenance mode']].map(([k, label]) => (
                <div key={k} className="flex items-center justify-between">
                  <span style={{ fontSize: '.875rem', color: 'var(--text-2)' }}>{label}</span>
                  <button onClick={() => setSettings(s => ({ ...s, [k]: !s[k] }))}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200"
                    style={{ background: settings[k] ? 'var(--teal)' : 'var(--surface-3)', boxShadow: settings[k] ? 'var(--sh-teal)' : 'none' }}>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200"
                      style={{ transform: settings[k] ? 'translateX(20px)' : 'translateX(0)' }} />
                  </button>
                </div>
              ))}
            </div>
          )},
        ].map(({ icon: Icon, title, content }) => (
          <div key={title} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
              <div className="w-8 h-8 rounded-lg grad-bg flex items-center justify-center" style={{ boxShadow: 'var(--sh-teal)' }}><Icon size={15} color="var(--bg)" /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', fontSize: '.95rem' }}>{title}</h3>
            </div>
            <div className="p-5">{content}</div>
          </div>
        ))}
        <button onClick={save} className="btn-primary" style={{ fontSize: '.9rem' }}>
          <Save size={15} /> Save Settings
        </button>
      </div>
    </div>
  );
}
