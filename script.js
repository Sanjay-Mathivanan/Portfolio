/* ==========================================================
   SANJAY MATHIVANAN — Premium Portfolio
   JavaScript — Animations, Interactions & API
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────
  // Loading Screen
  // ──────────────────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 800);
  });
  // Fallback in case load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }

  // ──────────────────────────────────────
  // Dark Mode Toggle
  // ──────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
    }
  }

  // ──────────────────────────────────────
  // Sticky Navigation
  // ──────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // ──────────────────────────────────────
  // Mobile Menu
  // ──────────────────────────────────────
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  // ──────────────────────────────────────
  // Scroll Progress Bar
  // ──────────────────────────────────────
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  }, { passive: true });

  // ──────────────────────────────────────
  // Active Nav Link Highlighting
  // ──────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ──────────────────────────────────────
  // Typing Animation
  // ──────────────────────────────────────
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'AI & Machine Learning.',
    'Robotics & ROS2.',
    'Backend Development.',
    'IoT & Automation.',
    'Intelligent Systems.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typingEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // ──────────────────────────────────────
  // Scroll Reveal (Intersection Observer)
  // ──────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ──────────────────────────────────────
  // GitHub API Integration
  // ──────────────────────────────────────
  const GITHUB_USERNAME = 'Sanjay-Mathivanan';

  async function fetchGitHubData() {
    try {
      // Fetch user data
      const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
      const userData = await userRes.json();

      // Update stats
      const reposCount = document.getElementById('gh-repos');
      const followersCount = document.getElementById('gh-followers');
      const followingCount = document.getElementById('gh-following');

      if (reposCount) reposCount.textContent = userData.public_repos || '—';
      if (followersCount) followersCount.textContent = userData.followers || '—';
      if (followingCount) followingCount.textContent = userData.following || '—';

      // Fetch repos
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
      const repos = await reposRes.json();

      // Calculate total stars
      const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      const starsEl = document.getElementById('gh-stars');
      if (starsEl) starsEl.textContent = totalStars;

      // Render repos
      const reposContainer = document.getElementById('github-repos');
      if (reposContainer && Array.isArray(repos)) {
        reposContainer.innerHTML = repos.slice(0, 6).map(repo => `
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="github-repo-card">
            <div class="repo-name">
              <i class="ri-git-repository-line"></i>
              ${repo.name}
            </div>
            <p class="repo-desc">${repo.description || 'No description available.'}</p>
            <div class="repo-meta">
              ${repo.language ? `<span><span class="lang-dot" style="background:${getLanguageColor(repo.language)}"></span>${repo.language}</span>` : ''}
              <span><i class="ri-star-line"></i> ${repo.stargazers_count}</span>
              <span><i class="ri-git-branch-line"></i> ${repo.forks_count}</span>
            </div>
          </a>
        `).join('');
      }
    } catch (error) {
      console.log('GitHub API rate limited or unavailable:', error);
    }
  }

  function getLanguageColor(lang) {
    const colors = {
      'Python': '#3572A5',
      'Java': '#b07219',
      'JavaScript': '#f1e05a',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'C': '#555555',
      'C++': '#f34b7d',
      'TypeScript': '#2b7489',
      'Shell': '#89e051',
      'Jupyter Notebook': '#DA5B0B'
    };
    return colors[lang] || '#8b8b8b';
  }

  fetchGitHubData();

  // ──────────────────────────────────────
  // Contact Form
  // ──────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Mailto fallback
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:sanjaisp7@gmail.com?subject=${subject}&body=${body}`;

      // Visual feedback
      const btn = contactForm.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'Opening Email Client...';
      btn.style.background = '#10B981';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ──────────────────────────────────────
  // Smooth scroll for anchor links
  // ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ──────────────────────────────────────
  // Counter Animation
  // ──────────────────────────────────────
  function animateCounter(element, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      element.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    };
    requestAnimationFrame(step);
  }

  // Observe stat cards for counter animation
  const statValues = document.querySelectorAll('.stat-value[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count'));
        if (target) animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterObserver.observe(el));

  // ──────────────────────────────────────
  // Timeline Animation
  // ──────────────────────────────────────
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

  timelineItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    timelineObserver.observe(item);
  });

});
