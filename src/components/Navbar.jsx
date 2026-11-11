import React, { useEffect, useState } from 'react';
import GooeyNav from './GooeyNav';

export default function Navbar({ isGerman, onToggleLanguage }) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 860 : true
  );

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 860);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const items = [
    { label: 'Home', href: '#header' },
    { label: isGerman ? 'Projekte' : 'Work', href: '#projects' },
    { label: '3D-Renders', href: '#blender' },
    { label: isGerman ? 'Kontakt' : 'Contact', href: '#contact' },
  ];

  return (
    <header className="site-header">
      <div className="nav-inner">
        <div className="nav-bar-top">
          <a href="#header" className="brand-link">
            <img src="ico.png" alt="Ilay-dev" />
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
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {isDesktop && (
          <div className="nav-gooey-wrapper">
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
              onChange={(_index, item) => {
                if (item?.href && item.href.startsWith('#')) {
                  const target = document.querySelector(item.href);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
