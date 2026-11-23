import React, { useEffect, useRef, useState } from 'react';
import { getOptimalDpr, isLowEndDevice, prefersReducedMotion } from '../utils/perf';
import './FlexCarousel.css';

const DEFAULT_ITEMS = [];

const BEND_PRESETS = {
  liquid: {
    lensWidth: 0.74,
    lensHeight: 1.18,
    tilt: 62,
    roundness: 1,
    bend: 0.34,
    reach: 0.38,
    curl: 'twist',
    dispersion: 0.45,
    liquid: 0,
    followCursor: false
  },
  ribbon: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.34,
    reach: 0.34,
    curl: 'twist',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  },
  vortex: {
    lensWidth: 0.7,
    lensHeight: 0.95,
    tilt: 30,
    roundness: 1,
    bend: 0.46,
    reach: 0.3,
    curl: 'twist',
    dispersion: 0.5,
    liquid: 0,
    followCursor: false
  },
  arch: {
    lensWidth: 0.8,
    lensHeight: 0.8,
    tilt: 0,
    roundness: 1,
    bend: 0.3,
    reach: 0.36,
    curl: 'rise',
    dispersion: 0.4,
    liquid: 0,
    followCursor: false
  }
};

const FIT_ASPECT = { portrait: 0.75, square: 1, landscape: 4 / 3 };
const INTRO_DURATION = { rise: 2.1, bloom: 1.6, spin: 2.2, deal: 1.5, fade: 0.35 };

