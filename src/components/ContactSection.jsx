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

export default function ContactSection({ isGerman, visible }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    let rafId = 0;

    const updateContactParallax = () => {
      rafId = 0;
      const el = cardRef.current;
      if (!el) return;

      const vh = window.innerHeight || 1;
      const rect = el.getBoundingClientRect();
      const centerOffset = clamp(
        (rect.top + rect.height * 0.5 - vh * 0.55) / (vh * 0.65),
        -1,
        1
      );

      const watermarkY = centerOffset * -32;
      const gridY = centerOffset * 18;
      el.style.setProperty('--c-watermark-y', `${watermarkY.toFixed(1)}px`);
      el.style.setProperty('--c-grid-y', `${gridY.toFixed(1)}px`);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateContactParallax);
      }
    };

    updateContactParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
