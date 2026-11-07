import React, { useEffect } from 'react';

export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="lightbox open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="lightbox-close" onClick={onClose}>
        ESC / Close
      </button>
      <div className="lightbox-content">
        {item.type === 'video' ? (
          <video src={item.src} controls autoPlay loop playsInline />
        ) : (
          <img src={item.src} alt={item.alt || ''} />
        )}
      </div>
    </div>
  );
}

