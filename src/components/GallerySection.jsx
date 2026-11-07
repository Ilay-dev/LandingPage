import React, { useEffect, useRef, useState } from 'react';
import { GALLERY_ITEMS } from '../data/portfolioData';
import DepthCanvas from './DepthCanvas';

export default function GallerySection({ isGerman, visible, onOpenLightbox }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [holoMuted, setHoloMuted] = useState(true);
  const holoVideoRef = useRef(null);

  // Shared pointer & gyroscope lerp state for all WebGL DepthCanvas instances
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
  });

  useEffect(() => {
    let rafId = null;

    const handleMouseMove = (e) => {
      pointerRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2.0;
      pointerRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2.0;
    };

    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = e.gamma / 45.0;
        const y = (e.beta - 45) / 45.0;
        pointerRef.current.targetX = Math.max(-1, Math.min(1, x));
        pointerRef.current.targetY = Math.max(-1, Math.min(1, -y));
      }
    };

    const requestGyroPermission = () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        DeviceOrientationEvent.requestPermission().catch(console.error);
      }
    };

    const updateLerp = () => {
      const p = pointerRef.current;
      p.currentX += (p.targetX - p.currentX) * 0.08;
      p.currentY += (p.targetY - p.currentY) * 0.08;
      rafId = requestAnimationFrame(updateLerp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);
    document.body.addEventListener('click', requestGyroPermission, { once: true });
    rafId = requestAnimationFrame(updateLerp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      document.body.removeEventListener('click', requestGyroPermission);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleHoloAudio = (e) => {
    e.stopPropagation();
    const vid = holoVideoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setHoloMuted(vid.muted);
  };

  const filters = [
    { key: 'all', label: isGerman ? 'Alle' : 'All' },
    { key: 'video', label: isGerman ? 'Animationen' : 'Animations' },
    { key: 'render', label: isGerman ? '3D-Renders' : '3D Stills' },
  ];

  const filteredItems =
    activeFilter === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section
      className={`fade-up ${visible ? 'visible' : ''}`}
      id="blender"
    >
      <div className="section-top">
        <div>
          <h2 className="section-title">
            {isGerman ? '3D-Kunst & Blender' : '3D Art & Blender'}
          </h2>
          <p className="section-desc">
            {isGerman
              ? 'Animationen, kameragetrackte Szenen, Produktvisualisierungen und interaktive 3D-Renders.'
              : 'Animations, camera-tracked scenes, product visualizations, and interactive depth-mapped renders.'}
          </p>
        </div>

        <div className="filter-group">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-grid" id="galleryGrid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`gallery-frame ${item.spanClass}`}
            onClick={() => onOpenLightbox(item)}
          >
            {item.type === 'video' ? (
              <>
                <video
                  ref={item.hasAudio ? holoVideoRef : null}
                  className="gallery-item"
                  autoPlay
                  loop
                  muted={item.hasAudio ? holoMuted : true}
                  playsInline
                >
                  <source src={item.src} type="video/mp4" />
                </video>
                {item.hasAudio && (
                  <button
                    type="button"
                    className={`audio-toggle ${!holoMuted ? 'active' : ''}`}
                    onClick={toggleHoloAudio}
                  >
                    {holoMuted
                      ? isGerman
                        ? 'Ton aus'
                        : 'Muted'
                      : isGerman
                        ? 'Ton an'
                        : 'Audio On'}
                  </button>
                )}
              </>
            ) : (
              <DepthCanvas
                src={item.src}
                depthSrc={item.depthSrc}
                alt={item.alt}
                pointerRef={pointerRef}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

