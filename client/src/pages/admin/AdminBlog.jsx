import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { deleteBlog } from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['', 'published', 'draft', 'pending', 'scheduled'];

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/blog/admin/all', { params: { search, status, page, limit: 15 } });
      setBlogs(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetch(); }, [search, status, page]);

  const handleApprove = async (id) => {
    await api.put(`/blog/${id}/approve`);
    setBlogs(prev => prev.map(b => b._id === id ? { ...b, status: 'published' } : b));
    toast.success('Approved & published');
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await deleteBlog(id); setBlogs(prev => prev.filter(b => b._id !== id)); toast.success('Deleted');
  };

  const img = (b) => b.coverImage || b.thumbnail || `https://picsum.photos/seed/${b._id}/200/120`;
  const ava = (u) => u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'A')}&background=14B8A6&color=0A0A0F`;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>Content Manager</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '.85rem' }}>{total} posts</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search posts…" className="inp" style={{ paddingLeft: '2.5rem' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className="px-3 py-2 rounded-xl text-sm font-bold border transition"
              style={status === s
                ? { background: 'var(--teal)', color: 'var(--bg)', borderColor: 'var(--teal)' }
                : { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'var(--surface-2)' }}>
              <tr>
                {['Post', 'Author', 'Category', 'Stats', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(8)].map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                </tr>
              )) : blogs.map((b, i) => (
                <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .03 }}
                  className="border-t transition hover:bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3" style={{ maxWidth: '260px' }}>
                    <div className="flex items-center gap-3">
                      <img src={img(b)} alt={b.title} className="w-14 h-10 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <p style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</p>
                        <p style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>{new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={ava(b.user)} alt={b.user?.name} className="w-6 h-6 rounded-md object-cover" />
                      <span style={{ fontSize: '.8rem', color: 'var(--text-2)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`badge badge-${b.category || 'Other'}`}>{b.category}</span></td>
                  <td className="px-4 py-3">
                    <div style={{ fontSize: '.72rem', color: 'var(--text-3)' }} className="flex flex-col gap-0.5">
                      <span>👁 {b.views || 0}</span><span>❤️ {b.likes?.length || 0}</span><span>💬 {b.comments?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/blog/${b.slug || b._id}`} target="_blank"
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: '#60A5FA', background: 'rgba(96,165,250,.1)' }}>
                        <ExternalLink size={13} />
                      </Link>
                      {b.status === 'pending' && (
                        <button onClick={() => handleApprove(b._id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ color: '#4ADE80', background: 'rgba(74,222,128,.1)' }}>
                          <CheckCircle size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(b._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: '#F87171', background: 'rgba(248,113,113,.1)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
            <p style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm border transition disabled:opacity-40"
                style={{ borderColor: 'var(--border)', color: 'var(--text-2)', background: 'var(--surface)' }}>Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border transition disabled:opacity-40"
                style={{ borderColor: 'var(--border)', color: 'var(--text-2)', background: 'var(--surface)' }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
