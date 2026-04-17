import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, PenLine, Users, Globe, TrendingUp, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', paddingTop: '130px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '5%', width: '40%', height: '80%', background: 'radial-gradient(ellipse, rgba(20,184,166,.06) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem', lineHeight: 1.0, letterSpacing: '-.04em' }}>
            About <span className="grad-text">Luminary</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}
            style={{ fontSize: '1.1rem', color: 'var(--text-2)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
            A dark-first editorial platform where writers craft ideas that shape the world.
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['12K+','Stories'],['3.5K+','Writers'],['150+','Countries'],['98%','Satisfaction']].map(([v, l], i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }}
              className="text-center p-6 rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
              <p className="grad-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{v}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '.82rem', marginTop: '.4rem' }}>{l}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <div className="rounded-2xl p-8 lg:p-10 relative overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-md)' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--grad-brand)', opacity: .5 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', letterSpacing: '-.02em' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.85, fontSize: '1.05rem' }}>
            We believe the world changes through ideas — and ideas spread through words. Luminary exists to give writers a beautiful, dark, focused space to craft stories that resonate. No algorithm suppression. No paywalls. Just great writing, beautifully presented.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: PenLine, title: 'For Writers', desc: 'Powerful editor, analytics, and publishing tools that stay out of your way.' },
            { icon: Users, title: 'For Readers', desc: 'Curated, dark-mode-first reading with no distractions.' },
            { icon: Globe, title: 'Open Platform', desc: 'No gatekeepers — if you have something to say, you have a place here.' },
            { icon: TrendingUp, title: 'Built to Scale', desc: 'Fast, optimized infrastructure for thousands of concurrent readers.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}
              className="p-6 rounded-2xl card-hover"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
              <div className="w-10 h-10 rounded-xl grad-bg flex items-center justify-center mb-4" style={{ boxShadow: 'var(--sh-teal)' }}>
                <Icon size={18} color="#0A0A0F" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '.5rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '.9rem', lineHeight: 1.7 }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-10 text-center relative overflow-hidden noise"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', boxShadow: 'var(--sh-glow)' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--grad-brand)', opacity: .6 }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', letterSpacing: '-.03em' }}>
            Ready to <span className="grad-text">illuminate</span>?
          </h2>
          <p style={{ color: 'var(--text-2)', marginBottom: '2rem' }}>Join the Luminary community. Free forever.</p>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '.875rem 2rem' }}>
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
