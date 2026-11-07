import React from 'react';
import { WORK_SPECS } from '../data/portfolioData';

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
            <span className="spec-index">{col.index}</span>
            <h3 className="spec-heading">
              {isGerman ? col.heading.de : col.heading.en}
            </h3>
            <p className="spec-text">
              {isGerman ? col.text.de : col.text.en}
            </p>
            <ul className="spec-list">
              {col.items.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

