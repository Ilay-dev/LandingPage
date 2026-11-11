import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../data/portfolioData';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function ProjectSchematic({ id }) {
  switch (id) {
    case '01':
      // SimpleSplat — 3D Gaussian Splatting Point-Cloud & Covariance Ellipsoids
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <ellipse
              cx="180"
              cy="110"
              rx="118"
              ry="52"
              stroke="rgba(244,244,245,0.16)"
              strokeWidth="1"
              strokeDasharray="4 4"
              transform="rotate(-14 180 110)"
            />
            <ellipse
              cx="180"
              cy="110"
              rx="86"
              ry="38"
              stroke="rgba(244,244,245,0.28)"
              strokeWidth="1"
              transform="rotate(18 180 110)"
            />
            <ellipse
              cx="180"
              cy="110"
              rx="48"
              ry="22"
              stroke="rgba(244,244,245,0.52)"
              strokeWidth="1.2"
              transform="rotate(-8 180 110)"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            {[
              [95, 78, 3.5, 0.45],
              [132, 64, 2.5, 0.65],
              [164, 92, 4.5, 0.9],
              [188, 108, 5.5, 1],
              [212, 86, 3.5, 0.75],
              [248, 102, 2.8, 0.5],
              [145, 134, 3.8, 0.7],
              [198, 138, 4.2, 0.85],
              [228, 126, 3.0, 0.6],
              [118, 114, 3.0, 0.55],
              [265, 132, 2.2, 0.4],
              [174, 72, 3.2, 0.8],
            ].map(([cx, cy, r, op], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={`rgba(244,244,245,${op})`}
              />
            ))}
            <line
              x1="44"
              y1="110"
              x2="316"
              y2="110"
              stroke="rgba(244,244,245,0.12)"
              strokeWidth="1"
            />
            <line
              x1="180"
              y1="26"
              x2="180"
              y2="194"
              stroke="rgba(244,244,245,0.12)"
              strokeWidth="1"
            />
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>SPLATS // 1.42M</span>
            <span>SH_DEG: 3</span>
            <span>60 FPS WEBGL2</span>
          </div>
        </div>
      );

    case '02':
      // PlanetGen — Procedural Terrain & Planetary Geodesic Sphere
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <circle
              cx="180"
              cy="110"
              r="72"
              stroke="rgba(244,244,245,0.42)"
              strokeWidth="1.2"
            />
            <ellipse
              cx="180"
              cy="110"
              rx="72"
              ry="26"
              stroke="rgba(244,244,245,0.22)"
              strokeWidth="1"
            />
            <ellipse
              cx="180"
              cy="110"
              rx="28"
              ry="72"
              stroke="rgba(244,244,245,0.22)"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            <ellipse
              cx="180"
              cy="110"
              rx="124"
              ry="34"
              stroke="rgba(244,244,245,0.55)"
              strokeWidth="1.1"
              strokeDasharray="6 4"
              transform="rotate(-16 180 110)"
            />
            <circle cx="286" cy="81" r="4.5" fill="#f4f4f5" />
            <circle cx="76" cy="138" r="3" fill="rgba(244,244,245,0.65)" />
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>SIMPLEX_NOISE // 8 OCT</span>
            <span>SEED: 0x9F4A</span>
            <span>LOD: ICOSPHERE_6</span>
          </div>
        </div>
      );

    case '03':
      // AudioVizuallizer — Real-Time FFT Frequency Spectrum & Waveform
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <path
              d="M 24 110 Q 68 48, 112 110 T 200 110 T 288 110 T 336 110"
              stroke="rgba(244,244,245,0.2)"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            {[
              22, 36, 54, 82, 64, 98, 126, 88, 114, 138, 104, 76, 92, 60, 44,
              68, 38, 24,
            ].map((barH, idx) => {
              const x = 52 + idx * 14.5;
              const y = 110 - barH / 2;
              return (
                <rect
                  key={idx}
                  x={x}
                  y={y}
                  width="6"
                  height={barH}
                  rx="2"
                  fill={
                    idx >= 6 && idx <= 10
                      ? 'rgba(244,244,245,0.9)'
                      : 'rgba(244,244,245,0.34)'
                  }
                />
              );
            })}
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>FFT_SIZE // 2048</span>
            <span>48.0 KHZ PCM</span>
            <span>WEB AUDIO API</span>
          </div>
        </div>
      );

    case '04':
      // 3dView — Interactive CAD / Mesh Wireframe & Coordinate Gimbal
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <polygon
              points="180,38 258,78 258,148 180,186 102,148 102,78"
              stroke="rgba(244,244,245,0.36)"
              strokeWidth="1.2"
            />
            <line
              x1="180"
              y1="38"
              x2="180"
              y2="114"
              stroke="rgba(244,244,245,0.22)"
              strokeDasharray="3 3"
            />
            <line
              x1="180"
              y1="114"
              x2="258"
              y2="148"
              stroke="rgba(244,244,245,0.22)"
              strokeDasharray="3 3"
            />
            <line
              x1="180"
              y1="114"
              x2="102"
              y2="148"
              stroke="rgba(244,244,245,0.22)"
              strokeDasharray="3 3"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            <polygon
              points="180,38 258,78 180,116 102,78"
              stroke="rgba(244,244,245,0.78)"
              strokeWidth="1.3"
              fill="rgba(244,244,245,0.04)"
            />
            <line
              x1="180"
              y1="116"
              x2="180"
              y2="186"
              stroke="rgba(244,244,245,0.75)"
              strokeWidth="1.3"
            />
            {[
              [180, 38],
              [258, 78],
              [180, 116],
              [102, 78],
              [180, 186],
              [258, 148],
              [102, 148],
            ].map(([vx, vy], i) => (
              <rect
                key={i}
                x={vx - 3}
                y={vy - 3}
                width="6"
                height="6"
                fill="#f4f4f5"
              />
            ))}
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>GLTF / OBJ // PBR</span>
            <span>FOV: 45.0°</span>
            <span>ORBIT_CONTROLS</span>
          </div>
        </div>
      );

    case '05':
      // AutoWrite — Python Desktop Keystroke & Macro Sequencer
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <rect
              x="48"
              y="38"
              width="264"
              height="144"
              rx="6"
              stroke="rgba(244,244,245,0.28)"
              strokeWidth="1.1"
              fill="rgba(9,9,11,0.55)"
            />
            <line
              x1="48"
              y1="62"
              x2="312"
              y2="62"
              stroke="rgba(244,244,245,0.18)"
            />
            <circle cx="64" cy="50" r="3" fill="rgba(244,244,245,0.45)" />
            <circle cx="76" cy="50" r="3" fill="rgba(244,244,245,0.28)" />
            <circle cx="88" cy="50" r="3" fill="rgba(244,244,245,0.18)" />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            <rect
              x="68"
              y="80"
              width="96"
              height="7"
              rx="2"
              fill="rgba(244,244,245,0.78)"
            />
            <rect
              x="172"
              y="80"
              width="54"
              height="7"
              rx="2"
              fill="rgba(244,244,245,0.3)"
            />
            <rect
              x="84"
              y="98"
              width="142"
              height="7"
              rx="2"
              fill="rgba(244,244,245,0.48)"
            />
            <rect
              x="84"
              y="116"
              width="112"
              height="7"
              rx="2"
              fill="rgba(244,244,245,0.65)"
            />
            <rect
              x="68"
              y="134"
              width="78"
              height="7"
              rx="2"
              fill="rgba(244,244,245,0.4)"
            />
            <rect x="154" y="132" width="6" height="11" fill="#f4f4f5" />
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>PYTHON 3 // DAEMON</span>
            <span>LATENCY: 2.4 MS</span>
            <span>HID_SYNTH</span>
          </div>
        </div>
      );

    case '06':
    default:
      // ESP32-Cam — Embedded Optical Sensor & Wi-Fi Telemetry Stream
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <path
              d="M 64 70 L 64 46 L 88 46 M 296 70 L 296 46 L 272 46 M 64 150 L 64 174 L 88 174 M 296 150 L 296 174 L 272 174"
              stroke="rgba(244,244,245,0.55)"
              strokeWidth="1.4"
            />
            <circle
              cx="180"
              cy="110"
              r="52"
              stroke="rgba(244,244,245,0.28)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            <circle
              cx="180"
              cy="110"
              r="28"
              stroke="rgba(244,244,245,0.78)"
              strokeWidth="1.3"
            />
            <line
              x1="164"
              y1="110"
              x2="196"
              y2="110"
              stroke="#f4f4f5"
              strokeWidth="1.1"
            />
            <line
              x1="180"
              y1="94"
              x2="180"
              y2="126"
              stroke="#f4f4f5"
              strokeWidth="1.1"
            />
            <circle cx="80" cy="62" r="3.5" fill="#f4f4f5" />
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>OV2640 // MJPEG</span>
            <span>240 MHZ DUAL-CORE</span>
            <span>RTSP / HTTP</span>
          </div>
        </div>
      );
  }
}

