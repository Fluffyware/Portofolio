import './style.css';
import { projects, skills, education } from './data.js';
import {
  initAnimations,
  initSmoothScroll
} from './animations.js';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  renderContent();
  initAnimations();
  initSmoothScroll(lenis);

  // Ensure ScrollTrigger is ready
  ScrollTrigger.refresh();
});

function renderContent() {
  renderPortfolio();
  renderSkills();
  renderEducation();
}

// Digital Studio Portfolio Rendering
function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;
  grid.innerHTML = ''; // Clear static placeholder if needed

  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    card.innerHTML = `
      <div class="project-image-wrap">
        <img src="${project.image}" alt="${project.title}" />
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">Visit Website <span class="arrow">→</span></a>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Skills rendering in typographic grid
function renderSkills() {
  const skillsContainer = document.querySelector('.skills .container');
  if (!skillsContainer) return;

  // Find or create grid
  let grid = skillsContainer.querySelector('.skills-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'skills-grid';
    skillsContainer.appendChild(grid);
  }
  grid.innerHTML = '';

  skills.forEach(category => {
    const catDiv = document.createElement('div');
    catDiv.className = 'skills-category';

    catDiv.innerHTML = `
      <h3 class="skills-category-title">${category.category.replace(' ', '<br/>')}</h3>
      <div class="skills-list">
        ${category.items.map(s => `<span class="skill-item">${s}</span>`).join('')}
      </div>
    `;
    grid.appendChild(catDiv);
  });
}

// Education Journey Rendering - Simple Horizontal Layout
function renderEducation() {
  const grid = document.getElementById('educationGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Create timeline container
  const timeline = document.createElement('div');
  timeline.className = 'education-timeline';

  // For horizontal timeline, keep natural order (SMA on left, Kuliah on right)
  education.forEach((edu, index) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.dataset.index = index;

    item.innerHTML = `
      <div class="timeline-dot">
        <div class="timeline-dot-inner"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-period">${edu.period}</div>
        <h3 class="timeline-degree">${edu.degree}</h3>
        <p class="timeline-institution">${edu.institution}</p>
        <p class="timeline-location">${edu.location}</p>
        ${edu.gpa ? `<p class="timeline-gpa">${edu.gpa}</p>` : ''}
      </div>
    `;

    timeline.appendChild(item);
  });

  grid.appendChild(timeline);
}

