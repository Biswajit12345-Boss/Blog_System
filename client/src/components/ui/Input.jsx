import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function Input({
  label,
  error,
  helper,
  icon: Icon,
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-3)' }}>
            <Icon size={18} />
          </div>
        )}
        <input
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full rounded-lg outline-none transition ${sizes[size]} ${Icon ? 'pl-10' : ''} ${className}`}
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text)',
            border: error ? '1.5px solid #F87171' : focused ? '1.5px solid var(--teal)' : '1px solid var(--border)',
            boxShadow: error ? '0 0 0 3px rgba(248,113,113,.1)' : focused ? '0 0 0 3px rgba(20,184,166,.1)' : 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
          }}
          {...props}
        />
      </div>
      <AnimatePresence>
        {(error || helper) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 mt-2 text-xs"
            style={{ color: error ? '#F87171' : 'var(--text-3)' }}
          >
            {error && <AlertCircle size={14} />}
            {error || helper}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Textarea({
  label,
  error,
  helper,
  rows = 4,
  disabled = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {label}
        </label>
      )}
      <textarea
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-lg outline-none transition resize-none ${className}`}
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: error ? '1.5px solid #F87171' : focused ? '1.5px solid var(--teal)' : '1px solid var(--border)',
          boxShadow: error ? '0 0 0 3px rgba(248,113,113,.1)' : focused ? '0 0 0 3px rgba(20,184,166,.1)' : 'none',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
          fontFamily: 'var(--font-body)',
        }}
        {...props}
      />
      <AnimatePresence>
        {(error || helper) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 mt-2 text-xs"
            style={{ color: error ? '#F87171' : 'var(--text-3)' }}
          >
            {error && <AlertCircle size={14} />}
            {error || helper}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Select({
  label,
  error,
  options = [],
  disabled = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
          {label}
        </label>
      )}
      <select
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-4 py-2.5 rounded-lg outline-none transition ${className}`}
        style={{
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: error ? '1.5px solid #F87171' : focused ? '1.5px solid var(--teal)' : '1px solid var(--border)',
          boxShadow: error ? '0 0 0 3px rgba(248,113,113,.1)' : focused ? '0 0 0 3px rgba(20,184,166,.1)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: 'var(--surface)', color: 'var(--text)' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs mt-2" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  );
}
