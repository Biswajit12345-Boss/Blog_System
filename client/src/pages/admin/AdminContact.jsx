import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Inbox } from 'lucide-react';
import api from '../../services/api';

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contact').then(({ data }) => { setContacts(data.data || data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>Messages</h1>
        <p style={{ color: 'var(--text-3)', fontSize: '.85rem' }}>{contacts.length} messages</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
          <Inbox size={40} style={{ color: 'var(--text-3)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>No messages yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-2">
            {contacts.map((c, i) => (
              <motion.button key={i} onClick={() => setSelected(c)}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                className="w-full text-left p-4 rounded-2xl border transition"
                style={{ background: selected === c ? 'var(--teal-bg)' : 'var(--surface)', borderColor: selected === c ? 'var(--teal-border)' : 'var(--border)', boxShadow: selected === c ? 'var(--sh-teal)' : 'var(--sh-sm)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold grad-bg" style={{ color: 'var(--bg)' }}>
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: '.85rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <p style={{ fontSize: '.72rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</p>
                  </div>
                  <p style={{ fontSize: '.68rem', color: 'var(--text-3)', flexShrink: 0 }}>{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <p style={{ fontSize: '.82rem', color: 'var(--text-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.message}</p>
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl p-6 h-full"
                style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-md)' }}>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold grad-bg" style={{ color: 'var(--bg)', boxShadow: 'var(--sh-teal)' }}>
                    {selected.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', fontSize: '1.1rem' }}>{selected.name}</h3>
                    <p style={{ color: 'var(--text-3)', fontSize: '.85rem' }}>{selected.email}</p>
                    {selected.phone && <p style={{ color: 'var(--text-3)', fontSize: '.85rem' }}>{selected.phone}</p>}
                  </div>
                  <p className="ml-auto" style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <p style={{ color: 'var(--text)', lineHeight: 1.75, fontSize: '1rem' }}>{selected.message}</p>
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                  <a href={`mailto:${selected.email}`} className="btn-primary" style={{ fontSize: '.875rem' }}>
                    <Mail size={14} /> Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl h-64 flex items-center justify-center" style={{ border: '1px dashed var(--border)' }}>
                <p style={{ color: 'var(--text-3)', fontSize: '.875rem', fontFamily: 'var(--font-display)' }}>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
