import React, { useEffect, useRef, useState } from 'react';
import {
  BlenderLogo,
  ChipLogo,
  GitHubLogo,
  MailLogo,
  PythonLogo,
  WebGLLogo,
} from './TechIcon';

const EMAIL_ADDRESS = 'ilay.schoenknecht@gmail.com';
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function ContactSection({ isGerman, visible }) {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let rafId = 0;
    let inView = false;
    let vh = window.innerHeight || 1;
    let lastWm = '';
    let lastGrid = '';

    const updateContactParallax = () => {
      rafId = 0;
      if (!inView) return;
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerOffset = clamp(
        (rect.top + rect.height * 0.5 - vh * 0.55) / (vh * 0.65),
        -1,
        1
      );

      const wm = `${(centerOffset * -32).toFixed(1)}px`;
      const grid = `${(centerOffset * 18).toFixed(1)}px`;
      if (wm !== lastWm) {
        el.style.setProperty('--c-watermark-y', wm);
        lastWm = wm;
      }
      if (grid !== lastGrid) {
        el.style.setProperty('--c-grid-y', grid);
        lastGrid = grid;
      }
    };

    const schedule = () => {
      if (!inView || rafId) return;
      rafId = requestAnimationFrame(updateContactParallax);
    };

    const onResize = () => {
      vh = window.innerHeight || 1;
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

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleCopy = () => {
    const markCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(EMAIL_ADDRESS)
        .then(markCopied)
        .catch(() => {
          fallbackCopyText(EMAIL_ADDRESS, markCopied);
        });
    } else {
      fallbackCopyText(EMAIL_ADDRESS, markCopied);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`contact-parallax-section fade-up ${visible ? 'visible' : ''}`}
      id="contact"
    >
      <div ref={cardRef} className="contact-architectural-card">
        <div className="contact-architectural-card__grid" aria-hidden="true" />
        <div
          className="contact-architectural-card__watermark"
          aria-hidden="true"
        >
          04
        </div>

        <div className="contact-architectural-card__left">
          <div className="contact-status-pill">
            <span className="contact-status-dot" aria-hidden="true" />
            <span>
              {isGerman
                ? '04 // KONTAKT & REPOSITORIES'
                : '04 // CONTACT & REPOSITORIES'}
            </span>
          </div>

          <h2 className="contact-headline">
            {isGerman ? 'Kontakt' : 'Contact'}
          </h2>

          <p className="contact-lead">
            {isGerman
              ? 'Schreib mir gerne direkt per E-Mail oder schau dir meine Open-Source-Projekte, 3D-Tools und Repositories auf GitHub an.'
              : 'Feel free to reach out directly via email or explore my open-source projects, 3D tools, and repositories on GitHub.'}
          </p>

          <div className="contact-domain-pills" aria-hidden="true">
            <span className="contact-domain-pill">
              <WebGLLogo size={13} />
              <span>Web & WebGL</span>
            </span>
            <span className="contact-domain-pill">
              <BlenderLogo size={13} />
              <span>Blender 3D</span>
            </span>
            <span className="contact-domain-pill">
              <PythonLogo size={13} />
              <span>Python</span>
            </span>
            <span className="contact-domain-pill">
              <ChipLogo size={13} />
              <span>ESP32</span>
            </span>
          </div>
        </div>

        <div className="contact-architectural-card__right">
          {/* Email Console Module */}
          <div className="contact-module">
            <div className="contact-module__header">
              <span className="contact-module__label">
                <MailLogo size={14} />
                <span>{isGerman ? 'DIREKTE E-MAIL' : 'DIRECT EMAIL'}</span>
              </span>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="contact-module__direct-link"
              >
                {isGerman ? 'Mail öffnen ↗' : 'Open Mail ↗'}
              </a>
            </div>

            <div className="contact-box">
              <span className="email-text">
                <MailLogo size={16} />
                <span>{EMAIL_ADDRESS}</span>
              </span>
              <button
                type="button"
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied
                  ? isGerman
                    ? '✓ Kopiert'
                    : '✓ Copied'
                  : isGerman
                    ? 'E-Mail kopieren'
                    : 'Copy Email'}
              </button>
            </div>
          </div>

          {/* GitHub Profile Module */}
          <a
            href="https://github.com/Ilay-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-github-card"
            aria-label="GitHub (@Ilay-dev)"
          >
            <div className="contact-github-card__left">
              <span className="contact-github-card__icon">
                <GitHubLogo size={20} />
              </span>
              <div className="contact-github-card__info">
                <span className="contact-github-card__title">
                  github.com/Ilay-dev
                </span>
                <span className="contact-github-card__sub">
                  {isGerman
                    ? 'Alle Open-Source-Repositories & Releases'
                    : 'All open-source repositories & releases'}
                </span>
              </div>
            </div>

            <span className="contact-github-card__cta">
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

const MemoContactSection = React.memo(ContactSection);
export default MemoContactSection;

function fallbackCopyText(text, onSuccess) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    onSuccess();
  } catch {
    // ignore fallback error
  }
}
