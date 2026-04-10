import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Force mobile navigation to always start from top.
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
    const timeoutId = window.setTimeout(scrollToTop, 120);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, search]);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return null;
}
