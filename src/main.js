import './style.css';
import { projects, skills, services } from './data.js';
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
  renderServices();
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
        <a href="${project.link}" class="project-link">Visit Website <span class="arrow">→</span></a>
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

// Services Journey Rendering
function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  services.forEach((service, index) => {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.dataset.index = index;

    const displayIndex = String(index + 1).padStart(2, '0');

    item.innerHTML = `
      <div class="service-main">
        <span class="service-number">${displayIndex}</span>
        <h3 class="service-title">${service.title}</h3>
      </div>
      <div class="service-detail">
        <div class="service-detail-inner">
          <p class="service-description">${service.description}</p>
          <div class="service-tags">
            <span class="service-tag">BESPOKE</span>
            <span class="service-tag">DIGITAL</span>
            <span class="service-tag">2026</span>
          </div>
        </div>
      </div>
      <div class="service-line"></div>
    `;

    grid.appendChild(item);
  });
}

// Education Journey Rendering
function renderEducation() {
  const list = document.getElementById('education-list');
  if (!list) return;

  education.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cv-item';

    row.innerHTML = `
      <div class="cv-year">${item.date}</div>
      <div class="cv-info">
        <h3>${item.degree}</h3>
        <span style="color: #ffffff; font-weight: 700; letter-spacing: 0.1em; font-size: 0.8rem; border-bottom: 1px solid #333; padding-bottom: 4px;">${item.school}</span>
        <p style="margin-top: 1.5rem; color: #888;">${item.description}</p>
      </div>
    `;

    list.appendChild(row);
  });
}
