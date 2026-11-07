import React, { useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import Carousel from './Carousel';

export default function ProjectsSection({ isGerman, visible }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('carousel');

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

  const carouselSlides = filteredProjects.map((project) => (
    <div key={project.id} className="project-carousel-slide">
      <div>
        <div className="project-meta">
          <span>{project.id}</span>
          <span>{project.type}</span>
        </div>
        <h3 className="project-slide-title">{project.title}</h3>
        <p className="project-desc">
          {isGerman ? project.desc.de : project.desc.en}
        </p>
      </div>

      <div className="project-slide-footer">
        <div className="project-tags" style={{ borderTop: 'none', paddingTop: 0 }}>
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-solid"
          style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          {isGerman ? 'Projekt öffnen ↗' : 'Open Project ↗'}
        </a>
      </div>
    </div>
  ));

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

        <div className="projects-controls-row">
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

          <div className="filter-group">
            <button
              type="button"
              className={`filter-btn ${viewMode === 'carousel' ? 'active' : ''}`}
              onClick={() => setViewMode('carousel')}
            >
              Carousel
            </button>
            <button
              type="button"
              className={`filter-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'carousel' ? (
        <div className="projects-carousel-wrapper">
          <Carousel
            key={activeFilter}
            items={carouselSlides}
            baseWidth={680}
            aspectRatio={1.9}
            gap={20}
            radius={6}
            frame={true}
            effect="tilt"
            indicator="bars"
            arrows={true}
            autoplay={true}
            autoplayDelay={4000}
            pauseOnHover={true}
            loop={filteredProjects.length > 1}
            draggable={true}
            theme="dark"
          />
        </div>
      ) : (
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
      )}
    </section>
  );
}
