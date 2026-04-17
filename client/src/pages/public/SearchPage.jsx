import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getBlogs } from '../../services/api';
import BlogCard from '../../components/BlogCard';
import SkeletonCard from '../../components/ui/SkeletonCard';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [val, setVal] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (e) => {
    e.preventDefault(); if (!val.trim()) return;
    setQ(val); setLoading(true); setSearched(true);
    try { const { data } = await getBlogs({ search: val, limit: 15 }); setResults(data.data || []); }
    catch {} setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="relative overflow-hidden" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', paddingTop: '110px', paddingBottom: '70px' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '-5%', width: '45%', height: '150%', background: 'radial-gradient(ellipse, rgba(20,184,166,.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '.75rem', letterSpacing: '-.03em' }}>
            Search Everything
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}
            style={{ color: 'var(--text-3)', marginBottom: '2rem' }}>Stories, ideas, authors, topics</motion.p>
          <motion.form onSubmit={doSearch} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
            className="relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input type="text" value={val} onChange={e => setVal(e.target.value)} autoFocus placeholder="What are you looking for?" className="inp" style={{ paddingLeft: '2.75rem', paddingRight: '8rem', fontSize: '1rem', padding: '1rem 8rem 1rem 2.75rem' }} />
            <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2" style={{ padding: '.625rem 1.25rem', fontSize: '.85rem' }}>Search</button>
          </motion.form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-24">
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>No results for "{q}"</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-3)', fontSize: '.875rem', marginBottom: '1.5rem' }}>{results.length} results for "{q}"</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((b, i) => <BlogCard key={b._id} blog={b} delay={i * .04} />)}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
