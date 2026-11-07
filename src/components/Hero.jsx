import React from 'react';

export default function Hero({ isGerman, visible }) {
  return (
    <section className={`hero fade-up ${visible ? 'visible' : ''}`} id="header">
      <div>
        <h1>Ilay Schönknecht</h1>
        <p className="subtitle">
          {isGerman
            ? 'Softwareentwickler & 3D-Künstler'
            : 'Software Developer & 3D Artist'}
        </p>
        <p className="about-text">
          {isGerman
            ? 'Hallo, ich bin Ilay Schönknecht. Ich entwickle interaktive Webanwendungen, schreibe Python-Tools, programmiere Mikrocontroller-Projekte und erstelle fotorealistische 3D-Umgebungen und Animationen in Blender.'
            : "Hi, I'm Ilay Schönknecht. I build interactive web applications, write Python desktop utilities, develop embedded ESP32 firmware, and create photorealistic 3D environments and animations in Blender."}
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-solid">
            {isGerman ? 'Projekte ansehen' : 'View Projects'}
          </a>
          <a href="#blender" className="btn-outline">
            {isGerman ? '3D-Arbeiten' : '3D Works'}
          </a>
        </div>
      </div>

      <div className="hero-meta-grid">
        <div className="meta-cell">
          <span className="meta-label">{isGerman ? 'Fokus' : 'Focus'}</span>
          <span className="meta-value">
            {isGerman ? 'Web, 3D-Grafik & Code' : 'Web, 3D Graphics & Code'}
          </span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">
            {isGerman ? '3D-Software' : '3D Software'}
          </span>
          <span className="meta-value">Blender / Cycles / WebGL</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">
            {isGerman ? 'Sprachen' : 'Languages'}
          </span>
          <span className="meta-value">JavaScript, Python, C++</span>
        </div>
        <div className="meta-cell">
          <span className="meta-label">GitHub</span>
          <span className="meta-value">github.com/Ilay-dev</span>
        </div>
      </div>
    </section>
  );
}

