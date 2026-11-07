export const PROJECTS = [
  {
    id: '01',
    title: 'SimpleSplat',
    type: 'Web App',
    url: 'https://ilay-dev.github.io/SimpleSplat',
    categories: ['3d', 'web'],
    desc: {
      en: 'A minimalistic 3D Gaussian Splat viewer for loading and inspecting point-cloud radiance fields directly in the browser.',
      de: 'Ein minimalistischer 3D-Gaussian-Splat-Viewer zum Laden und Inspizieren von Szenen direkt im Browser.',
    },
    tags: ['Gaussian Splatting', 'WebGL', 'JavaScript'],
  },
  {
    id: '02',
    title: 'PlanetGen',
    type: 'Repository',
    url: 'https://github.com/Ilay-dev/PlanetGen',
    categories: ['3d', 'web'],
    desc: {
      en: 'A browser-based 3D planet generator. Procedurally create detailed planets with dynamic weather and biomes, and export them as .glb files.',
      de: 'Ein browserbasierter 3D-Planetengenerator. Erstelle prozedural detaillierte Planeten mit dynamischem Wetter und Biomen inklusive .glb-Export.',
    },
    tags: ['Procedural 3D', 'GLB Export', 'Shaders'],
  },
  {
    id: '03',
    title: 'AudioVizuallizer',
    type: 'Web App',
    url: 'https://ilay-dev.github.io/AudioVizuallizer',
    categories: ['web'],
    desc: {
      en: 'An interactive tool that analyzes audio frequencies in real time and translates sound signals into graphical animations.',
      de: 'Ein interaktives Tool, das Audiosignale und Frequenzen in Echtzeit in grafische Animationen übersetzt.',
    },
    tags: ['Web Audio API', 'Canvas', 'Real-Time'],
  },
  {
    id: '04',
    title: '3dView',
    type: 'Web App',
    url: 'https://ilay-dev.github.io/3dView',
    categories: ['3d', 'web'],
    desc: {
      en: 'A web-based 3D viewer for loading, lighting, rendering, and inspecting 3D models directly in the browser.',
      de: 'Ein webbasierter 3D-Viewer zum Laden, Rendern und Interagieren mit 3D-Modellen direkt im Browser.',
    },
    tags: ['Three.js', '3D Viewer', 'WebGL'],
  },
  {
    id: '05',
    title: 'AutoWrite',
    type: 'Repository',
    url: 'https://github.com/Ilay-dev/AutoWrite',
    categories: ['system'],
    desc: {
      en: 'A Python GUI tool that automatically types text for you, featuring a "Humanity" slider to simulate natural human typing behavior.',
      de: 'Ein Python-GUI-Tool, das automatisch Text tippt, mit einem "Menschlichkeits"-Regler zur Simulation natürlichen Tippverhaltens.',
    },
    tags: ['Python', 'Desktop GUI', 'Automation'],
  },
  {
    id: '06',
    title: 'ESP32-Cam',
    type: 'Repository',
    url: 'https://github.com/Ilay-dev/ESP32-Cam',
    categories: ['system'],
    desc: {
      en: 'A standalone web-camera and photo-capture server for the ESP32-CAM module, featuring concurrent video streaming and SD card capturing.',
      de: 'Ein eigenständiger Webkamera- und Foto-Aufnahmeserver für das ESP32-CAM-Modul mit gleichzeitigem Video-Streaming und SD-Karten-Aufnahme.',
    },
    tags: ['ESP32', 'C / C++', 'Embedded'],
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'turnaround',
    type: 'video',
    category: 'video',
    spanClass: 'media-horizontal',
    src: 'src/Turnaround_neu.mp4',
    alt: 'Smart Rotary Controller Turnaround',
  },
  {
    id: 'splat',
    type: 'video',
    category: 'video',
    spanClass: 'media-vertical',
    src: 'src/Splat_v2_neu.mp4',
    alt: 'Urban Gaussian Splatting Animation',
  },
  {
    id: 'holo',
    type: 'video',
    category: 'video',
    spanClass: 'media-vertical',
    src: 'src/Holo_vid_sound.mp4',
    hasAudio: true,
    alt: 'Voronoi Desk Animation',
  },
  {
    id: 'f75',
    type: 'image',
    category: 'render',
    spanClass: 'media-vertical',
    src: 'src/f75_grass.jpg',
    depthSrc: 'src/f75_grass_deph.png',
    alt: 'F75 Keyboard 3D Render',
  },
  {
    id: 'backrooms',
    type: 'video',
    category: 'video',
    spanClass: 'media-vertical',
    src: 'src/Backrooms_v2_vid.mp4',
    alt: 'Backrooms Poolrooms Animation',
  },
  {
    id: 'diego',
    type: 'image',
    category: 'render',
    spanClass: 'media-horizontal',
    src: 'src/Diego.png',
    depthSrc: 'src/Diego_deph.png',
    alt: 'Diego 3D Render',
  },
  {
    id: 'spaceship',
    type: 'image',
    category: 'render',
    spanClass: 'media-ultrawide',
    src: 'src/irl_Spaceship.png',
    depthSrc: 'src/irl_Spaceship_deph.png',
    alt: 'Spaceship 3D Render',
  },
  {
    id: 'forest',
    type: 'image',
    category: 'render',
    spanClass: 'media-vertical',
    src: 'src/p1_forest_4.png',
    depthSrc: 'src/p1_forest_4_deph.png',
    alt: 'Forest 3D Render',
  },
];

export const WORK_SPECS = [
  {
    index: '01',
    heading: {
      en: '3D Modeling & VFX',
      de: '3D-Modellierung & VFX',
    },
    text: {
      en: 'Hard-surface product visualization, atmospheric environments, camera tracking, and Gaussian Splatting.',
      de: 'Hard-Surface-Produktvisualisierung, atmosphärische Umgebungen, Kameratracking und Gaussian Splatting.',
    },
    items: [
      'Blender',
      'Cycles / Eevee',
      '3D Tracking',
      'Gaussian Splats',
      'Geometry Nodes',
      'Compositing',
    ],
  },
  {
    index: '02',
    heading: {
      en: 'Web & Real-Time 3D',
      de: 'Web & Echtzeit-3D',
    },
    text: {
      en: 'Interactive browser applications, custom WebGL shaders, 3D model viewers, and audio-reactive visualizations.',
      de: 'Interaktive Browser-Anwendungen, eigene WebGL-Shader, 3D-Model-Viewer und audio-reaktive Visualisierungen.',
    },
    items: [
      'JavaScript / React',
      'WebGL / GLSL',
      'Three.js',
      'HTML5 / CSS3',
      'Web Audio API',
      'GLTF / GLB',
    ],
  },
  {
    index: '03',
    heading: {
      en: 'Software & Hardware',
      de: 'Software & Hardware',
    },
    text: {
      en: 'Desktop automation tools in Python, embedded microcontroller firmware for ESP32, and 3D-printed hardware.',
      de: 'Desktop-Tools in Python, Mikrocontroller-Firmware für ESP32 und 3D-gedruckte Hardware-Projekte.',
    },
    items: [
      'Python',
      'C / C++',
      'ESP32',
      '3D Printing',
      'Git',
      'Linux / Windows',
    ],
  },
];

