import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import GallerySection from './components/GallerySection';
import SpecsSection from './components/SpecsSection';
import ContactSection from './components/ContactSection';
import Lightbox from './components/Lightbox';

export default function App() {
  const [isGerman, setIsGerman] = useState(() => {
    const lang = navigator.language || navigator.userLanguage || 'en';
    return lang.toLowerCase().startsWith('de');
  });

  const [loaderHidden, setLoaderHidden] = useState(false);
  const [visibleSections, setVisibleSections] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    document.documentElement.lang = isGerman ? 'de' : 'en';
  }, [isGerman]);

  useEffect(() => {
    const timers = [];

    timers.push(
      setTimeout(() => {
        setLoaderHidden(true);
        [0, 1, 2, 3, 4].forEach((idx) => {
          timers.push(
            setTimeout(() => {
              setVisibleSections((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 120)
          );
        });
      }, 1200)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <>
      <div id="loader" className={loaderHidden ? 'hidden' : ''}>
        <div className="loader-line" />
      </div>

      <Navbar
        isGerman={isGerman}
        onToggleLanguage={() => setIsGerman((prev) => !prev)}
      />

      <main className="container">
        <Hero isGerman={isGerman} visible={visibleSections[0]} />
        <ProjectsSection isGerman={isGerman} visible={visibleSections[1]} />
        <GallerySection
          isGerman={isGerman}
          visible={visibleSections[2]}
          onOpenLightbox={setLightboxItem}
        />
        <SpecsSection isGerman={isGerman} visible={visibleSections[3]} />
        <ContactSection isGerman={isGerman} visible={visibleSections[4]} />
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Ilay Schönknecht</span>
        <a
          href="https://github.com/Ilay-dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/Ilay-dev
        </a>
      </footer>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}

