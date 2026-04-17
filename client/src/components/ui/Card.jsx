import { motion } from 'framer-motion';

export function Card({
  children,
  hover = true,
  className = '',
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { translateY: -6 } : {}}
      className={`rounded-2xl ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--sh-sm)',
        transition: 'box-shadow 0.3s ease',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-5 border-b ${className}`} style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t flex items-center gap-3 ${className}`} style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel = 'Get started',
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl ${className}`}
      style={{ border: '1px dashed var(--border)', background: 'var(--surface)' }}>
      {Icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon size={48} style={{ color: 'var(--text-3)', marginBottom: '1.5rem' }} />
        </motion.div>
      )}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', maxWidth: '320px', marginBottom: '1.5rem' }}>
          {description}
        </p>
      )}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm transition"
          style={{
            background: 'var(--teal-bg)',
            color: 'var(--teal)',
            border: '1px solid var(--teal-border)',
          }}
        >
          {actionLabel}
        </motion.button>
      )}
    </div>
  );
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) {
  const variants = {
    primary: {
      bg: 'var(--teal-bg)',
      text: 'var(--teal)',
      border: 'var(--teal-border)',
    },
    secondary: {
      bg: 'var(--surface-2)',
      text: 'var(--text-2)',
      border: 'var(--border)',
    },
    success: {
      bg: 'rgba(34,197,94,.12)',
      text: '#86EFAC',
      border: 'rgba(34,197,94,.2)',
    },
    danger: {
      bg: 'rgba(248,113,113,.12)',
      text: '#F87171',
      border: 'rgba(248,113,113,.2)',
    },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${s} ${className}`}
      style={{
        background: v.bg,
        color: v.text,
        border: `1px solid ${v.border}`,
      }}
    >
      {children}
    </span>
  );
}
