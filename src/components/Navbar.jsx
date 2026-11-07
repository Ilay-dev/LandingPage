import React from 'react';

export default function Navbar({ isGerman, onToggleLanguage }) {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <a href="#header" className="brand-link">
          <img src="ico.png" alt="Ilay-dev" />
          <span>Ilay-dev</span>
        </a>

        <nav className="nav-links">
          <a href="#projects" className="nav-link">
            {isGerman ? 'Projekte' : 'Projects'}
          </a>
          <a href="#blender" className="nav-link">
            3D &amp; Blender
          </a>
          <a href="#stack" className="nav-link">
            {isGerman ? 'Überblick' : 'Overview'}
          </a>
          <a href="#contact" className="nav-link">
            {isGerman ? 'Kontakt' : 'Contact'}
          </a>
        </nav>

        <div className="nav-controls">
          <button
            type="button"
            className="lang-btn"
            onClick={onToggleLanguage}
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
    </header>
  );
}

