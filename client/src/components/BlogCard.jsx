import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Clock, ArrowUpRight, MessageCircle } from 'lucide-react';

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function img(b) { return b.coverImage || b.thumbnail || `https://picsum.photos/seed/${b._id || 'blog'}/800/500`; }
function ava(u) {
  if (!u) return 'https://ui-avatars.com/api/?background=14B8A6&color=0A0A0F&name=A&bold=true';
  return u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=14B8A6&color=0A0A0F&bold=true`;
}

/* ── HERO card ──────────────────────────────────────── */
export function HeroCard({ blog }) {
  if (!blog) return null;
  const slug = blog.slug || blog._id;
  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: .4, ease: 'easeOut' }}>
      <Link to={`/blog/${slug}`} className="relative block rounded-2xl overflow-hidden group noise"
        style={{ height: '460px', boxShadow: 'var(--sh-xl)', border: '1px solid var(--border-2)' }}>
        <img src={img(blog)} alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,15,.98) 0%, rgba(10,10,15,.7) 45%, rgba(10,10,15,.2) 100%)' }} />
        {/* Teal glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'var(--grad-brand)', opacity: 0.6 }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`badge badge-${blog.category || 'Other'}`}>{blog.category || 'Article'}</span>
            <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem' }}>
              <Clock size={10} className="inline mr-1" />{blog.readTime || 5} min read
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '.875rem', letterSpacing: '-.02em' }}>
            {blog.title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.9rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1.25rem' }}>
            {blog.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={ava(blog.user)} alt={blog.user?.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20" />
              <div>
                <p style={{ color: '#fff', fontSize: '.82rem', fontWeight: 700 }}>{blog.user?.name}</p>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.72rem' }}>{timeAgo(blog.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.75rem' }} className="flex items-center gap-1"><Eye size={12} />{blog.views || 0}</span>
              <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '.75rem' }} className="flex items-center gap-1"><Heart size={12} />{blog.likes?.length || 0}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition group-hover:scale-110"
                style={{ background: 'var(--grad-brand)', boxShadow: 'var(--sh-teal)' }}>
                <ArrowUpRight size={15} color="#0A0A0F" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── STANDARD card ──────────────────────────────────── */
export default function BlogCard({ blog, delay = 0 }) {
  if (!blog) return null;
  const slug = blog.slug || blog._id;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, delay, ease: 'easeOut' }}
      className="group flex flex-col rounded-2xl overflow-hidden card-hover"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
      <Link to={`/blog/${slug}`} className="block overflow-hidden shrink-0 relative" style={{ height: '200px' }}>
        <img src={img(blog)} alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-107" loading="lazy" />
        {/* Category pill on image */}
        <div className="absolute top-3 left-3">
          <span className={`badge badge-${blog.category || 'Other'}`}>{blog.category}</span>
        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to top, rgba(17,17,24,.9), transparent)' }} />
      </Link>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-3)', fontSize: '.75rem' }} className="flex items-center gap-1"><Clock size={11} />{blog.readTime || 5} min</span>
          <span style={{ color: 'var(--text-3)', fontSize: '.72rem' }}>{timeAgo(blog.createdAt)}</span>
        </div>

        <div className="flex-1">
          <Link to={`/blog/${slug}`}>
            <h3 className="line-clamp-2 mb-2"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', color: 'var(--text)', lineHeight: 1.35, letterSpacing: '-.01em', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--teal)'}
              onMouseLeave={e => e.target.style.color = 'var(--text)'}>
              {blog.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{blog.description}</p>
          </Link>
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map(t => (
              <Link key={t} to={`/blogs?tag=${t}`}
                className="text-xs px-2.5 py-0.5 rounded-full font-bold transition hover:opacity-80"
                style={{ background: 'var(--teal-bg)', color: 'var(--teal)', border: '1px solid var(--teal-border)' }}>
                #{t}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link to={`/blog/${slug}`} className="flex items-center gap-2">
            <img src={ava(blog.user)} alt={blog.user?.name} className="w-7 h-7 rounded-lg object-cover" />
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{blog.user?.name}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2.5 text-xs" style={{ color: 'var(--text-3)' }}>
            <span className="flex items-center gap-1"><Eye size={11} />{blog.views || 0}</span>
            <span className="flex items-center gap-1"><Heart size={11} />{blog.likes?.length || 0}</span>
            <span className="flex items-center gap-1"><MessageCircle size={11} />{blog.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ── LIST card ──────────────────────────────────────── */
export function ListCard({ blog, rank }) {
  const slug = blog.slug || blog._id;
  return (
    <Link to={`/blog/${slug}`} className="flex items-center gap-4 p-3.5 rounded-xl transition group hover:bg-[var(--surface-2)]">
      {rank && (
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--surface-3)', minWidth: '2rem', textAlign: 'center' }}>
          {String(rank).padStart(2, '0')}
        </span>
      )}
      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
        <img src={img(blog)} alt={blog.title} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110" loading="lazy" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold line-clamp-1 transition-colors group-hover:text-[var(--teal)]"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{blog.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-3)' }}>
          <span>{blog.user?.name}</span>
          <span>·</span><Eye size={10} /><span>{blog.views || 0}</span>
          <span>·</span><Clock size={10} /><span>{blog.readTime || 5}m</span>
        </div>
      </div>
    </Link>
  );
}
