import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Zap, BookOpen, Users, Star } from 'lucide-react';
import BlogCard, { HeroCard, ListCard } from '../../components/BlogCard';
import SkeletonCard, { SkeletonHero, SkeletonList } from '../../components/ui/SkeletonCard';
import { getBlogs, getFeaturedBlogs, getTrendingBlogs } from '../../services/api';

const CATS = ['Technology', 'Design', 'Business', 'Science', 'Lifestyle', 'Culture', 'Travel', 'Health'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedBlogs().catch(() => ({ data: { data: [] } })),
      getTrendingBlogs().catch(() => ({ data: { data: [] } })),
      getBlogs({ limit: 6 }).catch(() => ({ data: { data: [] } })),
    ]).then(([f, t, r]) => {
      setFeatured(f.data?.data || []);
      setTrending(t.data?.data || []);
      setRecent(r.data?.data || []);
      setLoading(false);
    });
  }, []);

  const hero = featured[0];
  const sub = featured.slice(1, 3);

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ═══ HERO ════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Background mesh */}
        <div className="absolute inset-0 hero-bg" />
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,.10) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '40%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-bold"
                  style={{ background: 'var(--teal-bg)', color: 'var(--teal)', border: '1px solid var(--teal-border)' }}>
                  <Zap size={13} fill="currentColor" /> Premium Editorial Platform
                </div>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .65 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: '1.5rem', letterSpacing: '-.04em', color: 'var(--text)' }}>
                Stories that<br />
                <span className="grad-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>illuminate</span><br />
                the world
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .6 }}
                style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '460px', marginBottom: '2.5rem' }}>
                Curated perspectives on technology, culture, design, and the human experience. Written by those who know.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, duration: .6 }}
                className="flex flex-wrap gap-3 mb-14">
                <Link to="/blogs" className="btn-primary">
                  Explore Stories <ArrowRight size={16} />
                </Link>
                <Link to="/write" className="btn-ghost">
                  <Zap size={15} /> Start Writing
                </Link>
              </motion.div>

              {/* Stats bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}
                className="flex items-center gap-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                {[
                  { icon: BookOpen, val: '12K+', label: 'Stories' },
                  { icon: Users, val: '3.5K+', label: 'Writers' },
                  { icon: Star, val: '98%', label: 'Satisfaction' },
                ].map(({ icon: Icon, val, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--teal-bg)', border: '1px solid var(--teal-border)' }}>
                      <Icon size={15} style={{ color: 'var(--teal)' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', fontSize: '1.05rem', lineHeight: 1 }}>{val}</p>
                      <p style={{ color: 'var(--text-3)', fontSize: '.72rem', marginTop: '.2rem' }}>{label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: featured card */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2, duration: .7 }}>
              {loading ? <SkeletonHero /> : hero ? <HeroCard blog={hero} /> : (
                <div className="rounded-2xl flex items-center justify-center text-center p-12"
                  style={{ border: '1px dashed var(--border)', height: '460px' }}>
                  <div>
                    <BookOpen size={40} style={{ color: 'var(--text-3)', margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-3)' }}>No featured stories yet</p>
                    <Link to="/write" style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '.875rem', display: 'block', marginTop: '.5rem' }}>Be the first →</Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORY STRIP ══════════════════════════════ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <span style={{ color: 'var(--text-3)', fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>Browse →</span>
            {CATS.map(cat => (
              <Link key={cat} to={`/blogs?category=${cat}`}
                className="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition"
                style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-border)'; e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.background = 'var(--teal-bg)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'var(--surface-2)'; }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED SECONDARY ══════════════════════════ */}
      {(loading || sub.length > 0) && (
        <section style={{ background: 'var(--bg)', padding: '3rem 0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SkeletonCard /><SkeletonCard />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {sub.map(b => <BlogCard key={b._id} blog={b} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ RECENT + TRENDING ═══════════════════════════ */}
      <section style={{ padding: '4rem 0', background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Recent 2/3 */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>Recent Stories</h2>
                  <p style={{ color: 'var(--text-3)', fontSize: '.85rem', marginTop: '.3rem' }}>Fresh from the community</p>
                </div>
                <Link to="/blogs" className="flex items-center gap-1 text-sm font-bold transition hover:gap-2" style={{ color: 'var(--teal)' }}>
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : recent.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed var(--border)', background: 'var(--surface)' }}>
                  <p style={{ color: 'var(--text-3)' }}>No posts yet. <Link to="/write" style={{ color: 'var(--teal)' }}>Write the first!</Link></p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {recent.slice(0, 4).map((b, i) => <BlogCard key={b._id} blog={b} delay={i * .06} />)}
                </div>
              )}
            </div>

            {/* Trending 1/3 */}
            <div>
              <div className="flex items-center gap-2 mb-7">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-bg)', border: '1px solid var(--teal-border)' }}>
                  <TrendingUp size={14} style={{ color: 'var(--teal)' }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>Trending</h2>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
                {loading ? (
                  <div className="p-3 space-y-2">
                    {[...Array(5)].map((_, i) => <SkeletonList key={i} />)}
                  </div>
                ) : trending.length === 0 ? (
                  <div className="p-6 text-center text-sm" style={{ color: 'var(--text-3)' }}>Nothing trending yet</div>
                ) : (
                  <div>
                    {trending.slice(0, 5).map((b, i) => (
                      <div key={b._id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                        <ListCard blog={b} rank={i + 1} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═════════════════════════════════════════ */}
      <section style={{ padding: '5rem 1rem' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: .97 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: .5 }}
            className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-center noise"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-glow)' }}>
            {/* Teal glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60%', height: '80%', background: 'radial-gradient(ellipse, rgba(20,184,166,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Bottom accent */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--grad-brand)', opacity: .6 }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-bold"
                style={{ background: 'var(--teal-bg)', color: 'var(--teal)', border: '1px solid var(--teal-border)' }}>
                <Zap size={13} fill="currentColor" /> Join 3,500+ writers
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-.03em' }}>
                Your story deserves<br />
                <span className="grad-text">to be heard</span>
              </h2>
              <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
                Join thousands of writers shaping tomorrow's ideas. Free forever.
              </p>
              <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                Start writing for free <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
