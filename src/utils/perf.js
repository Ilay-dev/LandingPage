let cachedLowEnd = null;

export function isLowEndDevice() {
  if (cachedLowEnd !== null) return cachedLowEnd;
  if (typeof navigator === 'undefined') {
    cachedLowEnd = false;
    return false;
  }
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  cachedLowEnd = saveData || cores <= 4 || memory <= 4;
  return cachedLowEnd;
}

export function getOptimalDpr(maxHigh = 1.75, maxLow = 1.25) {
  if (typeof window === 'undefined') return 1;
  const raw = window.devicePixelRatio || 1;
  return Math.min(raw, isLowEndDevice() ? maxLow : maxHigh);
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
