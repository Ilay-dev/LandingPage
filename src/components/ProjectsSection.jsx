import React, { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import TechIcon, { GitHubLogo } from './TechIcon';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const ProjectSchematic = React.memo(function ProjectSchematic({ id }) {
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
      // Rustify — Pure-Rust Liquid-Glass Music Player, Dual-Deck AI DJ Automixer & 5-Band EQ
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            {/* Dual-deck outer platter rings */}
            <circle
              cx="116"
              cy="98"
              r="52"
              stroke="rgba(244,244,245,0.24)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx="116"
              cy="98"
              r="34"
              stroke="rgba(244,244,245,0.34)"
              strokeWidth="1.1"
            />
            <circle
              cx="244"
              cy="98"
              r="52"
              stroke="rgba(244,244,245,0.24)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx="244"
              cy="98"
              r="34"
              stroke="rgba(244,244,245,0.34)"
              strokeWidth="1.1"
            />
            {/* Phase-lock bridge & EQ baseline */}
            <line
              x1="150"
              y1="98"
              x2="210"
              y2="98"
              stroke="rgba(244,244,245,0.22)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1="76"
              y1="168"
              x2="284"
              y2="168"
              stroke="rgba(244,244,245,0.18)"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            {/* Deck A active arc & spindle */}
            <path
              d="M 116 58 A 40 40 0 1 1 82 118"
              stroke="rgba(244,244,245,0.85)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="116"
              cy="98"
              r="11"
              stroke="rgba(244,244,245,0.75)"
              strokeWidth="1.2"
              fill="rgba(9,9,11,0.75)"
            />
            <circle cx="116" cy="98" r="3" fill="#f4f4f5" />

            {/* Deck B active arc & spindle */}
            <path
              d="M 244 138 A 40 40 0 1 1 278 78"
              stroke="rgba(244,244,245,0.68)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="244"
              cy="98"
              r="11"
              stroke="rgba(244,244,245,0.75)"
              strokeWidth="1.2"
              fill="rgba(9,9,11,0.75)"
            />
            <circle cx="244" cy="98" r="3" fill="#f4f4f5" />

            {/* Beat-grid phase-locked crossfade wave */}
            <path
              d="M 152 98 Q 166 74, 180 98 T 208 98"
              stroke="#f4f4f5"
              strokeWidth="1.4"
              fill="none"
            />
            <circle cx="180" cy="98" r="3.5" fill="#f4f4f5" />

            {/* 5-Band EQ faders */}
            {[
              [124, 152, 16],
              [152, 144, 24],
              [180, 156, 12],
              [208, 148, 20],
              [236, 154, 14],
            ].map(([x, y, h], i) => (
              <g key={i}>
                <rect
                  x={x - 3}
                  y={y}
                  width="6"
                  height={h}
                  rx="2"
                  fill={
                    i === 1 || i === 3
                      ? 'rgba(244,244,245,0.9)'
                      : 'rgba(244,244,245,0.45)'
                  }
                />
                <circle cx={x} cy={y} r="2.2" fill="#f4f4f5" />
              </g>
            ))}
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>PURE RUST // EGUI</span>
            <span>AI DJ · -14 LUFS</span>
            <span>5-BAND EQ · DSP</span>
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

    case '07':
    default:
      // DialDisp — ESP32-C3 Wireless BLE HID Rotary Knob, 24-LED Halo Ring & 2.01" IPS TFT
      return (
        <div className="project-blueprint" aria-hidden="true">
          <div className="project-blueprint__grid" />
          <svg
            className="project-blueprint__svg project-blueprint__layer-1"
            viewBox="0 0 360 220"
            fill="none"
          >
            <circle
              cx="118"
              cy="102"
              r="62"
              stroke="rgba(244,244,245,0.22)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx="118"
              cy="102"
              r="36"
              stroke="rgba(244,244,245,0.34)"
              strokeWidth="1.1"
            />
            <rect
              x="214"
              y="48"
              width="86"
              height="108"
              rx="8"
              stroke="rgba(244,244,245,0.38)"
              strokeWidth="1.2"
              fill="rgba(9,9,11,0.55)"
            />
            <rect
              x="222"
              y="58"
              width="70"
              height="88"
              rx="4"
              stroke="rgba(244,244,245,0.2)"
              strokeWidth="1"
            />
            <path
              d="M 180 92 L 214 92 M 180 112 L 214 112"
              stroke="rgba(244,244,245,0.28)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
          <svg
            className="project-blueprint__svg project-blueprint__layer-2"
            viewBox="0 0 360 220"
            fill="none"
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = ((i / 24) * Math.PI * 2) - Math.PI / 2;
              const x = 118 + Math.cos(angle) * 49;
              const y = 102 + Math.sin(angle) * 49;
              const activeLed = i <= 15;
              return (
                <circle
                  key={i}
                  cx={x.toFixed(2)}
                  cy={y.toFixed(2)}
                  r={activeLed ? 2.4 : 1.7}
                  fill={
                    activeLed
                      ? 'rgba(244,244,245,0.9)'
                      : 'rgba(244,244,245,0.24)'
                  }
                />
              );
            })}
            <circle
              cx="118"
              cy="102"
              r="22"
              stroke="rgba(244,244,245,0.82)"
              strokeWidth="1.35"
              fill="rgba(9,9,11,0.72)"
            />
            <line
              x1="118"
              y1="102"
              x2="130"
              y2="89"
              stroke="#f4f4f5"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="118" cy="102" r="3" fill="#f4f4f5" />
            <rect
              x="234"
              y="68"
              width="34"
              height="6"
              rx="3"
              fill="rgba(244,244,245,0.45)"
            />
            <circle
              cx="257"
              cy="98"
              r="14"
              stroke="rgba(244,244,245,0.35)"
              strokeWidth="1.5"
            />
            <path
              d="M 257 84 A 14 14 0 1 1 245 105"
              stroke="#f4f4f5"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              x="232"
              y="126"
              width="50"
              height="6"
              rx="3"
              fill="rgba(244,244,245,0.2)"
            />
            <rect
              x="232"
              y="126"
              width="33"
              height="6"
              rx="3"
              fill="rgba(244,244,245,0.88)"
            />
          </svg>
          <div className="project-blueprint__hud project-blueprint__layer-3">
            <span>ESP32-C3 // BLE HID</span>
            <span>24x WS2812B RING</span>
            <span>240×296 IPS TFT</span>
          </div>
        </div>
      );
  }
});

