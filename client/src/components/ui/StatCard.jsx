import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, color = 'var(--c-accent)', trend, trendValue, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card"
      style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ background: `${color}20`, borderRadius: 12, padding: '0.65rem', border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trendValue !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600,
            color: trend === 'up' ? 'var(--c-success)' : 'var(--c-error)' }}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}%
          </div>
        )}
      </div>
      <p style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--c-text)', lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p style={{ color: 'var(--c-text3)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 6 }}>{label}</p>
    </motion.div>
  );
}
