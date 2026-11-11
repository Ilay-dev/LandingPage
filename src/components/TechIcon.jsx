import React from 'react';

export function GitHubLogo({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function BlenderLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="13.5" cy="14" r="6.5" />
      <circle cx="13.5" cy="14" r="2.6" fill="currentColor" stroke="none" />
      <path d="M13.5 7.5L5.5 3.5" />
      <path d="M9.2 9.2L2.5 9.2" />
      <path d="M7.5 12.2L3.5 15.8" />
    </svg>
  );
}

export function PythonLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3c-3.8 0-3.5 1.6-3.5 3.2V8h7v1H6.8C4.4 9 3 10.6 3 13.5S4.4 18 6.8 18H8v-2.2c0-1.7 1.3-3 3-3h4c1.4 0 2.5-1.1 2.5-2.5V6.2C17.5 4.4 15.8 3 12 3z" />
      <path d="M12 21c3.8 0 3.5-1.6 3.5-3.2V16h-7v-1h8.7c2.4 0 3.8-1.6 3.8-4.5S19.6 6 17.2 6H16v2.2c0 1.7-1.3 3-3 3H9c-1.4 0-2.5 1.1-2.5 2.5v4.1C6.5 19.6 8.2 21 12 21z" />
      <circle cx="10" cy="5.8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="18.2" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function JavaScriptLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M11.2 11.2v5.3c0 1.2-.8 1.9-2 1.9-.9 0-1.6-.4-1.9-1.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M18.2 12.1c-.4-.6-1-.9-1.8-.9-1 0-1.7.5-1.7 1.3 0 .8.6 1.1 1.8 1.5 1.3.4 2 .9 2 2.1 0 1.4-1.1 2.2-2.6 2.2-1.2 0-2.1-.5-2.5-1.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ReactLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function CppLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 20.5 7 20.5 17 12 22 3.5 17 3.5 7 12 2" />
      <path d="M10.5 9.2A3.2 3.2 0 1 0 10.5 14.8" />
      <path d="M13.5 10.5v3M12 12h3M17.5 10.5v3M16 12h3" />
    </svg>
  );
}

export function ThreeJsLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="4 3.5 20.5 8 8.5 20.5 4 3.5" />
      <polygon points="12.2 5.7 14.5 14.2 6.2 12 12.2 5.7" />
    </svg>
  );
}

export function WebGLLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2.5 20.5 7.2 20.5 16.8 12 21.5 3.5 16.8 3.5 7.2 12 2.5" />
      <polyline points="3.5 7.2 12 12 20.5 7.2" />
      <line x1="12" y1="21.5" x2="12" y2="12" />
    </svg>
  );
}

export function ChipLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
      <path d="M9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
    </svg>
  );
}

export function GitLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="12" r="2.2" />
      <path d="M7 8.2v7.6M9.2 6.8l5.6 3.8" />
    </svg>
  );
}

export function AudioLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4" />
    </svg>
  );
}

export function TerminalLogo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <polyline points="7.5 9.5 10.5 12 7.5 14.5" />
      <line x1="12.5" y1="14.5" x2="16.5" y2="14.5" />
    </svg>
  );
}

export function Html5Logo({ size = 15, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 3h16l-1.5 14.5L12 21l-6.5-3.5L4 3z" />
      <path d="M8 8h8l-.5 4.5H9.5l.3 2.8 2.2.7 2.2-.7.2-1.8" />
    </svg>
  );
}

export function MailLogo({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <polyline points="3.5 6.5 12 13 20.5 6.5" />
    </svg>
  );
}

export default function TechIcon({ name = '', size = 14, className = '' }) {
  const key = String(name).toLowerCase();

  if (key.includes('github')) return <GitHubLogo size={size} className={className} />;
  if (key.includes('blender') || key.includes('cycles') || key.includes('eevee') || key.includes('compositing'))
    return <BlenderLogo size={size} className={className} />;
  if (key.includes('react')) return <ReactLogo size={size} className={className} />;
  if (key.includes('javascript') || key === 'js') return <JavaScriptLogo size={size} className={className} />;
  if (key.includes('python')) return <PythonLogo size={size} className={className} />;
  if (key.includes('c++') || key.includes('c / c++')) return <CppLogo size={size} className={className} />;
  if (key.includes('three.js') || key.includes('three')) return <ThreeJsLogo size={size} className={className} />;
  if (key.includes('html') || key.includes('css')) return <Html5Logo size={size} className={className} />;
  if (key.includes('esp32') || key.includes('embedded') || key.includes('printing') || key.includes('hardware'))
    return <ChipLogo size={size} className={className} />;
  if (key.includes('audio') || key.includes('real-time')) return <AudioLogo size={size} className={className} />;
  if (key.includes('git')) return <GitLogo size={size} className={className} />;
  if (key.includes('linux') || key.includes('windows') || key.includes('desktop') || key.includes('automation'))
    return <TerminalLogo size={size} className={className} />;
  if (
    key.includes('webgl') ||
    key.includes('shader') ||
    key.includes('splat') ||
    key.includes('3d') ||
    key.includes('glb') ||
    key.includes('gltf') ||
    key.includes('geometry') ||
    key.includes('tracking') ||
    key.includes('canvas')
  )
    return <WebGLLogo size={size} className={className} />;

  return <WebGLLogo size={size} className={className} />;
}
