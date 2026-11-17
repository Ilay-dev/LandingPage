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
  {
    id: '07',
    title: 'DialDisp',
    type: 'Repository',
    url: 'https://github.com/Ilay-dev/DialDisp',
    categories: ['system', '3d'],
    desc: {
      en: 'A 3D-printed wireless BLE HID rotary desk controller powered by an ESP32-C3, featuring a 2.01" IPS TFT display, a 24-LED NeoPixel halo ring, and 7 interactive control & ambient modes.',
      de: 'Ein 3D-gedruckter kabelloser BLE-HID-Drehcontroller auf ESP32-C3-Basis mit 2,01" IPS-TFT-Display, 24-LED-NeoPixel-Ring und 7 interaktiven Steuerungs- und Ambient-Modi.',
    },
    tags: ['ESP32-C3', 'C / C++', '3D Printing'],
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'turnaround',
    type: 'video',
    category: 'video',
    src: 'src/Turnaround_neu.mp4',
    alt: 'Smart Rotary Controller Turnaround',
    title: {
      en: 'Smart Rotary Controller',
      de: 'Smart Rotary Controller',
    },
    subtitle: {
      en: 'Product Turnaround · Video',
      de: 'Produkt-Turnaround · Video',
    },
    aspect: 16 / 9,
  },
  {
    id: 'holo',
    type: 'video',
    category: 'video',
    src: 'src/Holo_vid_sound.mp4',
    hasAudio: true,
    alt: 'Voronoi Desk Animation',
    title: {
      en: 'Voronoi Hologram Desk',
      de: 'Voronoi Hologramm-Setup',
    },
    subtitle: {
      en: 'Motion Tracking & Sound · Video',
      de: 'Kameratracking & Sound · Video',
    },
    aspect: 9 / 16,
  },
  {
    id: 'f75',
    type: 'image',
    category: 'render',
    src: 'src/f75_grass.jpg',
    alt: 'F75 Keyboard 3D Render',
    title: {
      en: 'Aula F75 Mechanical Keyboard',
      de: 'Aula F75 Mechanische Tastatur',
    },
    subtitle: {
      en: 'Cycles Environment Render',
      de: 'Cycles Umgebungs-Render',
    },
    aspect: 9 / 16,
  },
  {
    id: 'backrooms',
    type: 'video',
    category: 'video',
    src: 'src/Backrooms_v2_vid.mp4',
    alt: 'Backrooms Poolrooms Animation',
    title: {
      en: 'Poolrooms Architecture',
      de: 'Poolrooms Architektur',
    },
    subtitle: {
      en: 'Atmospheric Animation · Video',
      de: 'Atmosphärische Animation · Video',
    },
    aspect: 9 / 16,
  },
  {
    id: 'forest',
    type: 'image',
    category: 'render',
    src: 'src/p1_forest_4.png',
    alt: 'Forest 3D Render',
    title: {
      en: 'Misty Forest Clearing',
      de: 'Neblige Waldlichtung',
    },
    subtitle: {
      en: 'Volumetric Nature Render',
      de: 'Volumetrischer Natur-Render',
    },
    aspect: 9 / 16,
  },
  {
    id: 'realism',
    type: 'video',
    category: 'video',
    src: 'src/realism_v20001-0228_mit_ton.mp4',
    hasAudio: true,
    alt: 'Photorealistic Glassware Tabletop Animation',
    title: {
      en: 'Tabletop Glassware Study',
      de: 'Fotorealistische Glas-Studie',
    },
    subtitle: {
      en: 'Cycles Realism & Sound · Video',
      de: 'Cycles Realismus & Sound · Video',
    },
    aspect: 9 / 16,
  },
  {
    id: 'manhattan',
    type: 'image',
    category: 'render',
    src: 'src/Manhatten_v2.png',
    alt: 'Inverted Manhattan Skyline 3D Render',
    title: {
      en: 'Inverted Manhattan Skyline',
      de: 'Invertierte Manhattan-Skyline',
    },
    subtitle: {
      en: 'Surreal Architecture Render',
      de: 'Surrealer Architektur-Render',
    },
    aspect: 16 / 9,
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

