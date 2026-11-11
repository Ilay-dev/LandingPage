import React, { useState } from 'react';
import { GitHubLogo, MailLogo } from './TechIcon';

const EMAIL_ADDRESS = 'ilay.schoenknecht@gmail.com';

export default function ContactSection({ isGerman, visible }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(EMAIL_ADDRESS)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <section
      className={`fade-up ${visible ? 'visible' : ''}`}
      id="contact"
    >
      <div className="contact-section">
        <div className="contact-copy">
          <h2>{isGerman ? 'Kontakt' : 'Contact'}</h2>
          <p>
            {isGerman
              ? 'Schreib mir gerne direkt per E-Mail oder schau dir meine Repositories auf GitHub an.'
              : 'Feel free to reach out via email or check out my repositories on GitHub.'}
          </p>
        </div>

        <div className="contact-actions">
          <div className="contact-box">
            <span className="email-text">
              <MailLogo size={16} />
              <span>{EMAIL_ADDRESS}</span>
            </span>
            <button type="button" className="copy-btn" onClick={handleCopy}>
              {copied
                ? isGerman
                  ? 'Kopiert'
                  : 'Copied'
                : isGerman
                  ? 'E-Mail kopieren'
                  : 'Copy Email'}
            </button>
          </div>

          <a
            href="https://github.com/Ilay-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-github-btn"
            aria-label="GitHub (@Ilay-dev)"
            title="GitHub (@Ilay-dev)"
          >
            <GitHubLogo size={18} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
