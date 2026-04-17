import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Ban, CheckCircle, Trash2, ChevronDown } from 'lucide-react';
import { getStats } from '../../services/adminApi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ROLES = ['admin','editor','author','contributor','subscriber'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [openRole, setOpenRole] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/allusers', { params: { search, role: roleFilter } });
      setUsers(data.users || []);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetch(); }, [search, roleFilter]);

  const handleRoleChange = async (uid, role) => {
    await api.put(`/auth/users/${uid}/role`, { role });
    setUsers(prev => prev.map(u => u._id === uid ? { ...u, role } : u));
    setOpenRole(null); toast.success('Role updated');
  };
  const handleBlock = async (uid, isBlocked) => {
    await api.put(`/auth/users/${uid}/role`, { isBlocked: !isBlocked });
    setUsers(prev => prev.map(u => u._id === uid ? { ...u, isBlocked: !isBlocked } : u));
    toast.success(isBlocked ? 'Unblocked' : 'Blocked');
  };
  const handleDelete = async (uid) => {
    if (!window.confirm('Delete user permanently?')) return;
    await api.delete(`/auth/users/${uid}`);
    setUsers(prev => prev.filter(u => u._id !== uid)); toast.success('Deleted');
  };

  const ava = (u) => u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=14B8A6&color=0A0A0F`;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-.02em' }}>User Management</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '.85rem' }}>{users.length} users</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="inp" style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="inp" style={{ width: 'auto', padding: '.625rem 1rem' }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'var(--surface-2)' }}>
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(6)].map((_, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}
                </tr>
              )) : users.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * .03 }}
                  className="border-t transition hover:bg-[var(--surface-2)]" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={ava(u)} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: '.82rem', color: 'var(--text-2)' }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <button onClick={() => setOpenRole(openRole === u._id ? null : u._id)}
                        className={`badge badge-${u.role} cursor-pointer flex items-center gap-1`}>
                        {u.role} <ChevronDown size={10} />
                      </button>
                      {openRole === u._id && (
                        <div className="absolute left-0 top-7 z-20 rounded-xl overflow-hidden"
                          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-2)', minWidth: '140px', boxShadow: 'var(--sh-xl)' }}>
                          {ROLES.map(r => (
                            <button key={r} onClick={() => handleRoleChange(u._id, r)}
                              className="w-full text-left px-4 py-2.5 text-sm transition hover:bg-[var(--surface-3)]"
                              style={{ color: u.role === r ? 'var(--teal)' : 'var(--text-2)', fontFamily: 'var(--font-body)', fontWeight: u.role === r ? 700 : 400 }}>
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.isBlocked ? 'badge-pending' : 'badge-published'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span>
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: '.78rem', color: 'var(--text-3)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleBlock(u._id, u.isBlocked)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                        style={{ color: u.isBlocked ? '#4ADE80' : '#FBBF24', background: u.isBlocked ? 'rgba(74,222,128,.1)' : 'rgba(251,191,36,.1)' }}>
                        {u.isBlocked ? <CheckCircle size={13} /> : <Ban size={13} />}
                      </button>
                      <button onClick={() => handleDelete(u._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                        style={{ color: '#F87171', background: 'rgba(248,113,113,.1)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
