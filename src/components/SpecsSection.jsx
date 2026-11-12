import React, { useEffect, useRef } from 'react';
import { WORK_SPECS } from '../data/portfolioData';
import TechIcon, { BlenderLogo, ChipLogo, WebGLLogo } from './TechIcon';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function SpecColumnIcon({ index }) {
  if (index === '01') return <BlenderLogo size={17} />;
  if (index === '02') return <WebGLLogo size={17} />;
  return <ChipLogo size={17} />;
}

function SpecDomainMeta({ index }) {
  if (index === '01') return 'BLENDER // CYCLES // VFX';
  if (index === '02') return 'REACT // WEBGL2 // GLSL';
  return 'PYTHON // C++ // ESP32';
}

function SpecSchematic({ index }) {
  if (index === '01') {
    // 3D Modeling & VFX — Camera Frustum & Raytracing Path Geometry
    return (
      <div className="spec-blueprint" aria-hidden="true">
        <div className="spec-blueprint__grid" />
        <svg
          className="spec-blueprint__svg spec-blueprint__layer-1"
          viewBox="0 0 320 120"
          fill="none"
        >
          <polygon
            points="36,60 118,22 118,98"
            stroke="rgba(244,244,245,0.28)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <circle
            cx="210"
            cy="60"
            r="34"
            stroke="rgba(244,244,245,0.34)"
            strokeWidth="1.1"
          />
          <ellipse
            cx="210"
            cy="60"
            rx="34"
            ry="13"
            stroke="rgba(244,244,245,0.2)"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="spec-blueprint__svg spec-blueprint__layer-2"
          viewBox="0 0 320 120"
          fill="none"
        >
          <polyline
            points="36,60 182,42 238,24 286,48"
            stroke="rgba(244,244,245,0.82)"
            strokeWidth="1.25"
          />
          <circle cx="36" cy="60" r="3.5" fill="#f4f4f5" />
          <circle cx="182" cy="42" r="3" fill="#f4f4f5" />
          <circle cx="238" cy="24" r="2.5" fill="rgba(244,244,245,0.75)" />
        </svg>
        <div className="spec-blueprint__hud">
          <span>PATH_TRACING</span>
          <span>CYCLES_X</span>
        </div>
      </div>
    );
  }

  if (index === '02') {
    // Web & Real-Time 3D — Shader Pipeline & Isometric Mesh Matrix
    return (
      <div className="spec-blueprint" aria-hidden="true">
        <div className="spec-blueprint__grid" />
        <svg
          className="spec-blueprint__svg spec-blueprint__layer-1"
          viewBox="0 0 320 120"
          fill="none"
        >
          <polygon
            points="160,18 236,48 160,78 84,48"
            stroke="rgba(244,244,245,0.3)"
            strokeWidth="1.1"
          />
          <polygon
            points="160,42 236,72 160,102 84,72"
            stroke="rgba(244,244,245,0.18)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>
        <svg
          className="spec-blueprint__svg spec-blueprint__layer-2"
          viewBox="0 0 320 120"
          fill="none"
        >
          <path
            d="M 48 64 C 96 22, 134 98, 180 56 C 218 22, 248 84, 282 48"
            stroke="rgba(244,244,245,0.82)"
            strokeWidth="1.3"
            fill="none"
          />
          {[
            [160, 18],
            [236, 48],
            [160, 78],
            [84, 48],
          ].map(([cx, cy], idx) => (
            <rect
              key={idx}
              x={cx - 2.5}
              y={cy - 2.5}
              width="5"
              height="5"
              fill="#f4f4f5"
            />
          ))}
        </svg>
        <div className="spec-blueprint__hud">
          <span>GLSL_300_ES</span>
          <span>60_FPS_DOM</span>
        </div>
      </div>
    );
  }

  // 03: Software & Hardware — Microcontroller Bus & Automation Nodes
  return (
    <div className="spec-blueprint" aria-hidden="true">
      <div className="spec-blueprint__grid" />
      <svg
        className="spec-blueprint__svg spec-blueprint__layer-1"
        viewBox="0 0 320 120"
        fill="none"
      >
        <rect
          x="124"
          y="28"
          width="72"
          height="64"
          rx="5"
          stroke="rgba(244,244,245,0.38)"
          strokeWidth="1.2"
          fill="rgba(9,9,11,0.6)"
        />
        {[38, 52, 68, 82].map((y, idx) => (
          <React.Fragment key={idx}>
            <line
              x1="54"
              y1={y}
              x2="124"
              y2={y}
              stroke="rgba(244,244,245,0.24)"
              strokeWidth="1"
            />
            <line
              x1="196"
              y1={y}
              x2="266"
              y2={y}
              stroke="rgba(244,244,245,0.24)"
              strokeWidth="1"
            />
          </React.Fragment>
        ))}
      </svg>
      <svg
        className="spec-blueprint__svg spec-blueprint__layer-2"
        viewBox="0 0 320 120"
        fill="none"
      >
        <rect
          x="140"
          y="42"
          width="40"
          height="36"
          rx="3"
          stroke="rgba(244,244,245,0.85)"
          strokeWidth="1.25"
        />
        <circle cx="54" cy="38" r="3" fill="#f4f4f5" />
        <circle cx="266" cy="52" r="3" fill="#f4f4f5" />
        <circle cx="54" cy="68" r="3" fill="rgba(244,244,245,0.7)" />
        <circle cx="266" cy="82" r="3" fill="rgba(244,244,245,0.7)" />
      </svg>
      <div className="spec-blueprint__hud">
        <span>GPIO_BUS</span>
        <span>PY_DAEMON</span>
      </div>
    </div>
  );
}

