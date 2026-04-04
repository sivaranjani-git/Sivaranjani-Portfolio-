/* ============================================================
   SIVARANJANI T · PORTFOLIO SCRIPT
   Handles: nav scroll, mobile menu, reveal animations,
            role typewriter, active nav links, form submit
   ============================================================ */

'use strict';

/* ===== NAVBAR: scroll shadow + active links ===== */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Shadow on scroll
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });

/* ===== MOBILE HAMBURGER ===== */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const btn   = document.getElementById('hamburger');
  links.classList.toggle('open');
  const isOpen = links.classList.contains('open');
  btn.setAttribute('aria-expanded', isOpen);
}

// Close nav when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ===== INTERSECTION OBSERVER: reveal animations ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
  revealObserver.observe(el);
});

/* ===== ROLE TYPEWRITER ===== */
const roles = [
  'Java Full Stack Developer',
  'Junior Software Engineer',
  'Data Analyst',
  'MERN Stack Developer',
  'Backend Developer (Spring Boot)',
];

const roleEl = document.getElementById('role-display');
if (roleEl) {
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = null;

  function typeRole() {
    const currentRole = roles[roleIdx];

    if (!deleting) {
      charIdx++;
      roleEl.textContent = currentRole.slice(0, charIdx);
      if (charIdx === currentRole.length) {
        deleting = true;
        clearTimeout(pauseTimer);
        pauseTimer = setTimeout(typeRole, 2200);
        return;
      }
      setTimeout(typeRole, 70);
    } else {
      charIdx--;
      roleEl.textContent = currentRole.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeRole, 350);
        return;
      }
      setTimeout(typeRole, 38);
    }
  }

  // Start after a brief delay
  setTimeout(typeRole, 1200);
}

/* ===== SMOOTH SCROLL: offset for fixed navbar ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  // Show loading state
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Simulate async send (replace with real endpoint as needed)
  setTimeout(() => {
    btn.style.display = 'none';
    if (success) {
      success.classList.add('show');
    }
    e.target.reset();

    // Reset after 5s
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.style.display = '';
      if (success) success.classList.remove('show');
    }, 5000);
  }, 1200);
}

/* ===== SKILL TAG HOVER: subtle stagger on load ===== */
document.querySelectorAll('.skill-tag').forEach((tag, i) => {
  tag.style.transitionDelay = `${(i % 8) * 0.03}s`;
});

/* ===== PROJECT CARD: tilt on mouse move (desktop only) ===== */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 5;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 5;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===== COUNTER ANIMATION: hero stats ===== */
function animateCounter(el, target, duration = 1200, suffix = '') {
  const start = 0;
  const step = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = (Number.isInteger(target)
      ? Math.floor(current)
      : current.toFixed(0)) + suffix;
  }, 16);
}

// Trigger counters when hero is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const nums = entry.target.querySelectorAll('.stat-num');
    nums.forEach(numEl => {
      const text = numEl.textContent.trim();
      const match = text.match(/^([0-9.]+)([^0-9.]*)$/);
      if (!match) return;
      const value  = parseFloat(match[1]);
      const suffix = match[2];
      animateCounter(numEl, value, 1500, suffix);
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ===== BACK-TO-TOP: auto-inject ===== */
const backToTop = document.createElement('button');
backToTop.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.style.cssText = `
  position:fixed; bottom:2rem; right:2rem; z-index:999;
  width:44px; height:44px; border-radius:50%;
  background:var(--primary); color:#fff; border:none;
  cursor:pointer; display:flex; align-items:center;
  justify-content:center; opacity:0; transform:translateY(10px);
  transition:all 0.3s; box-shadow:0 4px 16px rgba(30,58,138,0.35);
`;
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
    backToTop.style.transform = 'translateY(0)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'translateY(10px)';
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseenter', () => {
  backToTop.style.background = 'var(--accent)';
  backToTop.style.transform = 'translateY(-3px)';
});
backToTop.addEventListener('mouseleave', () => {
  backToTop.style.background = 'var(--primary)';
  if (window.scrollY > 400) backToTop.style.transform = 'translateY(0)';
});

console.log('%c Sivaranjani T · Portfolio v1.0 ', 'background:#1E3A8A;color:#fff;font-size:13px;padding:4px 8px;border-radius:4px;');
console.log('%c Java Full Stack Developer | Data Analyst ', 'color:#3B82F6;font-size:11px;');
