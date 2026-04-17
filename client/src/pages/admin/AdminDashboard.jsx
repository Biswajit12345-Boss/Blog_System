import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, BookOpen, Eye, Heart, TrendingUp, ArrowUpRight, Zap } from 'lucide-react';
import { getStats } from '../../services/adminApi';

const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#14B8A6','#8B5CF6','#EC4899','#3B82F6','#F59E0B','#22C55E','#06B6D4','#A855F7','#EF4444','#10B981'];

function StatCard({ label, value, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '18', border: `1px solid ${color}33` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: '.3rem', letterSpacing: '-.02em' }}>
        {(value || 0).toLocaleString()}
      </p>
      <p style={{ fontSize: '.78rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</p>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: color + '08' }} />
    </motion.div>
  );
}

const TT = {
  contentStyle: { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--sh-lg)', fontFamily: 'var(--font-body)' },
  labelStyle: { color: 'var(--text)', fontWeight: 700 },
  itemStyle: { color: 'var(--text-2)' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}</div>
    </div>
  );

  const chartData = (stats?.monthlyBlogs || []).slice().reverse().map(m => ({
    name: MN[(m._id?.month || 1) - 1],
    posts: m.count || 0,
    views: m.views || 0,
  }));
  const catData = (stats?.blogStats?.byCategory || []).map(c => ({ name: c._id, value: c.count }));
  const roleData = (stats?.usersByRole || []).map(r => ({ name: r._id, value: r.count }));
  const statusData = (stats?.blogStats?.byStatus || []).map(s => ({ name: s._id, value: s.count }));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '.85rem', marginTop: '.2rem' }}>Platform analytics & overview</p>
        </div>
        <Link to="/" target="_blank" className="btn-primary" style={{ fontSize: '.85rem', padding: '.5rem 1.25rem' }}>
          Visit Site <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="#14B8A6" delay={0} />
        <StatCard label="Published" value={stats?.totalBlogs} icon={BookOpen} color="#8B5CF6" delay={.06} />
        <StatCard label="Total Views" value={stats?.totalViews} icon={Eye} color="#3B82F6" delay={.12} />
        <StatCard label="Total Likes" value={stats?.totalLikes} icon={Heart} color="#EC4899" delay={.18} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Line chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Monthly Activity</h3>
              <p style={{ color: 'var(--text-3)', fontSize: '.78rem' }}>Posts published & views over time</p>
            </div>
            <TrendingUp size={16} style={{ color: 'var(--teal)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip {...TT} />
              <Line type="monotone" dataKey="posts" stroke="#14B8A6" strokeWidth={2.5} dot={{ fill: '#14B8A6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Posts" />
              <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Views" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '.3rem' }}>Users by Role</h3>
          <p style={{ color: 'var(--text-3)', fontSize: '.78rem', marginBottom: '1rem' }}>Role distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" innerRadius={38} outerRadius={68} paddingAngle={3} dataKey="value">
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...TT} />
              <Legend iconType="circle" iconSize={7} formatter={v => <span style={{ fontSize: '11px', color: 'var(--text-2)', fontFamily: 'var(--font-body)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>Posts by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11, fontFamily: 'var(--font-body)' }} axisLine={false} tickLine={false} />
              <Tooltip {...TT} />
              <Bar dataKey="value" name="Posts" radius={[6, 6, 0, 0]}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status + recent users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '1rem' }}>Content Status</h3>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {statusData.map(s => (
              <div key={s.name} className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{s.value}</p>
                <span className={`badge badge-${s.name} mt-1`}>{s.name}</span>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-3)', marginBottom: '.75rem' }}>Recent Users</h4>
          <div className="space-y-2">
            {(stats?.recentUsers || []).slice(0, 4).map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=14B8A6&color=0A0A0F`}
                  alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                  <p style={{ fontSize: '.7rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                </div>
                <span className={`badge badge-${u.role} text-[9px]`}>{u.role}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Posts', to: '/admin/blogs', color: '#F59E0B' },
          { label: 'All Users', to: '/admin/users', color: '#14B8A6' },
          { label: 'All Content', to: '/admin/blogs', color: '#8B5CF6' },
          { label: 'Messages', to: '/admin/contact', color: '#EC4899' },
        ].map(({ label, to, color }) => (
          <Link key={to + label} to={to}
            className="p-4 rounded-xl border transition hover:border-[var(--teal-border)] hover:-translate-y-0.5"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}80`, flexShrink: 0 }} />
            <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-2)', fontFamily: 'var(--font-display)' }}>{label}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
