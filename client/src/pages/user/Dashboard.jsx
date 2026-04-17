import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenLine, Trash2, Edit, Eye, Heart, MessageCircle, BookOpen, Bookmark, Clock } from 'lucide-react';
import { getMyBlogs, deleteBlog, getMyBookmarks } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function img(b) { return b.coverImage || b.thumbnail || `https://picsum.photos/seed/${b._id}/400/250`; }
function ava(u) { return u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'A')}&background=14B8A6&color=0A0A0F`; }

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyBlogs(), getMyBookmarks()])
      .then(([p, b]) => { setPosts(p.data.blogs || []); setBookmarks(b.data.data || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const del = async (id) => {
    if (!window.confirm('Delete?')) return;
    await deleteBlog(id); setPosts(prev => prev.filter(p => p._id !== id)); toast.success('Deleted');
  };

  const stats = [
    { label: 'Published', val: posts.filter(p => p.status === 'published').length, icon: BookOpen, color: 'var(--teal)' },
    { label: 'Total Views', val: posts.reduce((a, p) => a + (p.views || 0), 0), icon: Eye, color: '#60A5FA' },
    { label: 'Total Likes', val: posts.reduce((a, p) => a + (p.likes?.length || 0), 0), icon: Heart, color: '#F87171' },
    { label: 'Saved', val: bookmarks.length, icon: Bookmark, color: '#A78BFA' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img src={ava(user)} alt={user?.name} className="w-14 h-14 rounded-2xl object-cover" style={{ border: '1px solid var(--teal-border)', boxShadow: 'var(--sh-teal)' }} />
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge badge-${user?.role}`}>{user?.role}</span>
                <span style={{ color: 'var(--text-3)', fontSize: '.78rem' }}>{user?.email}</span>
              </div>
            </div>
          </div>
          <Link to="/write" className="btn-primary" style={{ fontSize: '.875rem' }}>
            <PenLine size={14} /> New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, val, icon: Icon, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}
              className="rounded-2xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + '18', border: `1px solid ${color}33` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{val.toLocaleString()}</p>
              <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginTop: '.3rem' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
          {[['posts', 'My Posts', posts.length], ['bookmarks', 'Saved', bookmarks.length]].map(([k, l, c]) => (
            <button key={k} onClick={() => setTab(k)}
              className="px-5 py-3 text-sm font-bold border-b-2 -mb-px transition flex items-center gap-2"
              style={{ color: tab === k ? 'var(--teal)' : 'var(--text-3)', borderColor: tab === k ? 'var(--teal)' : 'transparent' }}>
              {l}
              <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: tab === k ? 'var(--teal-bg)' : 'var(--surface-2)', color: tab === k ? 'var(--teal)' : 'var(--text-3)', border: tab === k ? '1px solid var(--teal-border)' : '1px solid var(--border)' }}>{c}</span>
            </button>
          ))}
        </div>

        {loading ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
          : tab === 'posts' ? (
            posts.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
                <PenLine size={32} style={{ color: 'var(--text-3)', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)', marginBottom: '.5rem' }}>No posts yet</p>
                <Link to="/write" style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '.9rem' }}>Write your first story →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border transition"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0">
                      <img src={img(p)} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge badge-${p.category || 'Other'}`}>{p.category}</span>
                        <span className={`badge badge-${p.status}`}>{p.status}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 800, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-3)' }}>
                        <span className="flex items-center gap-1"><Eye size={10} />{p.views || 0}</span>
                        <span className="flex items-center gap-1"><Heart size={10} />{p.likes?.length || 0}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={10} />{p.comments?.length || 0}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link to={`/blog/${p.slug || p._id}`} className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-3)' }}><Eye size={14} /></Link>
                      <Link to={`/edit/${p._id}`} className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-[var(--surface-2)]" style={{ color: 'var(--text-3)' }}><Edit size={14} /></Link>
                      <button onClick={() => del(p._id)} className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-red-950/30" style={{ color: '#F87171' }}><Trash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            bookmarks.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
                <Bookmark size={32} style={{ color: 'var(--text-3)', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>No saved posts</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((b, i) => (
                  <motion.div key={b._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}>
                    <Link to={`/blog/${b.slug || b._id}`}
                      className="flex gap-3 p-4 rounded-2xl border transition hover:border-[var(--teal-border)]"
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <img src={img(b)} alt={b.title} className="w-20 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className={`badge badge-${b.category || 'Other'} mb-1.5`}>{b.category}</span>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '.875rem', fontWeight: 800, color: 'var(--text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{b.title}</h3>
                        <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginTop: '.3rem' }}>{b.user?.name} · {b.readTime || 5} min</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )
          )}
      </div>
    </div>
  );
}
