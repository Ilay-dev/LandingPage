import React from 'react';
import TechText from './TechText';
import {
  BlenderLogo,
  CppLogo,
  GitHubLogo,
  JavaScriptLogo,
  PythonLogo,
  ReactLogo,
  WebGLLogo,
} from './TechIcon';

export default function Hero({ isGerman, visible }) {
  return (
    <section
      className={`hero-section fade-up ${visible ? 'visible' : ''}`}
      id="header"
    >
      <div className="tech-text-hero-wrap">
        <TechText
          text="Ilay-dev"
          fontWeight={600}
          fontSize={150}
          reveal="letter"
          dashLength={4}
          dashGap={2}
          specks={15}
          intro="none"
          introDuration={2}
          clickKick
          guides={false}
        />
      </div>

      <div className="hero">
        <div>
          <p className="subtitle">
            {isGerman
              ? 'Ilay Schönknecht — Softwareentwickler & 3D-Künstler'
              : 'Ilay Schönknecht — Software Developer & 3D Artist'}
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
              <BlenderLogo size={16} />
              <span>{isGerman ? '3D-Arbeiten' : '3D Works'}</span>
            </a>
          </div>
        </div>

        <div className="hero-meta-grid">
          <div className="meta-cell">
            <span className="meta-label">{isGerman ? 'Fokus' : 'Focus'}</span>
            <span className="meta-value meta-value--logos">
              <span className="meta-logo-badge" title="React / Web">
                <ReactLogo size={15} />
              </span>
              <span className="meta-logo-badge" title="3D / WebGL">
                <WebGLLogo size={15} />
              </span>
              <span>
                {isGerman
                  ? 'Web, 3D-Grafik & Code'
                  : 'Web, 3D Graphics & Code'}
              </span>
            </span>
          </div>
          <div className="meta-cell">
            <span className="meta-label">
              {isGerman ? '3D-Software' : '3D Software'}
            </span>
            <span className="meta-value meta-value--logos">
              <span className="meta-logo-badge" title="Blender">
                <BlenderLogo size={15} />
              </span>
              <span className="meta-logo-badge" title="WebGL">
                <WebGLLogo size={15} />
              </span>
              <span>Blender / Cycles / WebGL</span>
            </span>
          </div>
          <div className="meta-cell">
            <span className="meta-label">
              {isGerman ? 'Sprachen' : 'Languages'}
            </span>
            <span className="meta-value meta-value--logos">
              <span className="meta-logo-badge" title="JavaScript">
                <JavaScriptLogo size={15} />
              </span>
              <span className="meta-logo-badge" title="Python">
                <PythonLogo size={15} />
              </span>
              <span className="meta-logo-badge" title="C++">
                <CppLogo size={15} />
              </span>
              <span>JavaScript, Python, C++</span>
            </span>
          </div>
          <div className="meta-cell">
            <span className="meta-label">GitHub</span>
            <a
              href="https://github.com/Ilay-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="meta-value meta-value--logos meta-link"
            >
              <span className="meta-logo-badge" title="GitHub">
                <GitHubLogo size={15} />
              </span>
              <span>github.com/Ilay-dev</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
