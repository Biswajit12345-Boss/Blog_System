import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { getBlogs } from '../../services/api';

const CATS = ['All','Technology','Lifestyle','Travel','Food','Health','Business','Design','Science','Culture'];
const SORTS = [{ v: '', l: 'Latest' }, { v: 'popular', l: 'Most Popular' }];

export default function BlogsPage() {
  const [sp, setSp] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [cur, setCur] = useState(1);
  const [total, setTotal] = useState(0);
  const [inputVal, setInputVal] = useState(sp.get('q') || '');
  const [search, setSearch] = useState(sp.get('q') || '');
  const [sort, setSort] = useState('');
  const cat = sp.get('category') || 'All';
  const tag = sp.get('tag') || '';

  const fetch = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort };
      if (cat !== 'All') params.category = cat;
      if (tag) params.tag = tag;
      if (search) params.search = search;
      const { data } = await getBlogs(params);
      setBlogs(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCur(data.currentPage || 1);
      setTotal(data.total || 0);
    } catch {}
    setLoading(false);
  }, [cat, tag, search, sort]);

  useEffect(() => { fetch(1); }, [fetch]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(inputVal); };
  const clearAll = () => { setSearch(''); setInputVal(''); setSort(''); setSp({}); };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Dark hero header */}
      <div className="relative overflow-hidden" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '50%', height: '200%', background: 'radial-gradient(ellipse, rgba(20,184,166,.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '.75rem', letterSpacing: '-.03em' }}>
              {cat !== 'All' ? <><span className="grad-text">{cat}</span> Stories</> : tag ? <>#<span className="grad-text">{tag}</span></> : 'Explore Everything'}
            </h1>
            <p style={{ color: 'var(--text-3)', marginBottom: '2rem', fontSize: '1rem' }}>
              {total > 0 ? `${total} stories to discover` : 'Curated ideas from our community'}
            </p>
          </motion.div>

          {/* Search */}
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
            className="relative max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search stories, topics, authors…"
              className="inp" style={{ paddingLeft: '2.75rem', paddingRight: '7rem' }} />
            <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2"
              style={{ padding: '.5rem 1rem', fontSize: '.82rem', borderRadius: 'var(--r-sm)' }}>Search</button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <div className="flex gap-2 flex-wrap flex-1">
            {CATS.map(c => (
              <button key={c} onClick={() => setSp(c === 'All' ? {} : { category: c })}
                className="px-4 py-1.5 rounded-full text-sm font-bold border transition"
                style={cat === c
                  ? { background: 'var(--teal)', color: 'var(--bg)', borderColor: 'var(--teal)', boxShadow: 'var(--sh-teal)' }
                  : { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-2)' }}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="inp" style={{ padding: '.5rem .75rem', width: 'auto' }}>
              {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
            {(cat !== 'All' || tag || search) && (
              <button onClick={clearAll} className="btn-ghost" style={{ padding: '.5rem .75rem', fontSize: '.82rem' }}>
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 rounded-2xl" style={{ border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '.5rem', fontFamily: 'var(--font-display)' }}>No stories found</p>
            <button onClick={clearAll} style={{ color: 'var(--teal)', fontSize: '.875rem', fontWeight: 700 }}>Clear filters →</button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={`${cat}-${search}-${sort}-${cur}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((b, i) => <BlogCard key={b._id} blog={b} delay={i * .04} />)}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => fetch(cur - 1)} disabled={cur === 1}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition disabled:opacity-30 hover:border-[var(--teal)] hover:text-[var(--teal)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
              const p = totalPages <= 7 ? i + 1 : Math.max(1, Math.min(totalPages - 6, cur - 3)) + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <button key={p} onClick={() => fetch(p)}
                  className="w-10 h-10 rounded-xl text-sm font-bold border transition"
                  style={cur === p
                    ? { background: 'var(--teal)', color: 'var(--bg)', borderColor: 'var(--teal)', boxShadow: 'var(--sh-teal)' }
                    : { borderColor: 'var(--border)', color: 'var(--text-2)', background: 'var(--surface)' }}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => fetch(cur + 1)} disabled={cur === totalPages}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition disabled:opacity-30 hover:border-[var(--teal)] hover:text-[var(--teal)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
