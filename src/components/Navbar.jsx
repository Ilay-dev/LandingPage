import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { GitHubLogo } from './TechIcon';

const GooeyNav = React.lazy(() => import('./GooeyNav'));

function Navbar({ isGerman, onToggleLanguage }) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 860px)').matches
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 860px)');
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const items = useMemo(
    () => [
      { label: 'Home', href: '#header' },
      { label: isGerman ? 'Projekte' : 'Work', href: '#projects' },
      { label: '3D-Renders', href: '#blender' },
      { label: isGerman ? 'Kontakt' : 'Contact', href: '#contact' },
    ],
    [isGerman]
  );

  const handleNavChange = useCallback((_index, item) => {
    if (item?.href && item.href.startsWith('#')) {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <header className="site-header">
      <div className="nav-inner">
        <div className="nav-bar-top">
          <a href="#header" className="brand-link">
            <img src="ico.png" alt="Ilay-dev" width="28" height="28" decoding="async" />
            <span>Ilay-dev</span>
          </a>

          <div className="nav-controls">
            <button
              type="button"
              className="lang-btn"
              onClick={onToggleLanguage}
              aria-label="Language switch"
            >
              {isGerman ? 'DE / EN' : 'EN / DE'}
            </button>
            <a
              href="https://github.com/Ilay-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
              aria-label="GitHub (@Ilay-dev)"
              title="GitHub (@Ilay-dev)"
            >
              <GitHubLogo size={18} />
            </a>
          </div>
        </div>

        {isDesktop && (
          <div className="nav-gooey-wrapper">
            <Suspense fallback={null}>
              <GooeyNav
                items={items}
                initialActiveIndex={0}
                theme="dark"
                size="md"
                frame={true}
                particleCount={15}
                spread={56}
                animationTime={600}
                timeVariance={300}
                gooeyness={0.5}
                wobble={0.5}
                hoverEffect={true}
                onChange={handleNavChange}
              />
            </Suspense>
          </div>
        )}
      </div>
    </header>
  );
}

export default React.memo(Navbar);
