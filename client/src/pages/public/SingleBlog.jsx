import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, MessageCircle, Eye, Clock, Share2, Trash2, ArrowLeft, Twitter, Linkedin, Link2 } from 'lucide-react';
import { getSingleBlog, likeBlog, toggleBookmark, addComment, deleteComment, incrementViews, getRelatedBlogs } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BlogCard from '../../components/BlogCard';
import toast from 'react-hot-toast';

function ava(u) { return u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'A')}&background=14B8A6&color=0A0A0F&bold=true`; }
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function SingleBlog() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [bkd, setBkd] = useState(false);
  const [likes, setLikes] = useState(0);
  const [posting, setPosting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setLoading(true); window.scrollTo(0, 0);
    getSingleBlog(id).then(({ data }) => {
      const b = data.data;
      setBlog(b);
      setLiked(user && b.likes?.includes(user._id));
      setBkd(user && b.bookmarks?.includes(user._id));
      setLikes(b.likes?.length || 0);
      incrementViews(b._id).catch(() => {});
      return getRelatedBlogs(b._id);
    }).then(({ data }) => setRelated(data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const doLike = async () => {
    if (!user) { toast.error('Sign in to like'); return; }
    const { data } = await likeBlog(blog._id);
    setLiked(data.liked); setLikes(data.likesCount);
  };
  const doBookmark = async () => {
    if (!user) { toast.error('Sign in to save'); return; }
    const { data } = await toggleBookmark(blog._id);
    setBkd(data.bookmarked); toast.success(data.bookmarked ? 'Saved!' : 'Removed');
  };
  const doComment = async (e) => {
    e.preventDefault(); if (!user) { toast.error('Sign in to comment'); return; }
    if (!comment.trim()) return;
    setPosting(true);
    const { data } = await addComment(blog._id, comment);
    setBlog(p => ({ ...p, comments: data.comments }));
    setComment(''); setPosting(false); toast.success('Comment posted!');
  };
  const doDelete = async (cid) => {
    await deleteComment(blog._id, cid);
    setBlog(p => ({ ...p, comments: p.comments.filter(c => c._id !== cid) }));
    toast.success('Deleted');
  };
  const doShare = (type) => {
    const url = window.location.href;
    if (type === 'copy') { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
    else if (type === 'tw') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(blog.title)}`, '_blank');
    else if (type === 'li') window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`, '_blank');
    setShareOpen(false);
  };

  if (loading) return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto space-y-6">
      <div className="skeleton h-80 w-full rounded-2xl" />
      <div className="skeleton h-10 w-3/4" />
      <div className="skeleton h-5 w-1/2" />
      {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-4" style={{ width: `${60 + Math.random() * 40}%` }} />)}
    </div>
  );
  if (!blog) return (
    <div className="pt-32 text-center">
      <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Post not found</p>
      <Link to="/blogs" style={{ color: 'var(--teal)', fontWeight: 700 }}>← Browse all posts</Link>
    </div>
  );

  const coverImg = blog.coverImage || blog.thumbnail;

  return (
    <article style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Cover image hero */}
      {coverImg ? (
        <div className="relative" style={{ height: '60vh', minHeight: '360px', maxHeight: '520px' }}>
          <img src={coverImg} alt={blog.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,15,.4) 0%, var(--bg) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'var(--grad-brand)', opacity: .5 }} />
        </div>
      ) : <div style={{ height: '90px' }} />}

      <div className="max-w-4xl mx-auto px-4" style={{ marginTop: coverImg ? '-100px' : '0', position: 'relative', paddingBottom: '5rem' }}>
        <button onClick={() => nav(-1)}
          className="flex items-center gap-2 text-sm mb-8 pt-4 transition hover:opacity-70"
          style={{ color: 'var(--text-3)', fontFamily: 'var(--font-body)' }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <span className={`badge badge-${blog.category || 'Other'} mb-5`}>{blog.category}</span>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text)', marginBottom: '1.25rem', letterSpacing: '-.03em' }}>
              {blog.title}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1.75rem' }}>{blog.description}</p>

            {/* Author + meta */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y" style={{ borderColor: 'var(--border)', marginBottom: '2rem' }}>
              <div className="flex items-center gap-3">
                <img src={ava(blog.user)} alt={blog.user?.name} className="w-11 h-11 rounded-xl object-cover" style={{ border: '1px solid var(--teal-border)', boxShadow: 'var(--sh-teal)' }} />
                <div>
                  <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '.9rem', fontFamily: 'var(--font-display)' }}>{blog.user?.name}</p>
                  <p style={{ color: 'var(--text-3)', fontSize: '.78rem' }}>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-3)' }}>
                <span className="flex items-center gap-1.5"><Clock size={13} />{blog.readTime || 5} min</span>
                <span className="flex items-center gap-1.5"><Eye size={13} />{blog.views || 0}</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map(t => (
                  <Link key={t} to={`/blogs?tag=${t}`}
                    className="px-3 py-1 rounded-full text-xs font-bold transition hover:opacity-80"
                    style={{ background: 'var(--teal-bg)', color: 'var(--teal)', border: '1px solid var(--teal-border)' }}>
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose-blog" dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.description}</p>` }} />

            {/* Actions */}
            <div className="flex items-center gap-3 mt-12 pt-6 border-t flex-wrap" style={{ borderColor: 'var(--border)' }}>
              <button onClick={doLike}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition"
                style={liked ? { background: 'rgba(239,68,68,.12)', color: '#FCA5A5', borderColor: 'rgba(239,68,68,.25)' } : { background: 'var(--surface-2)', color: 'var(--text-2)', borderColor: 'var(--border)' }}>
                <Heart size={14} fill={liked ? 'currentColor' : 'none'} />{likes}
              </button>
              <button onClick={doBookmark}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-bold transition"
                style={bkd ? { background: 'var(--teal-bg)', color: 'var(--teal)', borderColor: 'var(--teal-border)' } : { background: 'var(--surface-2)', color: 'var(--text-2)', borderColor: 'var(--border)' }}>
                <Bookmark size={14} fill={bkd ? 'currentColor' : 'none'} />{bkd ? 'Saved' : 'Save'}
              </button>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-3)' }}>
                <MessageCircle size={14} />{blog.comments?.length || 0}
              </span>
              <div className="relative ml-auto">
                <button onClick={() => setShareOpen(!shareOpen)}
                  className="btn-ghost text-sm" style={{ padding: '.5rem 1rem', fontSize: '.85rem' }}>
                  <Share2 size={14} /> Share
                </button>
                <AnimatePresence>
                  {shareOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-20"
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-xl)', minWidth: '170px' }}>
                      {[{ l: 'Copy link', i: Link2, t: 'copy' }, { l: 'Twitter', i: Twitter, t: 'tw' }, { l: 'LinkedIn', i: Linkedin, t: 'li' }].map(({ l, i: Icon, t }) => (
                        <button key={t} onClick={() => doShare(t)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-[var(--surface-3)]"
                          style={{ color: 'var(--text-2)' }}>
                          <Icon size={14} style={{ color: 'var(--teal)' }} />{l}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl p-5 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', boxShadow: 'var(--sh-md)' }}>
                <p style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-3)', marginBottom: '1rem' }}>Author</p>
                <img src={ava(blog.user)} alt={blog.user?.name} className="w-14 h-14 rounded-2xl object-cover mx-auto mb-3" style={{ border: '1px solid var(--teal-border)' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text)', marginBottom: '.4rem' }}>{blog.user?.name}</p>
                {blog.user?.bio && <p style={{ fontSize: '.78rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{blog.user.bio.slice(0, 100)}</p>}
                {blog.user?.website && (
                  <a href={blog.user.website} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-bold transition hover:opacity-70"
                    style={{ color: 'var(--teal)' }}>
                    Visit website →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-16 max-w-3xl">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem' }}>
            Comments ({blog.comments?.length || 0})
          </h3>
          {user ? (
            <form onSubmit={doComment} className="mb-8 flex gap-3">
              <img src={ava(user)} alt={user.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
              <div className="flex-1">
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                  placeholder="Share your thoughts…"
                  className="inp" style={{ resize: 'none', width: '100%' }} />
                <div className="flex justify-end mt-2">
                  <button type="submit" disabled={posting || !comment.trim()} className="btn-primary"
                    style={{ padding: '.5rem 1.25rem', fontSize: '.85rem', opacity: (!comment.trim() || posting) ? .5 : 1 }}>
                    {posting ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 rounded-xl text-sm text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 700 }}>Sign in</Link>
              <span style={{ color: 'var(--text-3)' }}> to join the conversation</span>
            </div>
          )}
          <div className="space-y-3">
            {blog.comments?.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                className="flex gap-3 p-4 rounded-2xl"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <img src={ava(c.user)} alt={c.user?.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '.875rem', fontFamily: 'var(--font-display)' }}>{c.user?.name}</p>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>{timeAgo(c.createdAt)}</span>
                      {(user?._id === c.user?._id || ['admin', 'editor'].includes(user?.role)) && (
                        <button onClick={() => doDelete(c._id)} className="hover:opacity-70 transition" style={{ color: '#F87171' }}>
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '.875rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{c.comment}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem' }}>You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((b, i) => <BlogCard key={b._id} blog={b} delay={i * .07} />)}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
