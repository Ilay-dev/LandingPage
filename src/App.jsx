import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import GallerySection from './components/GallerySection';
import SpecsSection from './components/SpecsSection';
import ContactSection from './components/ContactSection';
import Lightbox from './components/Lightbox';
import { GitHubLogo } from './components/TechIcon';

class SafeSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

export default function App() {
  const [isGerman, setIsGerman] = useState(() => {
    try {
      const lang =
        (typeof navigator !== 'undefined' &&
          (navigator.language || navigator.userLanguage)) ||
        'en';
      return String(lang).toLowerCase().startsWith('de');
    } catch {
      return false;
    }
  });

  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    document.documentElement.lang = isGerman ? 'de' : 'en';
  }, [isGerman]);

  return (
    <>
      <SafeSection>
        <Navbar
          isGerman={isGerman}
          onToggleLanguage={() => setIsGerman((prev) => !prev)}
        />
      </SafeSection>

      <main className="container">
        <SafeSection>
          <Hero isGerman={isGerman} visible={true} />
        </SafeSection>
        <SafeSection>
          <ProjectsSection isGerman={isGerman} visible={true} />
        </SafeSection>
        <SafeSection>
          <GallerySection
            isGerman={isGerman}
            visible={true}
            onOpenLightbox={setLightboxItem}
          />
        </SafeSection>
        <SafeSection>
          <SpecsSection isGerman={isGerman} visible={true} />
        </SafeSection>
        <SafeSection>
          <ContactSection isGerman={isGerman} visible={true} />
        </SafeSection>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Ilay Schönknecht</span>
        <a
          href="https://github.com/Ilay-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github-link"
          aria-label="GitHub (@Ilay-dev)"
        >
          <GitHubLogo size={16} />
          <span>github.com/Ilay-dev</span>
        </a>
      </footer>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
