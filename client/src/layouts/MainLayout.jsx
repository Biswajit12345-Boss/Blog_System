import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const loc = useLocation();
  const [bar, setBar] = useState(false);
  const noFooter = ['/login', '/register'].includes(loc.pathname);

  useEffect(() => {
    setBar(true);
    const t = setTimeout(() => setBar(false), 1000);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => clearTimeout(t);
  }, [loc.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {bar && <div className="loading-bar" />}
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={loc.pathname} className="flex-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: .28, ease: 'easeOut' }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {!noFooter && <Footer />}
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--surface-2)',
          color: 'var(--text)',
          border: '1px solid var(--border-2)',
          borderRadius: '12px',
          fontSize: '.875rem',
          fontFamily: 'var(--font-body)',
          boxShadow: 'var(--sh-xl)',
        },
        success: { iconTheme: { primary: 'var(--teal)', secondary: 'var(--bg)' } },
        duration: 3200,
      }} />
    </div>
  );
}
