import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, Underline, Link as LinkIcon, Image, List,
  ListOrdered, Quote, Code, Minus, AlignLeft, AlignCenter,
  AlignRight, Maximize2, Heading2, Heading3, Strikethrough,
  Upload, X, Check, Loader
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

function ToolBtn({ icon: Icon, action, title, active }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); action(); }}
      title={title}
      className="p-2 rounded-lg transition-all duration-150 hover:bg-[var(--surface-2)]"
      style={{
        color: active ? 'var(--teal)' : 'var(--text-2)',
        background: active ? 'var(--teal-bg)' : 'transparent',
      }}>
      <Icon size={16} />
    </button>
  );
}

function Divider() {
  return <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />;
}

export default function RichEditor({ value, onChange, placeholder = 'Write your story here...' }) {
  const editorRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageModal, setImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    syncContent();
  }, []);

  const syncContent = useCallback(() => {
    if (editorRef.current && onChange) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const isActive = (cmd) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  // ── Image upload ─────────────────────────────────────────────
  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image too large (max 10MB)'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      insertImage(data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed — check Cloudinary config');
    } finally { setUploading(false); }
  };

  const insertImage = (url, alt = '') => {
    editorRef.current?.focus();
    const html = `<figure><img src="${url}" alt="${alt}" class="img-full" loading="lazy" /><figcaption>Caption (click to edit)</figcaption></figure>`;
    document.execCommand('insertHTML', false, html);
    syncContent();
    setImageModal(false);
    setImageUrl('');
  };

  const insertLink = () => {
    if (!linkUrl) return;
    exec('createLink', linkUrl);
    setLinkModal(false);
    setLinkUrl('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        uploadFile(item.getAsFile());
        return;
      }
    }
  };

  const toolGroups = [
    [
      { icon: Bold, action: () => exec('bold'), title: 'Bold', active: isActive('bold') },
      { icon: Italic, action: () => exec('italic'), title: 'Italic', active: isActive('italic') },
      { icon: Underline, action: () => exec('underline'), title: 'Underline', active: isActive('underline') },
      { icon: Strikethrough, action: () => exec('strikeThrough'), title: 'Strikethrough' },
    ],
    [
      { icon: Heading2, action: () => exec('formatBlock', 'h2'), title: 'Heading 2' },
      { icon: Heading3, action: () => exec('formatBlock', 'h3'), title: 'Heading 3' },
    ],
    [
      { icon: List, action: () => exec('insertUnorderedList'), title: 'Bullet List' },
      { icon: ListOrdered, action: () => exec('insertOrderedList'), title: 'Numbered List' },
      { icon: Quote, action: () => exec('formatBlock', 'blockquote'), title: 'Blockquote' },
      { icon: Code, action: () => exec('formatBlock', 'pre'), title: 'Code Block' },
    ],
    [
      { icon: AlignLeft, action: () => exec('justifyLeft'), title: 'Left' },
      { icon: AlignCenter, action: () => exec('justifyCenter'), title: 'Center' },
      { icon: AlignRight, action: () => exec('justifyRight'), title: 'Right' },
    ],
    [
      { icon: Minus, action: () => exec('insertHorizontalRule'), title: 'Divider' },
    ],
  ];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--border)', background: 'var(--surface)' }}>
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-1 p-2 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
        {toolGroups.map((group, gi) => (
          <div key={gi} className="flex items-center">
            {gi > 0 && <Divider />}
            {group.map((t, ti) => <ToolBtn key={ti} {...t} />)}
          </div>
        ))}
        <Divider />
        {/* Link */}
        <div className="relative">
          <ToolBtn icon={LinkIcon} action={() => setLinkModal(!linkModal)} title="Insert Link" />
          <AnimatePresence>
            {linkModal && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-10 left-0 flex items-center gap-2 p-2 rounded-xl shadow-xl z-20"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', minWidth: '280px' }}>
                <input
                  type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={e => e.key === 'Enter' && insertLink()}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  autoFocus />
                <button type="button" onClick={insertLink} className="p-1.5 rounded-lg" style={{ background: 'var(--teal)', color: '#fff' }}><Check size={14} /></button>
                <button type="button" onClick={() => setLinkModal(false)} className="p-1.5 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}><X size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Image by URL */}
        <div className="relative">
          <ToolBtn icon={Image} action={() => setImageModal(!imageModal)} title="Insert Image by URL" />
          <AnimatePresence>
            {imageModal && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-10 left-0 flex items-center gap-2 p-2 rounded-xl shadow-xl z-20"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', minWidth: '320px' }}>
                <input
                  type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={e => e.key === 'Enter' && insertImage(imageUrl)}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg outline-none"
                  style={{ background: 'var(--surface-2)', color: 'var(--text)', border: '1px solid var(--border)' }}
                  autoFocus />
                <button type="button" onClick={() => insertImage(imageUrl)} className="p-1.5 rounded-lg" style={{ background: 'var(--teal)', color: '#fff' }}><Check size={14} /></button>
                <button type="button" onClick={() => setImageModal(false)} className="p-1.5 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}><X size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Upload */}
        <ToolBtn
          icon={uploading ? Loader : Upload}
          action={() => !uploading && fileInputRef.current?.click()}
          title="Upload Image"
        />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => uploadFile(e.target.files?.[0])} />
        {uploading && (
          <span className="text-xs ml-1 animate-pulse" style={{ color: 'var(--teal)' }}>Uploading…</span>
        )}
      </div>

      {/* Editor area */}
      <div
        className={`relative ${dragOver ? 'drop-active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="rich-editor px-6 py-5 min-h-[420px] focus:outline-none"
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: value || '' }}
          onInput={syncContent}
          onPaste={handlePaste}
          style={{ background: 'var(--surface)', color: 'var(--text)' }}
        />
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-b-xl"
            style={{ border: '2px dashed var(--teal)', background: 'var(--teal-bg)', opacity: .9 }}>
            <div className="text-center">
              <Upload size={28} style={{ color: 'var(--teal)', margin: '0 auto .5rem' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--teal)' }}>Drop image to upload</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