export default function ProjectsSection({ isGerman, visible }) {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const cardRefs = useRef([]);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const updateProjectsParallax = () => {
      rafId = 0;
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      const isCompact = vw <= 859;
      let closestIdx = 0;
      let closestDist = Infinity;

      for (let i = 0; i < PROJECTS.length; i++) {
        const itemEl = itemRefs.current[i];
        const cardEl = cardRefs.current[i];
        if (!itemEl || !cardEl) continue;

        const rect = itemEl.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();

        // Distance of card center from viewport focal line (44% from top)
        const focalY = vh * 0.44;
        const cardCenterY = cardRect.top + cardRect.height * 0.5;
        const normalizedCenter = clamp(
          (cardCenterY - focalY) / (vh * 0.65),
          -1,
          1
        );

        const distFromFocus = Math.abs(cardCenterY - focalY);
        if (distFromFocus < closestDist) {
          closestDist = distFromFocus;
          closestIdx = i;
        }

        // Next item overlap for sticky depth recession
        let buryProgress = 0;
        const nextItemEl = itemRefs.current[i + 1];
        if (nextItemEl) {
          const nextRect = nextItemEl.getBoundingClientRect();
          const stickyTop = isCompact ? 78 + i * 10 : 108 + i * 16;
          const overlapStart = stickyTop + cardRect.height * 0.85;
          const overlapSpan = Math.max(140, cardRect.height * 0.85);
          buryProgress = clamp(
            (overlapStart - nextRect.top) / overlapSpan,
            0,
            1
          );
        }

        // Entry lift when scrolling up from bottom of viewport
        const entryProgress = clamp((rect.top - vh * 0.72) / (vh * 0.35), 0, 1);
        const scale =
          1 - buryProgress * (isCompact ? 0.032 : 0.048) - entryProgress * 0.03;
        const translateY =
          entryProgress * (isCompact ? 22 : 36) -
          buryProgress * (isCompact ? 8 : 14);
        const dimOverlay = buryProgress * 0.42;

        // Multi-layer internal parallax shifts
        const watermarkY = normalizedCenter * (isCompact ? -22 : -44);
        const layer1Y = normalizedCenter * (isCompact ? -14 : -26);
        const layer2Y = normalizedCenter * (isCompact ? 16 : 32);
        const layer3Y = normalizedCenter * (isCompact ? -8 : -14);

        cardEl.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        cardEl.style.setProperty('--p-dim', dimOverlay.toFixed(3));
        cardEl.style.setProperty(
          '--p-watermark-y',
          `${watermarkY.toFixed(1)}px`
        );
        cardEl.style.setProperty('--p-layer-1', `${layer1Y.toFixed(1)}px`);
        cardEl.style.setProperty('--p-layer-2', `${layer2Y.toFixed(1)}px`);
        cardEl.style.setProperty('--p-layer-3', `${layer3Y.toFixed(1)}px`);
      }

      setActiveProjectIdx((prev) => (prev !== closestIdx ? closestIdx : prev));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateProjectsParallax);
      }
    };

    updateProjectsParallax();
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
      ref={sectionRef}
      className={`projects-parallax-section fade-up ${visible ? 'visible' : ''}`}
      id="projects"
    >
      <div className="section-top projects-section-header">
        <div>
          <h2 className="section-title">
            {isGerman ? 'Projekte' : 'Projects'}
          </h2>
          <p className="section-desc">
            {isGerman
              ? 'Open-Source-Webanwendungen, 3D-Viewer, Desktop-Programme und Mikrocontroller-Projekte.'
              : 'Open-source web tools, 3D viewers, desktop software, and microcontroller repositories.'}
          </p>
        </div>

        <div className="projects-index-pill" aria-hidden="true">
          <span className="projects-index-pill__active">
            {String(activeProjectIdx + 1).padStart(2, '0')}
          </span>
          <span className="projects-index-pill__sep">/</span>
          <span>{String(PROJECTS.length).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="projects-parallax-stack">
        {PROJECTS.map((project, index) => (
          <div
            key={project.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="project-parallax-item"
            style={{
              '--stack-index': index,
            }}
          >
            <article
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="project-parallax-card"
            >
              <div className="project-parallax-card__dim" aria-hidden="true" />
              <div
                className="project-parallax-card__watermark"
                aria-hidden="true"
              >
                {project.id}
              </div>

              <div className="project-parallax-card__content">
                <div className="project-parallax-card__top">
                  <div className="project-parallax-card__meta">
                    <span className="project-parallax-card__num">
                      {project.id}
                    </span>
                    <span className="project-parallax-card__divider">//</span>
                    <span className="project-parallax-card__type">
                      {project.type}
                    </span>
                  </div>

                  <h3 className="project-parallax-card__title">
                    {project.title}
                  </h3>

                  <p className="project-parallax-card__desc">
                    {isGerman ? project.desc.de : project.desc.en}
                  </p>
                </div>

                <div className="project-parallax-card__footer">
                  <div className="project-parallax-card__tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-parallax-card__cta"
                  >
                    <span>
                      {isGerman ? 'Repository öffnen' : 'Open Repository'}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>

              <div className="project-parallax-card__visual">
                <ProjectSchematic id={project.id} />
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
