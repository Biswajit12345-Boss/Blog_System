import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variants = {
    primary: {
      bg: 'var(--grad-brand)',
      text: '#fff',
      border: 'transparent',
      hover: { opacity: 0.9 },
      shadow: 'var(--sh-teal)',
    },
    secondary: {
      bg: 'var(--surface-2)',
      text: 'var(--text)',
      border: 'var(--border)',
      hover: { bg: 'var(--surface-3)' },
    },
    ghost: {
      bg: 'transparent',
      text: 'var(--text-2)',
      border: 'var(--border)',
      hover: { bg: 'var(--surface-2)', color: 'var(--teal)' },
    },
    danger: {
      bg: 'rgba(248,113,113,.1)',
      text: '#F87171',
      border: 'rgba(248,113,113,.2)',
      hover: { bg: 'rgba(248,113,113,.2)' },
    },
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3',
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <motion.button
      whileHover={!disabled ? v.hover : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ${s} ${className}`}
      style={{
        background: v.bg,
        color: v.text,
        border: `1px solid ${v.border}`,
        boxShadow: variant === 'primary' ? v.shadow : 'none',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...props}
    >
      {loading ? <span className="animate-spin">⟳</span> : Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
}

export function IconButton({
  icon: Icon,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  ...props
}) {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };

  const variants = {
    primary: {
      bg: 'var(--teal-bg)',
      text: 'var(--teal)',
      border: 'var(--teal-border)',
    },
    secondary: {
      bg: 'transparent',
      text: 'var(--text-3)',
      border: 'transparent',
    },
  };

  const v = variants[variant];

  return (
    <motion.button
      whileHover={!disabled ? { backgroundColor: 'var(--surface-2)' } : {}}
      className={`flex items-center justify-center rounded-lg transition ${sizes[size]}`}
      style={{
        background: v.bg,
        color: v.text,
        border: `1px solid ${v.border}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      disabled={disabled}
      {...props}
    >
      <Icon size={16} />
    </motion.button>
  );
}
