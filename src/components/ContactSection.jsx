import React, { useState } from 'react';

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

        <div className="contact-box">
          <span className="email-text">{EMAIL_ADDRESS}</span>
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
      </div>
    </section>
  );
}