export default function SpecsSection({ isGerman, visible }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    let rafId = 0;

    const updateSpecsParallax = () => {
      rafId = 0;
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      const isCompact = vw <= 859;

      for (let i = 0; i < WORK_SPECS.length; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const rect = cardEl.getBoundingClientRect();
        const centerOffset = clamp(
          (rect.top + rect.height * 0.5 - vh * 0.52) / (vh * 0.65),
          -1,
          1
        );

        // Staggered vertical parallax per column on desktop, smooth subtle glide on mobile
        const staggerFactor = isCompact ? 1 : 0.75 + i * 0.28;
        const cardY = centerOffset * (isCompact ? 10 : 18) * staggerFactor;
        const watermarkY = centerOffset * (isCompact ? -18 : -34);
        const layer1Y = centerOffset * (isCompact ? -10 : -18);
        const layer2Y = centerOffset * (isCompact ? 12 : 22);

        cardEl.style.transform = `translate3d(0, ${cardY.toFixed(1)}px, 0)`;
        cardEl.style.setProperty(
          '--s-watermark-y',
          `${watermarkY.toFixed(1)}px`
        );
        cardEl.style.setProperty('--s-layer-1', `${layer1Y.toFixed(1)}px`);
        cardEl.style.setProperty('--s-layer-2', `${layer2Y.toFixed(1)}px`);
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateSpecsParallax);
      }
    };

    updateSpecsParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      className={`specs-parallax-section fade-up ${visible ? 'visible' : ''}`}
      id="stack"
    >
      <div className="section-top specs-section-header">
        <div>
          <h2 className="section-title">
            {isGerman ? 'Arbeitsbereiche' : 'Areas of Work'}
          </h2>
          <p className="section-desc">
            {isGerman
              ? 'Photorealistische 3D-Pipelines in Blender, interaktive Echtzeit-WebGL-Anwendungen sowie Python- und Mikrocontroller-Entwicklung.'
              : 'Photorealistic 3D pipelines in Blender, interactive real-time WebGL applications, and Python & microcontroller engineering.'}
          </p>
        </div>

        <div className="projects-index-pill" aria-hidden="true">
          <span className="projects-index-pill__active">01—03</span>
          <span className="projects-index-pill__sep">//</span>
          <span>STACK</span>
        </div>
      </div>

      <div className="specs-bento-grid">
        {WORK_SPECS.map((col, idx) => (
          <article
            key={col.index}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="spec-parallax-card"
          >
            <div className="spec-parallax-card__watermark" aria-hidden="true">
              {col.index}
            </div>

            <div className="spec-parallax-card__header">
              <div className="spec-parallax-card__meta">
                <span className="spec-parallax-card__num">{col.index}</span>
                <span className="spec-parallax-card__domain">
                  <SpecDomainMeta index={col.index} />
                </span>
              </div>
              <span className="spec-col-icon" aria-hidden="true">
                <SpecColumnIcon index={col.index} />
              </span>
            </div>

            <SpecSchematic index={col.index} />

            <div className="spec-parallax-card__body">
              <h3 className="spec-heading">
                {isGerman ? col.heading.de : col.heading.en}
              </h3>
              <p className="spec-text">
                {isGerman ? col.text.de : col.text.en}
              </p>
            </div>

            <ul className="spec-list">
              {col.items.map((tech) => (
                <li key={tech} className="spec-tech-pill">
                  <TechIcon name={tech} size={14} className="spec-tech-logo" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
