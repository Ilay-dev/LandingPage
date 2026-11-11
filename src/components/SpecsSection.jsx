import React from 'react';
import { WORK_SPECS } from '../data/portfolioData';
import TechIcon, { BlenderLogo, ChipLogo, WebGLLogo } from './TechIcon';

function SpecColumnIcon({ index }) {
  if (index === '01') return <BlenderLogo size={16} />;
  if (index === '02') return <WebGLLogo size={16} />;
  return <ChipLogo size={16} />;
}

export default function SpecsSection({ isGerman, visible }) {
  return (
    <section
      className={`fade-up ${visible ? 'visible' : ''}`}
      id="stack"
    >
      <div className="section-top">
        <div>
          <h2 className="section-title">
            {isGerman ? 'Arbeitsbereiche' : 'Areas of Work'}
          </h2>
        </div>
      </div>

      <div className="specs-table">
        {WORK_SPECS.map((col) => (
          <div key={col.index} className="spec-col">
            <div className="spec-col-top">
              <span className="spec-index">{col.index}</span>
              <span className="spec-col-icon" aria-hidden="true">
                <SpecColumnIcon index={col.index} />
              </span>
            </div>
            <h3 className="spec-heading">
              {isGerman ? col.heading.de : col.heading.en}
            </h3>
            <p className="spec-text">
              {isGerman ? col.text.de : col.text.en}
            </p>
            <ul className="spec-list">
              {col.items.map((tech) => (
                <li key={tech} className="spec-list-item">
                  <TechIcon name={tech} size={14} className="spec-tech-logo" />
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
