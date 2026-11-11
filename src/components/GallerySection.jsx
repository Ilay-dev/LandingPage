import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GALLERY_ITEMS } from '../data/portfolioData';
import FlexCarousel from './FlexCarousel';

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeOutCubic = (v) => 1 - Math.pow(1 - clamp01(v), 3);

export default function GallerySection({ isGerman, visible }) {
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const headerRef = useRef(null);
  const progressFillRef = useRef(null);
  const carouselRef = useRef(null);

  const [muted, setMuted] = useState(true);
  const [activeSlideItem, setActiveSlideItem] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 859 : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 859);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      const track = trackRef.current;
      const frameEl = frameRef.current;
      if (!track || !frameEl) return;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const totalPinnedScroll = Math.max(1, rect.height - vh);
      const pinnedScrolled = -rect.top;

      // 1. Entry expansion into Fullscreen (completes right as sticky locks at top: 0)
      const expandRaw = clamp01((0.82 * vh - rect.top) / (0.82 * vh));
      const expandEase = easeOutCubic(expandRaw);

      // 2. Subtle exit ease in the final 10% of pinned scroll
      const exitRaw = clamp01(
        (pinnedScrolled - (totalPinnedScroll - 0.1 * vh)) / (0.1 * vh)
      );
      const exitEase = exitRaw * exitRaw;

      const minScale = isMobile ? 0.92 : 0.84;
      const scale =
        (minScale + (1 - minScale) * expandEase) * (1 - exitEase * 0.05);
      const translateY = (1 - expandEase) * (isMobile ? 20 : 42);
      const radius = Math.round(
        (1 - expandEase) * (isMobile ? 16 : 24) + exitEase * 14
      );

      frameEl.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      frameEl.style.borderRadius = `${radius}px`;

      if (headerRef.current) {
        const headerY = (1 - expandEase) * -14;
        headerRef.current.style.transform = `translate3d(0, ${headerY.toFixed(1)}px, 0)`;
      }

      // 3. Horizontal carousel scrub across the Fullscreen pinned range
      const scrubStart = 0.04 * vh;
      const scrubEnd = Math.max(scrubStart + 1, totalPinnedScroll - 0.08 * vh);
      const nextProgress = clamp01(
        (pinnedScrolled - scrubStart) / (scrubEnd - scrubStart)
      );

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${nextProgress.toFixed(4)})`;
      }

      carouselRef.current?.setScrollProgress(nextProgress);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile]);

  const handleRequestScrollProgress = (targetProgress, smooth = false) => {
    const track = trackRef.current;
    if (!track) return;
    const vh = window.innerHeight || 1;
    const rect = track.getBoundingClientRect();
    const trackTopDoc = rect.top + window.scrollY;
    const totalPinnedScroll = Math.max(1, rect.height - vh);
    const scrubStart = 0.04 * vh;
    const scrubEnd = Math.max(scrubStart + 1, totalPinnedScroll - 0.08 * vh);
    const targetY =
      trackTopDoc + scrubStart + clamp01(targetProgress) * (scrubEnd - scrubStart);
    window.scrollTo({
      top: targetY,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const items = useMemo(() => {
    return GALLERY_ITEMS.map((item) => ({
      ...item,
      title:
        typeof item.title === 'object'
          ? isGerman
            ? item.title.de
            : item.title.en
          : item.title || item.alt,
      subtitle:
        typeof item.subtitle === 'object'
          ? isGerman
            ? item.subtitle.de
            : item.subtitle.en
          : item.subtitle,
    }));
  }, [isGerman]);

  const currentItem = activeSlideItem || items[0];

  return (
    <section
      className={`gallery-parallax-section ${visible ? 'visible' : ''}`}
      id="blender"
    >
      <div ref={trackRef} className="gallery-parallax-track">
        <div className="gallery-parallax-sticky">
          <div ref={frameRef} className="gallery-parallax-frame">
            <div ref={headerRef} className="gallery-parallax-header">
              <div className="gallery-parallax-title-wrap">
                <h2 className="section-title">3D-Renders</h2>
                <div className="gallery-parallax-progress" aria-hidden="true">
                  <div
                    ref={progressFillRef}
                    className="gallery-parallax-progress-fill"
                  />
                </div>
              </div>

              {currentItem?.hasAudio && (
                <button
                  type="button"
                  className={`filter-btn ${!muted ? 'active' : ''}`}
                  onClick={() => setMuted((prev) => !prev)}
                >
                  {muted
                    ? isGerman
                      ? 'Ton aus'
                      : 'Muted'
                    : isGerman
                      ? 'Ton an'
                      : 'Audio On'}
                </button>
              )}
            </div>

            <div className="gallery-parallax-carousel-wrap">
              <FlexCarousel
                ref={carouselRef}
                items={items}
                preset="liquid"
                intro="bloom"
                cardHeight={isMobile ? 0.54 : 0.5}
                gap={isMobile ? 16 : 20}
                radius={isMobile ? 10 : 8}
                squeeze={0.2}
                focusOnClick
                captions
                captureWheel={false}
                lensWidth={1.34}
                bend={0.43}
                dispersion={0.77}
                muted={muted}
                flatMobile={isMobile}
                onRequestScrollProgress={handleRequestScrollProgress}
                onChange={(_index, item) => setActiveSlideItem(item)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