const wrap = (value, size) => ((((value + size / 2) % size) + size) % size) - size / 2;
const clamp01 = value => Math.min(Math.max(value, 0), 1);
const easeOut = value => 1 - Math.pow(1 - clamp01(value), 3);
const easeOutQuint = value => 1 - Math.pow(1 - clamp01(value), 5);
const easeInOut = value => {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const cardVertex = `#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`;

const cardFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uShift;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  if (mask <= 0.001) discard;
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`;

const lensVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const buildLensFragment = taps => `#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
uniform float uSceneAlpha;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);

  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;

  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));

  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${taps}; i++) {
      float s = (float(i) + 0.5) / float(${taps});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }

  fragColor = color * uSceneAlpha;
}
`;

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const Digits = React.memo(({ value }) => (
  <span className="flex-carousel__digits">
    {String(value)
      .padStart(2, '0')
      .split('')
      .map((digit, index) => (
        <span key={index} className="flex-carousel__digit">
          <span className="flex-carousel__reel" style={{ transform: `translateY(${-Number(digit) * 10}%)` }}>
            {DIGITS.map(n => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
  </span>
));

const isVideoItem = item =>
  item?.type === 'video' || /\.(mp4|webm|ogg)(\?.*)?$/i.test(item?.src || '');

const hasRVFC =
  typeof HTMLVideoElement !== 'undefined' &&
  'requestVideoFrameCallback' in HTMLVideoElement.prototype;

const FlexCarousel = React.forwardRef(({
  items = DEFAULT_ITEMS,
  preset = 'liquid',
  intro = 'rise',
  cardHeight = 0.5,
  gap = 12,
  radius = 8,
  fit = 'natural',
  lensWidth,
  lensHeight,
  tilt,
  roundness,
  bend,
  reach,
  curl,
  dispersion,
  liquid,
  followCursor,
  squeeze = 0.2,
  focusOnClick = true,
  autoplay = false,
  interval = 4,
  captions = true,
  captureWheel = false,
  muted = true,
  flatMobile = false,
  scrollProgress,
  onRequestScrollProgress,
  onChange,
  onSelect,
  className = '',
  style
}, forwardedRef) => {
  const containerRef = useRef(null);
  const flatTrackRef = useRef(null);
  const flatCardElsRef = useRef([]);
  const flatMediaElsRef = useRef([]);
  const settingsRef = useRef(null);
  const itemsRef = useRef(items);
  const engineRef = useRef(null);
  const scrollProgressRef = useRef(scrollProgress);
  const callbacksRef = useRef({ onChange, onSelect, onRequestScrollProgress });
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);

  const base = BEND_PRESETS[preset] || BEND_PRESETS.liquid;
  const pick = (value, key) => (value === undefined || value === null ? base[key] : value);

  const list = items && items.length ? items : DEFAULT_ITEMS;
  const itemsKey = list.map(item => item.src).join('|');

  React.useImperativeHandle(forwardedRef, () => ({
    setScrollProgress: p => {
      scrollProgressRef.current = p;
      if (settingsRef.current) {
        settingsRef.current.scrollProgress = p;
      }
      engineRef.current?.wake();
    }
  }), []);

  // Defer heavy WebGL & video downloads until the gallery is within 700px of viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container || nearViewport) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: '700px 0px' }
    );
    io.observe(container);
    return () => io.disconnect();
  }, [nearViewport]);

  useEffect(() => {
    if (scrollProgress !== undefined) {
      scrollProgressRef.current = scrollProgress;
    }
  }, [scrollProgress]);

  useEffect(() => {
    itemsRef.current = list;
    callbacksRef.current = { onChange, onSelect, onRequestScrollProgress };
    settingsRef.current = {
      intro,
      cardHeight,
      gap,
      radius,
      fit,
      lensWidth: pick(lensWidth, 'lensWidth'),
      lensHeight: pick(lensHeight, 'lensHeight'),
      tilt: pick(tilt, 'tilt'),
      roundness: pick(roundness, 'roundness'),
      bend: pick(bend, 'bend'),
      reach: pick(reach, 'reach'),
      curl: pick(curl, 'curl'),
      dispersion: pick(dispersion, 'dispersion'),
      liquid: pick(liquid, 'liquid'),
      followCursor: pick(followCursor, 'followCursor'),
      squeeze,
      focusOnClick,
      autoplay,
      interval,
      captureWheel,
      muted,
      flatMobile,
      scrollProgress: scrollProgressRef.current
    };
    engineRef.current?.syncAudio(muted, active);
    engineRef.current?.wake();
  });

  useEffect(() => {
    engineRef.current?.setItems(itemsRef.current);
  }, [itemsKey]);

  // =========================================================================
  // MOBILE LATERAL MODE (`flatMobile = true`)
  // Pure sideways movement without vertical edge distortion, using native
  // GPU-composited <video> and <img> elements with off-screen video pausing
  // and cached style mutations (zero layout thrashing).
  // =========================================================================
  useEffect(() => {
    if (!flatMobile) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    setRevealed(true);
    let width = Math.max(1, container.clientWidth);
    let height = Math.max(1, container.clientHeight);
    let pos = 0;
    let vel = 0;
    let goal = 0;
    let mode = 'scroll';
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let alive = true;
    let dirty = true;
    let activeIndex = -1;
    let focusIndex = -1;
    let focusTarget = 0;
    let focusT = 0;
    let focusV = 0;
    let liftVal = 1;
    let energy = 0;
    let lastPos = 0;
    let resnap = true;

    const aspects = itemsRef.current.map(it => it.aspect || (isVideoItem(it) ? 9 / 16 : 0.8));
    const cardCache = itemsRef.current.map(() => ({
      w: '',
      h: '',
      r: '',
      z: '',
      op: '',
      tr: '',
      mTr: ''
    }));

    const pointer = {
      x: 0,
      y: 0,
      down: false,
      id: -1,
      startX: 0,
      startY: 0,
      startPos: 0,
      dragging: false,
      touch: false,
      samples: []
    };

    const getMetrics = s => {
      const cardH = Math.max(140, s.cardHeight * height);
      const maxCardW = Math.max(160, width * 0.82);
      const fixed = FIT_ASPECT[s.fit];
      const widths = aspects.map(a => Math.min(maxCardW, Math.max(cardH * 0.56, (fixed || a) * cardH)));
      const centers = [];
      let cursor = 0;
      for (let i = 0; i < widths.length; i++) {
        centers.push(cursor + widths[i] / 2);
        cursor += widths[i] + s.gap;
      }
      return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
    };

    const nearest = (m, at) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < m.centers.length; i++) {
        const dist = Math.abs(m.centers[i] - at);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };

    const snapPoint = (m, at) => {
      const i = nearest(m, at);
      return m.centers[i] ?? 0;
    };

    const pauseAllVideos = () => {
      flatMediaElsRef.current.forEach(el => {
        if (el && el.tagName === 'VIDEO' && !el.paused) {
          el.pause();
        }
      });
    };

    const syncAudio = (isMuted, currentIdx) => {
      flatMediaElsRef.current.forEach((el, idx) => {
        if (el && el.tagName === 'VIDEO') {
          const item = itemsRef.current[idx];
          const shouldUnmute = !isMuted && item?.hasAudio && idx === currentIdx;
          el.muted = !shouldUnmute;
        }
      });
    };

    const frame = now => {
      raf = 0;
      if (!alive) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const n = itemsRef.current.length;
      if (!s || !n) return;

      const m = getMetrics(s);
      let animating = false;

      if (resnap) {
        goal = m.centers[0] ?? 0;
        pos = goal;
        vel = 0;
        resnap = false;
      }

      if (typeof s.scrollProgress === 'number' && !pointer.dragging && n > 0) {
        const p = clamp01(s.scrollProgress);
        const rawIdx = p * Math.max(0, n - 1);
        const idx = Math.min(n - 1, Math.floor(rawIdx));
        const nextIdx = Math.min(n - 1, idx + 1);
        const frac = rawIdx - idx;
        const easedFrac = frac * 0.45 + easeInOut(frac) * 0.55;
        const c0 = m.centers[idx] ?? 0;
        const c1 = m.centers[nextIdx] ?? c0;
        goal = c0 + (c1 - c0) * easedFrac;
        if (focusTarget > 0 && Math.abs(goal - pos) > 12) {
          focusTarget = 0;
          setFocusOpen(false);
        }
        mode = 'scroll';
      }

      if (!pointer.dragging) {
        const stiffness = mode === 'scroll' ? 260 : 90;
        const damping = 2 * Math.sqrt(stiffness);
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          const acc = stiffness * (goal - pos) - damping * vel;
          vel += acc * h;
          pos += vel * h;
        }
        if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
          pos = goal;
          vel = 0;
        } else {
          animating = true;
        }
      } else {
        animating = true;
      }

      const current = nearest(m, pos);
      if (current !== activeIndex) {
        activeIndex = current;
        setActive(current);
        syncAudio(s.muted, current);
        callbacksRef.current.onChange?.(current, itemsRef.current[current]);
      }

      const travel = Math.abs(pos - lastPos) / dt;
      lastPos = pos;
      const energyTarget = Math.min(travel / 2600, 1);
      energy += (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.32)));
      if (energy > 0.001) animating = true;

      const focusStiffness = 64;
      focusV += (focusStiffness * (focusTarget - focusT) - 2 * Math.sqrt(focusStiffness) * focusV) * dt;
      focusT += focusV * dt;
      if (Math.abs(focusTarget - focusT) < 0.0005 && Math.abs(focusV) < 0.001) {
        focusT = focusTarget;
        focusV = 0;
      } else {
        animating = true;
      }

      const focusAmount = clamp01(focusT);
      const focusEase = easeInOut(focusAmount);
      const focusW = focusIndex >= 0 && focusIndex < n ? m.widths[focusIndex] : m.cardH;
      const focusScale = Math.max(1, Math.min(1.22, (height * 0.78) / m.cardH, (width * 0.92) / focusW));
      const nextLift = 1 + (focusScale - 1) * focusEase;
      if (Math.abs(nextLift - liftVal) > 0.0005) {
        liftVal = nextLift;
        container.style.setProperty('--flex-carousel-lift', liftVal.toFixed(4));
      }

      const homeX = width / 2;
      const shrink = 1 - clamp01(s.squeeze) * 0.5 * energy;
      const pageVisible = visible && !document.hidden;
      const cardHStr = `${m.cardH.toFixed(1)}px`;
      const radiusStr = `${s.radius}px`;

      for (let i = 0; i < n; i++) {
        const cardEl = flatCardElsRef.current[i];
        const mediaEl = flatMediaElsRef.current[i];
        const cache = cardCache[i];
        if (!cardEl || !cache) continue;

        const w = m.widths[i];
        const rel = m.centers[i] - pos;
        let x = homeX + rel;
        let scale = shrink;
        let alpha = 1;

        const distNorm = Math.min(1, Math.abs(rel) / Math.max(width * 0.65, 1));
        scale *= 1 - distNorm * 0.06;

        if (focusAmount > 0) {
          if (i === focusIndex) {
            scale *= 1 + (focusScale - 1) * focusEase;
          } else {
            const part = easeInOut(focusAmount);
            x += Math.sign(rel || 1) * part * width * 0.55;
            alpha *= 1 - part * 0.85;
          }
        }

        const leftPx = x - w / 2;
        const wStr = `${w.toFixed(1)}px`;
        const zStr = i === current ? '3' : '1';
        const opStr = alpha.toFixed(3);
        const trStr = `translate3d(${leftPx.toFixed(1)}px, -50%, 0) scale(${scale.toFixed(4)})`;

        if (cache.w !== wStr) {
          cardEl.style.width = wStr;
          cache.w = wStr;
        }
        if (cache.h !== cardHStr) {
          cardEl.style.height = cardHStr;
          cache.h = cardHStr;
        }
        if (cache.r !== radiusStr) {
          cardEl.style.borderRadius = radiusStr;
          cache.r = radiusStr;
        }
        if (cache.op !== opStr) {
          cardEl.style.opacity = opStr;
          cache.op = opStr;
        }
        if (cache.tr !== trStr) {
          cardEl.style.transform = trStr;
          cache.tr = trStr;
        }
        if (cache.z !== zStr) {
          cardEl.style.zIndex = zStr;
          cache.z = zStr;
        }

        if (mediaEl) {
          const shiftPx = Math.max(-1, Math.min(1, rel / (width * 0.8))) * -12;
          const mTrStr = `translate3d(${shiftPx.toFixed(1)}px, 0, 0) scale(1.08)`;
          if (cache.mTr !== mTrStr) {
            mediaEl.style.transform = mTrStr;
            cache.mTr = mTrStr;
          }
          if (mediaEl.tagName === 'VIDEO') {
            const cardOnScreen = pageVisible && Math.abs(rel) < width * 0.95 + w * 0.5;
            if (cardOnScreen) {
              if (mediaEl.paused && mediaEl.src) {
                mediaEl.play().catch(() => {});
              }
            } else if (!mediaEl.paused) {
              mediaEl.pause();
            }
          }
        }
      }

      dirty = false;
      if (visible && (animating || dirty || pointer.down)) {
        raf = requestAnimationFrame(frame);
      }
    };

    const start = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const localPoint = e => {
      const rect = container.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    };

    const onPointerDown = e => {
      if (e.button !== undefined && e.button > 0) return;
      const [x, y] = localPoint(e);
      pointer.down = true;
      pointer.id = e.pointerId;
      pointer.touch = e.pointerType === 'touch';
      pointer.startX = x;
      pointer.startY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.startPos = pos;
      pointer.dragging = false;
      pointer.samples = [{ x, t: performance.now() }];
      dirty = true;
      start();
    };

    const onPointerMove = e => {
      if (!pointer.down || e.pointerId !== pointer.id) return;
      const [x, y] = localPoint(e);
      pointer.x = x;
      pointer.y = y;
      const dx = x - pointer.startX;
      const dy = y - pointer.startY;
      const slop = pointer.touch ? 10 : 5;
      if (!pointer.dragging) {
        if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
          pointer.down = false;
          return;
        }
        if (Math.abs(dx) > slop) {
          pointer.dragging = true;
          pointer.startX = x;
          pointer.startPos = pos;
          focusTarget = 0;
          setFocusOpen(false);
          try {
            container.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }
      }
      if (pointer.dragging) {
        const s = settingsRef.current;
        const m = getMetrics(s);
        const minCenter = m.centers[0] ?? 0;
        const maxCenter = m.centers[m.centers.length - 1] ?? 0;
        pos = Math.max(minCenter - 40, Math.min(maxCenter + 40, pointer.startPos - (x - pointer.startX)));
        goal = pos;
        vel = 0;
        if (s && callbacksRef.current.onRequestScrollProgress && m.centers.length > 1) {
          const span = Math.max(1, maxCenter - minCenter);
          const nextP = clamp01((pos - minCenter) / span);
          scrollProgressRef.current = nextP;
          s.scrollProgress = nextP;
          callbacksRef.current.onRequestScrollProgress(nextP, false);
        }
        const now = performance.now();
        pointer.samples.push({ x, t: now });
        while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
        dirty = true;
        start();
      }
    };

    const onPointerUp = e => {
      if (!pointer.down || e.pointerId !== pointer.id) return;
      pointer.down = false;
      const s = settingsRef.current;
      if (!s) return;
      const m = getMetrics(s);
      if (pointer.dragging) {
        pointer.dragging = false;
        const now = performance.now();
        const first = pointer.samples[0];
        const lastSample = pointer.samples[pointer.samples.length - 1];
        let velocity = 0;
        if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 80) {
          velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1000;
        }
        vel = velocity;
        const landing = snapPoint(m, pos + velocity * 0.24);
        goal = landing;
        if (callbacksRef.current.onRequestScrollProgress && m.centers.length > 1) {
          const minCenter = m.centers[0] ?? 0;
          const maxCenter = m.centers[m.centers.length - 1] ?? 0;
          const span = Math.max(1, maxCenter - minCenter);
          const nextP = clamp01((goal - minCenter) / span);
          scrollProgressRef.current = nextP;
          s.scrollProgress = nextP;
          callbacksRef.current.onRequestScrollProgress(nextP, false);
        }
        mode = 'scroll';
        start();
        return;
      }

      if (focusTarget > 0) {
        focusTarget = 0;
        setFocusOpen(false);
        dirty = true;
        start();
        return;
      }

      const [x] = localPoint(e);
      const clickedIdx = nearest(m, pos + (x - width / 2));
      if (clickedIdx === activeIndex && s.focusOnClick) {
        focusIndex = clickedIdx;
        focusTarget = 1;
        setFocusOpen(true);
        dirty = true;
        start();
      } else if (m.centers.length > 1) {
        const nextP = clamp01(clickedIdx / Math.max(1, m.centers.length - 1));
        scrollProgressRef.current = nextP;
        s.scrollProgress = nextP;
        callbacksRef.current.onRequestScrollProgress?.(nextP, true);
        mode = 'scroll';
        dirty = true;
        start();
      }
    };

    const onPointerCancel = () => {
      pointer.down = false;
      pointer.dragging = false;
      dirty = true;
      start();
    };

    const onVisibility = () => {
      if (document.hidden) {
        pauseAllVideos();
      } else if (visible) {
        dirty = true;
        start();
      }
    };

    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerup', onPointerUp, { passive: true });
    container.addEventListener('pointercancel', onPointerCancel, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(entries => {
      const box = entries[0]?.contentRect;
      width = Math.max(1, box ? box.width : container.clientWidth);
      height = Math.max(1, box ? box.height : container.clientHeight);
      dirty = true;
      start();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        pauseAllVideos();
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      } else {
        dirty = true;
        start();
      }
    });
    intersectionObserver.observe(container);

    engineRef.current = {
      wake: () => {
        dirty = true;
        start();
      },
      setItems: () => {
        resnap = true;
        dirty = true;
        start();
      },
      syncAudio
    };

    dirty = true;
    start();

    return () => {
      alive = false;
      visible = false;
      engineRef.current = null;
      cancelAnimationFrame(raf);
      pauseAllVideos();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerCancel);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [flatMobile, itemsKey, nearViewport]);

  // =========================================================================
  // DESKTOP WEBGL2 LIQUID LENS MODE (`flatMobile = false`)
  // Dynamically imports `ogl` only on desktop near viewport, pauses off-screen
  // videos, uploads video textures only on new frames (RVFC / currentTime diff),
  // and scales pixel budget + dispersion taps for smooth old-device performance.
  // =========================================================================
  useEffect(() => {
    if (flatMobile || !nearViewport) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let cleanupFn = null;

    import('ogl').then(({ Renderer, Program, Mesh, Triangle, Plane, Texture, RenderTarget }) => {
      if (cancelled) return;

      const lowEnd = isLowEndDevice();
      const pixelBudget = lowEnd ? 1.8e6 : 3.2e6;
      const maxDpr = getOptimalDpr(1.75, 1.25);
      const taps = lowEnd ? 6 : 8;
      const lensFragment = buildLensFragment(taps);

      const renderer = new Renderer({
        dpr: maxDpr,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        powerPreference: 'default'
      });
      const gl = renderer.gl;
      if (!renderer.isWebgl2) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return;
      }
      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.setAttribute('aria-hidden', 'true');
      container.prepend(canvas);

      const cardResArr = [1, 1];
      const cardRectArr = [0, 0, 1, 1];
      const cardSizeArr = [1, 1];
      const lensResArr = [1, 1];
      const lensCenterArr = [0, 0];
      const lensHalfArr = [1, 1];

      const cardProgram = new Program(gl, {
        vertex: cardVertex,
        fragment: cardFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          tMap: { value: new Texture(gl) },
          uRect: { value: cardRectArr },
          uResolution: { value: cardResArr },
          uSize: { value: cardSizeArr },
          uImage: { value: [1, 1] },
          uRadius: { value: 16 },
          uAlpha: { value: 1 },
          uReady: { value: 0 },
          uShift: { value: 0 },
          uDpr: { value: 1 },
          uPlaceholder: { value: [0.1, 0.1, 0.12] }
        }
      });
      cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });

      const target = new RenderTarget(gl, {
        width: 2,
        height: 2,
        depth: false,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR
      });

      const lensUniforms = {
        tScene: { value: target.texture },
        uResolution: { value: lensResArr },
        uDpr: { value: 1 },
        uCenter: { value: lensCenterArr },
        uHalf: { value: lensHalfArr },
        uAngle: { value: 0 },
        uExponent: { value: 2 },
        uInner: { value: 60 },
        uOuter: { value: 80 },
        uFlow: { value: 0 },
        uCurl: { value: 0 },
        uDispersion: { value: 0 },
        uStrength: { value: 0 },
        uSceneAlpha: { value: 0 }
      };
      const lensMesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, {
          vertex: lensVertex,
          fragment: lensFragment,
          uniforms: lensUniforms,
          depthTest: false,
          depthWrite: false
        })
      });

      const reducedMotion = prefersReducedMotion();
      const anisotropy = !lowEnd && renderer.getExtension('EXT_texture_filter_anisotropic') ? 4 : 0;

      let slots = [];
      let width = 1;
      let height = 1;
      let pos = 0;
      let vel = 0;
      let goal = 0;
      let mode = 'spring';
      let wheelAt = 0;
      let raf = 0;
      let last = performance.now();
      let visible = false;
      let alive = true;
      let dirty = true;
      let activeIndex = -1;
      let interactedAt = -Infinity;
      let autoplayAt = performance.now();
      let hasFocus = false;
      let deform = 0;
      let deformVel = 0;
      let layout = null;
      let resnap = false;
      let hover = '';
      let lift = 1;
      let energy = 0;
      let lastPos = 0;
      const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false };
      const pointer = {
        x: 0,
        y: 0,
        over: false,
        down: false,
        id: -1,
        startX: 0,
        startY: 0,
        startPos: 0,
        dragging: false,
        touch: false,
        samples: []
      };
      const introState = { kind: 'none', t: 0, running: false, done: false, readyAt: 0 };
      const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
      let instances = [];

      const pauseAllSlotVideos = () => {
        for (let i = 0; i < slots.length; i++) {
          const v = slots[i].video;
          if (v && !v.paused) v.pause();
        }
      };

      const loadSlot = (item, index) => {
        const videoSlot = isVideoItem(item);
        const texture = new Texture(gl, {
          generateMipmaps: !videoSlot,
          minFilter: videoSlot ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR,
          magFilter: gl.LINEAR,
          anisotropy
        });
        const slot = {
          item,
          index,
          texture,
          isVideo: videoSlot,
          video: null,
          rvfcId: 0,
          frameDirty: false,
          lastVideoTime: -1,
          aspect: item.aspect || 0.8,
          loaded: false,
          failed: false,
          ready: 0,
          color: [0.1, 0.1, 0.12],
          image: [1, 1],
          dispose: () => {}
        };

        if (videoSlot) {
          const video = document.createElement('video');
          slot.video = video;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = 'metadata';
          video.setAttribute('muted', '');
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');

          const scheduleVideoCallback = () => {
            if (!alive || !hasRVFC) return;
            slot.rvfcId = video.requestVideoFrameCallback(() => {
              slot.rvfcId = 0;
              if (!alive) return;
              slot.frameDirty = true;
              if (visible && !document.hidden) {
                start();
              }
              if (!video.paused) {
                scheduleVideoCallback();
              }
            });
          };

          const onReady = () => {
            if (!alive || !slots.includes(slot)) return;
            const vw = video.videoWidth || 9;
            const vh = video.videoHeight || 16;
            slot.image = [vw, vh];
            slot.aspect = vw / vh;
            if (video.readyState >= 2) {
              slot.frameDirty = true;
              slot.lastVideoTime = video.currentTime;
              texture.image = video;
              texture.needsUpdate = true;
              try {
                texture.update();
              } catch {
                // ignore transient upload errors
              }
              if (!slot.loaded) {
                slot.loaded = true;
                dirty = true;
                start();
              }
            }
          };

          const onPlaying = () => {
            if (hasRVFC && !slot.rvfcId) scheduleVideoCallback();
            onReady();
          };

          const onError = () => {
            if (!alive) return;
            slot.failed = true;
            dirty = true;
            start();
          };

          video.addEventListener('loadedmetadata', onReady);
          video.addEventListener('loadeddata', onReady);
          video.addEventListener('canplay', onReady);
          video.addEventListener('playing', onPlaying);
          video.addEventListener('error', onError);
          video.src = item.src;
          video.load();

          slot.dispose = () => {
            if (hasRVFC && slot.rvfcId && video.cancelVideoFrameCallback) {
              video.cancelVideoFrameCallback(slot.rvfcId);
              slot.rvfcId = 0;
            }
            video.removeEventListener('loadedmetadata', onReady);
            video.removeEventListener('loadeddata', onReady);
            video.removeEventListener('canplay', onReady);
            video.removeEventListener('playing', onPlaying);
            video.removeEventListener('error', onError);
            try {
              video.pause();
              video.removeAttribute('src');
              video.load();
            } catch {
              // ignore cleanup errors
            }
            gl.deleteTexture(texture.texture);
          };
          return slot;
        }

        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          if (!alive || !slots.includes(slot)) return;
          texture.image = image;
          texture.update();
          slot.image = [image.naturalWidth || 1, image.naturalHeight || 1];
          slot.aspect = slot.image[0] / slot.image[1];
          try {
            const probe = document.createElement('canvas');
            probe.width = 8;
            probe.height = 8;
            const ctx = probe.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(image, 0, 0, 8, 8);
              const data = ctx.getImageData(0, 0, 8, 8).data;
              const avg = [0, 0, 0];
              for (let i = 0; i < data.length; i += 4) {
                avg[0] += data[i];
                avg[1] += data[i + 1];
                avg[2] += data[i + 2];
              }
              slot.color = avg.map(v => v / 64 / 255);
            }
          } catch {
            slot.color = [0.1, 0.1, 0.12];
          }
          slot.loaded = true;
          dirty = true;
          start();
        };
        image.onerror = () => {
          if (!alive) return;
          slot.failed = true;
          dirty = true;
          start();
        };
        image.src = item.src;
        slot.dispose = () => {
          image.onload = null;
          image.onerror = null;
          gl.deleteTexture(texture.texture);
        };
        return slot;
      };

      const syncAudio = (isMuted, currentIdx) => {
        slots.forEach((slot, idx) => {
          if (slot.isVideo && slot.video) {
            const shouldUnmute = !isMuted && slot.item?.hasAudio && idx === currentIdx;
            slot.video.muted = !shouldUnmute;
          }
        });
      };

      const setItems = next => {
        slots.forEach(slot => slot.dispose());
        slots = next.map(loadSlot);
        activeIndex = 0;
        setActive(0);
        layout = null;
        resnap = true;
        focus.target = 0;
        focus.t = 0;
        focus.v = 0;
        focus.pending = -1;
        setFocusOpen(false);
        introState.readyAt = performance.now();
        dirty = true;
        start();
      };

      const metrics = s => {
        const cardH = Math.max(24, s.cardHeight * height);
        const fixed = FIT_ASPECT[s.fit];
        const maxCardW = Math.max(120, width * 0.78);
        const widths = slots.map(slot => Math.min(maxCardW, (fixed || slot.aspect) * cardH));
        const centers = [];
        let cursor = 0;
        for (let i = 0; i < widths.length; i++) {
          centers.push(cursor + widths[i] / 2);
          cursor += widths[i] + s.gap;
        }
        return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
      };

      const nearest = (m, at) => {
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < m.centers.length; i++) {
          const dist = Math.abs(wrap(m.centers[i] - at, m.loop));
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
        return best;
      };

      const snapPoint = (m, at) => {
        const i = nearest(m, at);
        return at + wrap(m.centers[i] - at, m.loop);
      };

      const remap = (from, to, at) => {
        const i = nearest(from, at);
        const offset = wrap(at - from.centers[i], from.loop);
        const cycles = Math.round((at - offset - from.centers[i]) / from.loop);
        return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i]);
      };

      const step = (m, delta) => {
        let at = snapPoint(m, goal);
        let index = nearest(m, at);
        const n = m.centers.length;
        for (let k = 0; k < Math.abs(delta); k++) {
          const next = (index + (delta > 0 ? 1 : n - 1)) % n;
          const distance =
            delta > 0
              ? m.widths[index] / 2 + m.gap + m.widths[next] / 2
              : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2);
          at += distance;
          index = next;
        }
        goal = at;
        mode = 'spring';
        dirty = true;
        start();
      };

      const goTo = (m, index) => {
        const i = ((index % m.centers.length) + m.centers.length) % m.centers.length;
        goal = goal + wrap(m.centers[i] - goal, m.loop);
        mode = 'spring';
        dirty = true;
        start();
      };

      const openFocus = index => {
        focus.index = index;
        focus.pending = -1;
        focus.target = 1;
        setFocusOpen(true);
        dirty = true;
        start();
      };

      const closeFocus = () => {
        focus.pending = -1;
        if (focus.target === 0) return false;
        focus.target = 0;
        setFocusOpen(false);
        dirty = true;
        start();
        return true;
      };

      const skipIntro = () => {
        if (introState.running) introState.t = 1;
      };

      const introEffects = () => {
        const t = introState.running ? introState.t : introState.done ? 1 : 0;
        const e = { sceneAlpha: 1, strength: 1, card: null };
        if (!introState.done && !introState.running) {
          e.sceneAlpha = 0;
          e.strength = 0;
          return e;
        }
        if (t >= 1) return e;
        const kind = introState.kind;
        if (kind === 'rise') {
          e.strength = easeInOut((t - 0.3) / 0.65);
          e.card = rel => {
            const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34;
            const local = clamp01((t - delay) / 0.6);
            return {
              alpha: clamp01(local * 4),
              x: 0,
              y: (1 - easeOutQuint(local)) * height * 0.62,
              scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82)
            };
          };
        } else if (kind === 'bloom') {
          e.strength = easeInOut((t - 0.2) / 0.8);
          e.card = rel => {
            const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25;
            const local = easeOut((t - delay) / 0.55);
            return { alpha: local, x: 0, y: 0, scale: 0.92 + 0.08 * local };
          };
        } else if (kind === 'spin') {
          e.sceneAlpha = easeOut(t / 0.25);
          e.strength = easeOut((t - 0.55) / 0.45);
        } else if (kind === 'deal') {
          e.strength = easeOut((t - 0.45) / 0.5);
          e.card = rel => {
            const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3;
            const local = easeOut((t - 0.12 - spread) / 0.5);
            return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - local), y: 0, scale: 1 };
          };
        } else {
          e.sceneAlpha = easeOut(t);
          e.strength = easeOut(t);
        }
        return e;
      };

      const beginIntro = (s, m) => {
        const kind = reducedMotion && s.intro !== 'none' ? 'fade' : s.intro;
        introState.kind = INTRO_DURATION[kind] ? kind : 'none';
        introState.running = introState.kind !== 'none';
        introState.done = !introState.running;
        introState.t = 0;
        setRevealed(true);
        if (introState.kind === 'spin') {
          const distance = m.loop * 1.6 + width;
          pos = goal + distance;
          vel = -distance * 3;
          mode = 'spring';
        }
      };

      let resizePending = false;
      const applyResize = () => {
        width = Math.max(1, container.clientWidth);
        height = Math.max(1, container.clientHeight);
        renderer.dpr = Math.min(maxDpr, Math.sqrt(pixelBudget / (width * height)));
        renderer.setSize(width, height);
        target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
        target.texture.bind();
        gl.generateMipmap(gl.TEXTURE_2D);
        lensUniforms.tScene.value = target.texture;
        dirty = true;
      };

      const resize = () => {
        resizePending = true;
        start();
      };

      const updateHoverAttr = s => {
        let nextHover = '';
        if (pointer.over && !pointer.dragging && introState.done && s?.focusOnClick) {
          const hit = instances.find(
            inst => pointer.x >= inst.x0 && pointer.x <= inst.x1 && pointer.y >= inst.y0 && pointer.y <= inst.y1
          );
          if (focus.target > 0) nextHover = 'close';
          else if (hit) nextHover = 'open';
        }
        if (nextHover !== hover) {
          hover = nextHover;
          if (hover) container.setAttribute('data-hover', hover);
          else container.removeAttribute('data-hover');
        }
      };

      const frame = now => {
        raf = 0;
        if (resizePending) {
          resizePending = false;
          applyResize();
        }
        if (!alive || !visible || document.hidden) return;
        const s = settingsRef.current;
        const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
        last = now;
        if (!s || !slots.length) {
          return;
        }

        const m = metrics(s);
        const n = slots.length;
        let animating = false;

        if (resnap) {
          goal = m.centers[0] ?? 0;
          pos = goal;
          vel = 0;
          resnap = false;
        } else if (layout && layout.loop !== m.loop) {
          pos = remap(layout, m, pos);
          goal = remap(layout, m, goal);
          pointer.startPos = pos + (pointer.x - pointer.startX);
          animating = true;
        }
        layout = m;

        if (!introState.running && !introState.done) {
          const allSettled = slots.every(slot => slot.loaded || slot.failed);
          if (allSettled || now - introState.readyAt > 900) {
            goal = snapPoint(m, goal);
            pos = goal;
            beginIntro(s, m);
          }
        }
        if (introState.running) {
          introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1));
          if (introState.t >= 1) {
            introState.running = false;
            introState.done = true;
            setRevealed(true);
          }
          animating = true;
        }

        if (typeof s.scrollProgress === 'number' && !pointer.dragging && n > 0) {
          const p = clamp01(s.scrollProgress);
          const rawIdx = p * Math.max(0, n - 1);
          const idx = Math.min(n - 1, Math.floor(rawIdx));
          const nextIdx = Math.min(n - 1, idx + 1);
          const frac = rawIdx - idx;
          const easedFrac = frac * 0.45 + easeInOut(frac) * 0.55;
          const c0 = m.centers[idx] ?? 0;
          const c1 = m.centers[nextIdx] ?? c0;
          goal = c0 + (c1 - c0) * easedFrac;
          if (focus.target > 0 && Math.abs(goal - pos) > 12) {
            closeFocus();
          }
          mode = 'scroll';
        } else if (mode === 'wheel' && now - wheelAt > 150) {
          goal = snapPoint(m, goal);
          mode = 'spring';
        }
        if (!pointer.dragging) {
          const spinning = introState.running && introState.kind === 'spin';
          const stiffness = spinning ? 9 : mode === 'scroll' ? 260 : mode === 'wheel' ? 80 : 55;
          const damping = 2 * Math.sqrt(stiffness);
          const steps = Math.ceil(dt / (1 / 240));
          const h = dt / steps;
          for (let i = 0; i < steps; i++) {
            const acc = stiffness * (goal - pos) - damping * vel;
            vel += acc * h;
            pos += vel * h;
          }
          if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
            pos = goal;
            vel = 0;
          } else {
            animating = true;
          }
        } else {
          animating = true;
        }

        if (Math.abs(pos) > m.loop * 8) {
          const shift = Math.round(pos / m.loop) * m.loop;
          pos -= shift;
          goal -= shift;
          pointer.startPos -= shift;
        }

        const current = nearest(m, pos);
        if (current !== activeIndex) {
          activeIndex = current;
          setActive(current);
          syncAudio(s.muted, current);
          callbacksRef.current.onChange?.(current, itemsRef.current[current]);
        }

        if (focus.pending >= 0 && mode === 'spring' && Math.abs(goal - pos) < 1.5 && Math.abs(vel) < 30) {
          if (current === focus.pending) openFocus(current);
          else focus.pending = -1;
        }

        if (
          s.autoplay &&
          !reducedMotion &&
          introState.done &&
          focus.target === 0 &&
          focus.t < 0.01 &&
          !pointer.over &&
          !pointer.down &&
          !hasFocus &&
          mode === 'spring' &&
          Math.abs(goal - pos) < 1 &&
          now - interactedAt > 3000 &&
          now - autoplayAt > s.interval * 1000
        ) {
          autoplayAt = now;
          step(m, 1);
        }
        if (s.autoplay && !reducedMotion) animating = true;

        const travel = Math.abs(pos - lastPos) / dt;
        lastPos = pos;
        const energyTarget = reducedMotion ? 0 : Math.min(travel / 2600, 1);
        energy += (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.35)));
        if (energy > 0.001) animating = true;
        const liquidAmount = reducedMotion ? 0 : s.liquid;
        const push = Math.max(-1, Math.min(1, vel / 2200));
        const deformStiffness = 120;
        const deformDamping = 2 * Math.sqrt(deformStiffness) * 0.32;
        deformVel += (deformStiffness * (push - deform) - deformDamping * deformVel) * dt;
        deform += deformVel * dt;
        if (Math.abs(deform) > 0.0005 || Math.abs(deformVel) > 0.005) animating = true;

        const focusStiffness = 64;
        focus.v += (focusStiffness * (focus.target - focus.t) - 2 * Math.sqrt(focusStiffness) * focus.v) * dt;
        focus.t += focus.v * dt;
        if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) {
          focus.t = focus.target;
          focus.v = 0;
        } else {
          animating = true;
        }
        const focusAmount = clamp01(focus.t);
        const focusEase = easeInOut(focusAmount);
        const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH;
        const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW));
        const nextLift = 1 + (focusScale - 1) * focusEase;
        if (Math.abs(nextLift - lift) > 0.0005) {
          lift = nextLift;
          container.style.setProperty('--flex-carousel-lift', lift.toFixed(4));
        }

        const effects = introEffects();

        const homeX = width / 2;
        const homeY = height / 2;
        const follow = s.followCursor && pointer.over && !pointer.dragging && !pointer.touch && focus.target === 0;
        const aimX = follow ? pointer.x : homeX;
        const aimY = follow ? pointer.y : homeY;
        if (!lens.ready) {
          lens.x = homeX;
          lens.y = homeY;
          lens.ready = true;
        }
        const lensK = 110;
        const lensC = 2 * Math.sqrt(lensK) * 0.8;
        lens.vx += (lensK * (aimX - lens.x) - lensC * lens.vx) * dt;
        lens.vy += (lensK * (aimY - lens.y) - lensC * lens.vy) * dt;
        lens.x += lens.vx * dt;
        lens.y += lens.vy * dt;
        if (Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 || Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5)
          animating = true;

        const cardH = m.cardH;
        let halfW = (s.lensWidth * width) / 2;
        let halfH = (s.lensHeight * width) / 2;
        const squash = Math.abs(deform) * liquidAmount;
        halfW *= 1 + squash * 0.16;
        halfH *= 1 - squash * 0.08;
        const lensX = lens.x - deform * 14 * liquidAmount;

        // Play/pause videos based on on-screen visibility, and ONLY upload texture when a new video frame arrived
        let fallbackVideoPolling = false;
        for (let i = 0; i < n; i++) {
          const slot = slots[i];
          if (slot.isVideo && slot.video) {
            const baseRel = wrap(m.centers[i] - pos, m.loop);
            const onScreen = Math.abs(baseRel) - m.widths[i] / 2 <= width * 0.72 + 80;
            if (onScreen) {
              if (slot.video.paused) {
                slot.video.play().catch(() => {});
              }
              if (slot.video.videoWidth > 0 && slot.video.videoHeight > 0) {
                if (slot.image[0] !== slot.video.videoWidth || slot.image[1] !== slot.video.videoHeight) {
                  slot.image = [slot.video.videoWidth, slot.video.videoHeight];
                  slot.aspect = slot.video.videoWidth / slot.video.videoHeight;
                }
              }
              if (slot.video.readyState >= 2) {
                const videoTime = slot.video.currentTime;
                const hasNewFrame = hasRVFC
                  ? slot.frameDirty || videoTime !== slot.lastVideoTime
                  : videoTime !== slot.lastVideoTime;
                if (hasNewFrame) {
                  slot.frameDirty = false;
                  slot.lastVideoTime = videoTime;
                  slot.texture.image = slot.video;
                  slot.texture.needsUpdate = true;
                  try {
                    slot.texture.update();
                  } catch {
                    // ignore transient video frame upload error
                  }
                  if (!slot.loaded) {
                    slot.loaded = true;
                  }
                  dirty = true;
                }
                if (!hasRVFC) fallbackVideoPolling = true;
              }
            } else if (!slot.video.paused) {
              slot.video.pause();
            }
          }
          if (slot.loaded && slot.ready < 1) {
            slot.ready = Math.min(1, slot.ready + dt / 0.45);
            animating = true;
          }
        }

        const waiting = !introState.done;
        if (dirty || animating || pointer.dragging) {
          dirty = false;
          instances = [];
          const dpr = renderer.dpr;
          cardResArr[0] = width;
          cardResArr[1] = height;
          cardProgram.uniforms.uDpr.value = dpr;
          cardProgram.uniforms.uRadius.value = s.radius;
          const shrink = 1 - clamp01(s.squeeze) * energy;
          const draws = [];
          for (let i = 0; i < n; i++) {
            const w = m.widths[i];
            const baseRel = wrap(m.centers[i] - pos, m.loop);
            for (let k = -2; k <= 2; k++) {
              const rel = baseRel + k * m.loop;
              if (Math.abs(rel) - w / 2 > width + 40) continue;
              const fx = effects.card ? effects.card(rel) : null;
              let x = homeX + rel + (fx ? fx.x : 0);
              let scale = shrink * (fx ? fx.scale : 1);
              let alpha = fx ? fx.alpha : 1;
              if (focusAmount > 0) {
                if (i === focus.index && Math.abs(rel) < w) {
                  scale *= 1 + (focusScale - 1) * focusEase;
                } else {
                  const order = Math.min(Math.abs(rel) / width, 1) * 0.25;
                  const part = easeInOut(focusAmount * 1.25 - order);
                  x += Math.sign(rel) * part * width * 0.7;
                  alpha *= 1 - part;
                }
              }
              const cw = w * scale;
              if (alpha <= 0.001 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue;
              draws.push({ i, rel, x, y: homeY + (fx ? fx.y : 0), cw, ch: cardH * scale, alpha });
            }
          }
          draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
          let first = true;
          for (const draw of draws) {
            const slot = slots[draw.i];
            cardProgram.uniforms.tMap.value = slot.texture;
            cardRectArr[0] = draw.x;
            cardRectArr[1] = draw.y;
            cardRectArr[2] = draw.cw + 2;
            cardRectArr[3] = draw.ch + 2;
            cardSizeArr[0] = draw.cw;
            cardSizeArr[1] = draw.ch;
            cardProgram.uniforms.uImage.value = slot.image;
            cardProgram.uniforms.uAlpha.value = draw.alpha;
            cardProgram.uniforms.uReady.value = slot.ready;
            cardProgram.uniforms.uShift.value = reducedMotion ? 0 : Math.max(-1, Math.min(1, draw.rel / (width * 0.75)));
            cardProgram.uniforms.uPlaceholder.value = slot.color;
            renderer.render({ scene: cardMesh, target, clear: first });
            first = false;
            instances.push({
              index: draw.i,
              x0: draw.x - draw.cw / 2,
              x1: draw.x + draw.cw / 2,
              y0: draw.y - draw.ch / 2,
              y1: draw.y + draw.ch / 2
            });
          }
          if (first) {
            renderer.bindFramebuffer(target);
            gl.viewport(0, 0, target.width, target.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          renderer.bindFramebuffer();
          target.texture.bind();
          gl.generateMipmap(gl.TEXTURE_2D);

          lensResArr[0] = width;
          lensResArr[1] = height;
          lensUniforms.uDpr.value = dpr;
          lensCenterArr[0] = lensX;
          lensCenterArr[1] = lens.y;
          lensHalfArr[0] = Math.max(halfW, 1);
          lensHalfArr[1] = Math.max(halfH, 1);
          lensUniforms.uAngle.value = (s.tilt * Math.PI) / 180;
          lensUniforms.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10;
          const spanW = Math.max(halfW, 1);
          const spanH = Math.max(halfH, 1);
          const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5);
          lensUniforms.uInner.value = inner;
          lensUniforms.uOuter.value = inner * 1.6;
          lensUniforms.uFlow.value = s.bend * (spanW + spanH) * 0.45;
          lensUniforms.uCurl.value = s.curl === 'rise' ? 1 : s.curl === 'fall' ? -1 : 0;
          lensUniforms.uDispersion.value = s.dispersion * 0.12 * (1 + Math.abs(deform) * liquidAmount * 1.2);
          lensUniforms.uStrength.value = effects.strength * (1 - focusEase);
          lensUniforms.uSceneAlpha.value = effects.sceneAlpha;
          renderer.render({ scene: lensMesh });
        }

        updateHoverAttr(s);

        if (visible && (animating || waiting || dirty || pointer.down || fallbackVideoPolling)) {
          raf = requestAnimationFrame(frame);
        }
      };

      const start = () => {
        if (raf || !visible || !alive || document.hidden) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };

      const localPoint = e => {
        const rect = container.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
      };

      const onPointerDown = e => {
        if (e.button !== undefined && e.button > 0) return;
        skipIntro();
        const [x, y] = localPoint(e);
        pointer.down = true;
        pointer.id = e.pointerId;
        pointer.touch = e.pointerType === 'touch';
        pointer.startX = x;
        pointer.startY = y;
        pointer.x = x;
        pointer.y = y;
        pointer.startPos = pos;
        pointer.dragging = false;
        pointer.samples = [{ x, t: performance.now() }];
        interactedAt = performance.now();
        if (Math.abs(vel) > 40) {
          goal = pos;
          vel = 0;
        }
        dirty = true;
        start();
      };

      const onPointerMove = e => {
        const [x, y] = localPoint(e);
        pointer.x = x;
        pointer.y = y;
        pointer.over = true;
        const s = settingsRef.current;
        if (pointer.down && e.pointerId === pointer.id) {
          const dx = x - pointer.startX;
          const dy = y - pointer.startY;
          const slop = pointer.touch ? 10 : 5;
          if (!pointer.dragging) {
            if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
              pointer.down = false;
              return;
            }
            if (Math.abs(dx) > slop) {
              pointer.dragging = true;
              pointer.startX = x;
              pointer.startPos = pos;
              closeFocus();
              try {
                container.setPointerCapture(e.pointerId);
              } catch {
                pointer.dragging = true;
              }
              container.setAttribute('data-dragging', '');
            }
          }
          if (pointer.dragging) {
            pos = pointer.startPos - (x - pointer.startX);
            goal = pos;
            vel = 0;
            if (s && callbacksRef.current.onRequestScrollProgress && slots.length > 1) {
              const m = metrics(s);
              const span = Math.max(1, (m.centers[slots.length - 1] ?? 0) - (m.centers[0] ?? 0));
              const nextP = clamp01((pos - (m.centers[0] ?? 0)) / span);
              scrollProgressRef.current = nextP;
              s.scrollProgress = nextP;
              callbacksRef.current.onRequestScrollProgress(nextP, false);
            }
            const now = performance.now();
            pointer.samples.push({ x, t: now });
            while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
            dirty = true;
            start();
          }
        } else if (s?.followCursor) {
          dirty = true;
          start();
        } else {
          updateHoverAttr(s);
        }
      };

      const onPointerUp = e => {
        if (!pointer.down || e.pointerId !== pointer.id) return;
        pointer.down = false;
        container.removeAttribute('data-dragging');
        const s = settingsRef.current;
        if (!s) return;
        const m = metrics(s);
        interactedAt = performance.now();
        if (pointer.dragging) {
          pointer.dragging = false;
          const now = performance.now();
          const first = pointer.samples[0];
          const lastSample = pointer.samples[pointer.samples.length - 1];
          let velocity = 0;
          if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 70) {
            velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1000;
          }
          vel = velocity;
          const landing = snapPoint(m, pos + velocity * 0.32);
          goal = landing;
          if (Math.abs(velocity) > 400 && Math.abs(landing - pos) < 1) step(m, velocity > 0 ? 1 : -1);
          if (callbacksRef.current.onRequestScrollProgress && slots.length > 1) {
            const span = Math.max(1, (m.centers[slots.length - 1] ?? 0) - (m.centers[0] ?? 0));
            const nextP = clamp01((goal - (m.centers[0] ?? 0)) / span);
            scrollProgressRef.current = nextP;
            s.scrollProgress = nextP;
            callbacksRef.current.onRequestScrollProgress(nextP, false);
            mode = 'scroll';
          } else {
            mode = 'spring';
          }
          start();
          return;
        }
        if (closeFocus()) return;
        const [x, y] = localPoint(e);
        const hit = instances.find(inst => x >= inst.x0 && x <= inst.x1 && y >= inst.y0 && y <= inst.y1);
        if (!hit) return;
        if (hit.index === activeIndex && Math.abs(goal - pos) < 2) {
          callbacksRef.current.onSelect?.(hit.index, itemsRef.current[hit.index]);
          if (s.focusOnClick) openFocus(hit.index);
        } else {
          const rel = (hit.x0 + hit.x1) / 2 - width / 2;
          goal = snapPoint(m, pos + rel);
          if (callbacksRef.current.onRequestScrollProgress && slots.length > 1) {
            const nextP = clamp01(hit.index / Math.max(1, slots.length - 1));
            scrollProgressRef.current = nextP;
            s.scrollProgress = nextP;
            callbacksRef.current.onRequestScrollProgress(nextP, true);
            mode = 'scroll';
          } else {
            mode = 'spring';
          }
          if (s.focusOnClick) focus.pending = hit.index;
          start();
        }
      };

      const onPointerLeave = () => {
        pointer.over = false;
        updateHoverAttr(settingsRef.current);
        if (settingsRef.current?.followCursor) {
          dirty = true;
          start();
        }
      };

      const onPointerCancel = () => {
        pointer.down = false;
        pointer.dragging = false;
        container.removeAttribute('data-dragging');
        const s = settingsRef.current;
        if (!s) return;
        goal = snapPoint(metrics(s), pos);
        mode = 'spring';
        start();
      };

      const onWheel = e => {
        const s = settingsRef.current;
        if (!s || !s.captureWheel || e.ctrlKey) return;
        let dx = e.deltaX;
        let dy = e.deltaY;
        if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
          dx = dy;
          dy = 0;
        }
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1;
        const horizontal = Math.abs(dx) > Math.abs(dy);
        e.preventDefault();
        skipIntro();
        interactedAt = performance.now();
        if (closeFocus()) return;
        const delta = Math.max(-120, Math.min(120, (horizontal ? dx : dy) * unit));
        goal += delta * 1.25;
        mode = 'wheel';
        wheelAt = performance.now();
        start();
      };

      const onKeyDown = e => {
        const s = settingsRef.current;
        if (!s) return;
        const m = metrics(s);
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          skipIntro();
          closeFocus();
          interactedAt = performance.now();
          step(m, 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          skipIntro();
          closeFocus();
          interactedAt = performance.now();
          step(m, -1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          closeFocus();
          goTo(m, 0);
        } else if (e.key === 'End') {
          e.preventDefault();
          closeFocus();
          goTo(m, slots.length - 1);
        } else if (e.key === 'Escape') {
          if (closeFocus()) e.preventDefault();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (closeFocus() || activeIndex < 0) return;
          callbacksRef.current.onSelect?.(activeIndex, itemsRef.current[activeIndex]);
          if (s.focusOnClick) openFocus(activeIndex);
        }
      };

      const onFocus = () => {
        hasFocus = true;
      };
      const onBlur = () => {
        hasFocus = false;
      };
      const onVisibility = () => {
        if (document.hidden) {
          pauseAllSlotVideos();
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        } else if (visible) {
          dirty = true;
          start();
        }
      };

      container.addEventListener('pointerdown', onPointerDown, { passive: true });
      container.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerup', onPointerUp, { passive: true });
      container.addEventListener('pointerleave', onPointerLeave, { passive: true });
      container.addEventListener('pointercancel', onPointerCancel, { passive: true });
      container.addEventListener('wheel', onWheel, { passive: false });
      container.addEventListener('keydown', onKeyDown);
      container.addEventListener('focus', onFocus);
      container.addEventListener('blur', onBlur);
      document.addEventListener('visibilitychange', onVisibility);

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          pauseAllSlotVideos();
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        } else {
          dirty = true;
          start();
        }
      });
      intersectionObserver.observe(container);

      engineRef.current = {
        wake: () => {
          dirty = true;
          start();
        },
        setItems,
        syncAudio,
        stepBy: delta => {
          const s = settingsRef.current;
          if (!s || !slots.length) return;
          skipIntro();
          closeFocus();
          interactedAt = performance.now();
          step(metrics(s), delta);
        }
      };

      resize();
      setItems(itemsRef.current);

      cleanupFn = () => {
        alive = false;
        visible = false;
        engineRef.current = null;
        cancelAnimationFrame(raf);
        pauseAllSlotVideos();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('pointercancel', onPointerCancel);
        container.removeEventListener('wheel', onWheel);
        container.removeEventListener('keydown', onKeyDown);
        container.removeEventListener('focus', onFocus);
        container.removeEventListener('blur', onBlur);
        document.removeEventListener('visibilitychange', onVisibility);
        slots.forEach(slot => slot.dispose());
        slots = [];
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      };
    });

    return () => {
      cancelled = true;
      cleanupFn?.();
    };
  }, [flatMobile, nearViewport]);

  const current = list[active] || list[0];
  const label = current ? current.title || current.alt || `Image ${active + 1}` : '';

  return (
    <div
      ref={containerRef}
      className={`flex-carousel ${flatMobile ? 'flex-carousel--flat-mobile' : ''} ${className}`.trim()}
      style={{ ...style, '--flex-carousel-half': `${Math.min(Math.max(cardHeight, 0.05), 1) * 50}%` }}
      role="region"
      aria-roledescription="carousel"
      aria-label="3D and Blender Gallery Carousel"
      tabIndex={0}
    >
      {flatMobile && (
        <div ref={flatTrackRef} className="flex-carousel__flat-stage" aria-hidden="true">
          {list.map((item, idx) => {
            const video = isVideoItem(item);
            return (
              <div
                key={item.src || idx}
                ref={el => {
                  flatCardElsRef.current[idx] = el;
                }}
                className="flex-carousel__flat-card"
              >
                {video ? (
                  <video
                    ref={el => {
                      flatMediaElsRef.current[idx] = el;
                    }}
                    src={nearViewport ? item.src : undefined}
                    poster={item.poster}
                    muted={muted || !item.hasAudio || idx !== active}
                    loop
                    playsInline
                    webkit-playsinline=""
                    preload={nearViewport ? 'metadata' : 'none'}
                    className="flex-carousel__flat-media"
                  />
                ) : (
                  <img
                    ref={el => {
                      flatMediaElsRef.current[idx] = el;
                    }}
                    src={item.src}
                    alt={item.alt || item.title || ''}
                    decoding="async"
                    loading="lazy"
                    draggable={false}
                    className="flex-carousel__flat-media"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {captions && current && revealed && (
        <div className="flex-carousel__caption" aria-hidden="true">
          <span key={active} className="flex-carousel__title">
            {current.title || current.alt}
            {current.subtitle && <span className="flex-carousel__subtitle">{current.subtitle}</span>}
          </span>
          <span className="flex-carousel__count" data-hidden={focusOpen ? '' : undefined}>
            <Digits value={active + 1} />
            <span className="flex-carousel__slash">/</span>
            <span>{String(list.length).padStart(2, '0')}</span>
          </span>
        </div>
      )}
      <div className="flex-carousel__live" aria-live="polite" aria-atomic="true">
        {`${label}, ${active + 1} of ${list.length}`}
      </div>
    </div>
  );
});

export default React.memo(FlexCarousel);
