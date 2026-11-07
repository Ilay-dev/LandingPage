import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';

export default function ProjectsSection({ isGerman, visible }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: isGerman ? 'Alle' : 'All' },
    { key: '3d', label: '3D & WebGL' },
    { key: 'web', label: 'Web' },
    { key: 'system', label: 'Python & ESP32' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(activeFilter));

  return (
    <section
      className={`fade-up ${visible ? 'visible' : ''}`}
      id="projects"
    >
      <div className="section-top">
        <div>
          <h2 className="section-title">
            {isGerman ? 'Projekte' : 'Projects'}
          </h2>
          <p className="section-desc">
            {isGerman
              ? 'Open-Source-Webanwendungen, 3D-Viewer, Desktop-Programme und Mikrocontroller-Projekte.'
              : 'Open-source web tools, 3D viewers, desktop software, and microcontroller repositories.'}
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

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <a
            key={project.id}
            href={project.url}
            className="project-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <div className="project-meta">
                <span>{project.id}</span>
                <span>{project.type}</span>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">
                {isGerman ? project.desc.de : project.desc.en}
              </p>
            </div>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