function ProjectsSection({ isGerman, visible }) {
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const cardRefs = useRef([]);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;
    let inView = true;
    let vh = window.innerHeight || 1;
    let vw = window.innerWidth || 1;
    const count = PROJECTS.length;
    const lastState = Array.from({ length: count }, () => ({
      tr: '',
      dim: '',
      wm: '',
      l1: '',
      l2: '',
      l3: '',
    }));

    const updateProjectsParallax = () => {
      rafId = 0;
      if (!inView) return;

      const isCompact = vw <= 859;
      const focalY = vh * 0.44;
      const invSpan = 1 / (vh * 0.65);

      // Pass 1: Batch ALL DOM reads first (prevents layout thrashing)
      const itemRects = new Array(count);
      const cardRects = new Array(count);
      for (let i = 0; i < count; i++) {
        const itemEl = itemRefs.current[i];
        const cardEl = cardRefs.current[i];
        if (!itemEl || !cardEl) continue;
        itemRects[i] = itemEl.getBoundingClientRect();
        cardRects[i] = cardEl.getBoundingClientRect();
      }

      // Pass 2: Compute and apply ONLY changed DOM writes
      let closestIdx = 0;
      let closestDist = Infinity;

      for (let i = 0; i < count; i++) {
        const cardEl = cardRefs.current[i];
        const rect = itemRects[i];
        const cardRect = cardRects[i];
        if (!cardEl || !rect || !cardRect) continue;

        const cardCenterY = cardRect.top + cardRect.height * 0.5;
        const distFromFocus = Math.abs(cardCenterY - focalY);
        if (distFromFocus < closestDist) {
          closestDist = distFromFocus;
          closestIdx = i;
        }

        // Skip cards far outside viewport
        if (cardRect.bottom < -vh * 0.6 || cardRect.top > vh * 1.6) continue;

        const normalizedCenter = clamp((cardCenterY - focalY) * invSpan, -1, 1);

        let buryProgress = 0;
        const nextRect = itemRects[i + 1];
        if (nextRect) {
          const stickyTop = isCompact ? 78 + i * 10 : 108 + i * 16;
          const overlapStart = stickyTop + cardRect.height * 0.85;
          const overlapSpan = Math.max(140, cardRect.height * 0.85);
          buryProgress = clamp((overlapStart - nextRect.top) / overlapSpan, 0, 1);
        }

        const entryProgress = clamp((rect.top - vh * 0.72) / (vh * 0.35), 0, 1);
        const scale =
          1 - buryProgress * (isCompact ? 0.032 : 0.048) - entryProgress * 0.03;
        const translateY =
          entryProgress * (isCompact ? 22 : 36) -
          buryProgress * (isCompact ? 8 : 14);
        const dimOverlay = buryProgress * 0.42;

        const watermarkY = normalizedCenter * (isCompact ? -22 : -44);
        const layer1Y = normalizedCenter * (isCompact ? -14 : -26);
        const layer2Y = normalizedCenter * (isCompact ? 16 : 32);
        const layer3Y = normalizedCenter * (isCompact ? -8 : -14);

        const prev = lastState[i];
        const tr = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        const dim = dimOverlay.toFixed(3);
        const wm = `${watermarkY.toFixed(1)}px`;
        const l1 = `${layer1Y.toFixed(1)}px`;
        const l2 = `${layer2Y.toFixed(1)}px`;
        const l3 = `${layer3Y.toFixed(1)}px`;

        if (prev.tr !== tr) {
          cardEl.style.transform = tr;
          prev.tr = tr;
        }
        if (prev.dim !== dim) {
          cardEl.style.setProperty('--p-dim', dim);
          prev.dim = dim;
        }
        if (prev.wm !== wm) {
          cardEl.style.setProperty('--p-watermark-y', wm);
          prev.wm = wm;
        }
        if (prev.l1 !== l1) {
          cardEl.style.setProperty('--p-layer-1', l1);
          prev.l1 = l1;
        }
        if (prev.l2 !== l2) {
          cardEl.style.setProperty('--p-layer-2', l2);
          prev.l2 = l2;
        }
        if (prev.l3 !== l3) {
          cardEl.style.setProperty('--p-layer-3', l3);
          prev.l3 = l3;
        }
      }

      setActiveProjectIdx((prev) => (prev !== closestIdx ? closestIdx : prev));
    };

    const schedule = () => {
      if (!inView || rafId) return;
      rafId = requestAnimationFrame(updateProjectsParallax);
    };

    const onResize = () => {
      vh = window.innerHeight || 1;
      vw = window.innerWidth || 1;
      schedule();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
      },
      { rootMargin: '250px 0px' }
    );
    io.observe(section);

    updateProjectsParallax();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
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
                        <TechIcon name={tag} size={13} />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-parallax-card__cta"
                  >
                    <GitHubLogo size={15} />
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

export default React.memo(ProjectsSection);
