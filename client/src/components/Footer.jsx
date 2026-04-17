import { Link } from 'react-router-dom';
import { Zap, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';

const LINKS = {
  Platform: [['Home','/'],['Explore','/blogs'],['Search','/search'],['About','/about']],
  Topics: [['Technology','/blogs?category=Technology'],['Design','/blogs?category=Design'],['Science','/blogs?category=Science'],['Culture','/blogs?category=Culture']],
  Company: [['Contact','/contact'],['Write for us','/write'],['Privacy','#'],['Terms','#']],
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      {/* Top accent line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--teal), var(--violet), transparent)', opacity: .4 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl grad-bg flex items-center justify-center" style={{ boxShadow: 'var(--sh-teal)' }}>
                <Zap size={16} color="#0A0A0F" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', letterSpacing: '-.02em' }}>
                Lumin<span className="grad-text">ary</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-3)', fontSize: '.875rem', lineHeight: 1.75, maxWidth: '280px', marginBottom: '1.5rem' }}>
              A dark-first editorial platform for writers who craft ideas that matter.
            </p>
            <div className="flex gap-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl border flex items-center justify-center transition"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-3)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-border)'; e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.background = 'var(--teal-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-3)', marginBottom: '1rem' }}>{group}</h4>
              <ul className="space-y-2.5">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm transition" style={{ color: 'var(--text-2)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-5 border-t border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>Get stories in your inbox</p>
            <p style={{ color: 'var(--text-3)', fontSize: '.85rem' }}>Weekly digest, every Monday</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="your@email.com" className="inp" style={{ width: '220px', padding: '.625rem 1rem' }} />
            <button className="btn-primary" style={{ padding: '.625rem 1rem', fontSize: '.85rem', whiteSpace: 'nowrap' }}>
              Subscribe <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: 'var(--text-3)', fontSize: '.78rem' }}>© 2025 Luminary. All rights reserved.</p>
          <p style={{ color: 'var(--text-3)', fontSize: '.78rem' }}>Crafted for writers who mean it ✦</p>
        </div>
      </div>
    </footer>
  );
}
