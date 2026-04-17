import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Eye, ArrowLeft, Image, X, Tag, Calendar, Globe, Lock } from 'lucide-react';
import { createBlog, updateBlog, getSingleBlog } from '../../services/api';
import RichEditor from '../../components/RichEditor'
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology','Lifestyle','Travel','Food','Health','Business','Design','Science','Culture','Other'];

export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: '', description: '', content: '', coverImage: '',
    category: 'Technology', tags: '', status: 'published',
    metaTitle: '', metaDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [parsedTags, setParsedTags] = useState([]);

  useEffect(() => {
    if (isEditing) {
      getSingleBlog(id).then(({ data }) => {
        const b = data.data;
        setForm({
          title: b.title || '', description: b.description || '',
          content: b.content || '', coverImage: b.coverImage || '',
          category: b.category || 'Technology', tags: b.tags?.join(', ') || '',
          status: b.status || 'published', metaTitle: b.metaTitle || '',
          metaDescription: b.metaDescription || '',
        });
        setParsedTags(b.tags || []);
      });
    }
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !parsedTags.includes(t) && parsedTags.length < 8) {
      const next = [...parsedTags, t];
      setParsedTags(next);
      setForm(f => ({ ...f, tags: next.join(', ') }));
    }
    setTagInput('');
  };

  const removeTag = (t) => {
    const next = parsedTags.filter(x => x !== t);
    setParsedTags(next);
    setForm(f => ({ ...f, tags: next.join(', ') }));
  };

  const handleSubmit = async (statusOverride) => {
    const finalStatus = statusOverride || form.status;
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setLoading(true);
    try {
      const payload = { ...form, tags: parsedTags, status: finalStatus, videoUrl: '' };
      if (isEditing) await updateBlog(id, payload);
      else await createBlog(payload);
      toast.success(isEditing ? 'Post updated!' : finalStatus === 'published' ? 'Published!' : 'Saved as draft');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const wordCount = form.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200) || 1;

  return (
    <div className="min-h-screen py-20" style={{ background: 'var(--c-bg)' }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm transition hover:opacity-70" style={{ color: 'var(--text-2)' }}>
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-3)' }}>
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition hover:bg-[var(--surface-2)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
              <Eye size={14} /> {preview ? 'Edit' : 'Preview'}
            </button>
            <button onClick={() => handleSubmit('draft')} disabled={loading}
              className="px-3 py-1.5 rounded-lg border text-sm transition hover:bg-[var(--surface-2)] disabled:opacity-50"
              style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
              Draft
            </button>
            <button onClick={() => handleSubmit('published')} disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--teal)' }}>
              <Save size={14} /> {loading ? 'Saving…' : isEditing ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {preview ? (
          /* ── PREVIEW ─────────────────────────────────────── */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            {form.coverImage && (
              <div className="rounded-2xl overflow-hidden mb-8" style={{ height: '400px' }}>
                <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            <span className={`badge badge-${form.category}`}>{form.category}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 700, color: 'var(--text)', marginTop: '1rem', lineHeight: 1.15 }}>
              {form.title || 'Your title here'}
            </h1>
            <p className="mt-4 text-lg" style={{ color: 'var(--text-2)' }}>{form.description}</p>
            <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:var(--text-3)">No content yet…</p>' }} />
          </motion.div>
        ) : (
          /* ── EDITOR ──────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main editor */}
            <div className="lg:col-span-2 space-y-5">
              {/* Cover image */}
              <div className="rounded-2xl overflow-hidden border relative group" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                {form.coverImage ? (
                  <div className="relative" style={{ height: '220px' }}>
                    <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button type="button" onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white bg-red-500/80 backdrop-blur-sm">
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Cover Image</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Image size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                        <input type="url" value={form.coverImage} onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                          placeholder="https://example.com/cover.jpg"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & description */}
              <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <textarea value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} rows={2}
                  placeholder="Your story's title…"
                  className="w-full resize-none border-0 outline-none bg-transparent text-3xl lg:text-4xl font-bold placeholder-[var(--text-3)]"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', lineHeight: 1.2 }} />
                <div className="border-t mt-3 pt-3" style={{ borderColor: 'var(--border)' }}>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                    placeholder="Write a compelling subtitle or hook…"
                    className="w-full resize-none border-0 outline-none bg-transparent text-base placeholder-[var(--text-3)]"
                    style={{ color: 'var(--text-2)', lineHeight: 1.6 }} />
                </div>
              </div>

              {/* Rich Editor */}
              <RichEditor value={form.content} onChange={val => setForm(f => ({ ...f, content: val }))} />
            </div>

            {/* Sidebar settings */}
            <div className="space-y-4">
              {/* Publish settings */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>Publish Settings</h3>
                {/* Status */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Visibility</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[['published', Globe, 'Public'], ['draft', Lock, 'Draft']].map(([s, Icon, label]) => (
                      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                        className="flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium border transition"
                        style={{
                          borderColor: form.status === s ? 'var(--teal)' : 'var(--border)',
                          background: form.status === s ? 'var(--teal-bg)' : 'var(--surface-2)',
                          color: form.status === s ? 'var(--teal)' : 'var(--text-2)',
                        }}>
                        <Icon size={13} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Category */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-2)' }}>Tags</label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Tag size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                      <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
                        placeholder="Add tag…"
                        className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                    <button type="button" onClick={addTag} className="px-3 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--teal)' }}>Add</button>
                  </div>
                  {parsedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {parsedTags.map(t => (
                        <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                          #{t}
                          <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 transition">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SEO toggle */}
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <button type="button" onClick={() => setSeoOpen(!seoOpen)}
                  className="w-full p-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-3)' }}>
                  SEO Settings
                  <span style={{ color: 'var(--text-3)', fontSize: '1.2rem' }}>{seoOpen ? '−' : '+'}</span>
                </button>
                {seoOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="pt-3">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Meta Title</label>
                      <input type="text" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                        placeholder={form.title || 'Meta title…'}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Meta Description</label>
                      <textarea value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                        placeholder={form.description || 'Meta description…'} rows={3}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick publish btns */}
              <div className="space-y-2">
                <button onClick={() => handleSubmit('published')} disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'var(--teal)' }}>
                  {loading ? 'Publishing…' : isEditing ? 'Update Post' : 'Publish Now'}
                </button>
                <button onClick={() => handleSubmit('draft')} disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold border transition hover:bg-[var(--surface-2)] disabled:opacity-50"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
