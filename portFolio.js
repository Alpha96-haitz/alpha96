const texts = [
  'Bienvenue sur mon portfolio',
  'Je suis Mamadou Alpha Barry',
  'Développeur Web',
  'Administrateur Réseau',
  'Gestionnaire de Bases de Données',
  'Entrepreneur Digital'
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const typewriter = document.getElementById('typewriter');
const progressBars = document.querySelectorAll('.progress-bar i');
const counters = document.querySelectorAll('.counter');
const revealElements = document.querySelectorAll('.reveal');
const form = document.querySelector('.contact-form');
const status = document.getElementById('form-status');
const testimonialTrack = document.getElementById('testimonial-track');
const testimonialDots = document.getElementById('testimonial-dots');
const chatLauncher = document.getElementById('chat-launcher');
const chatClose = document.getElementById('chat-close');
const chatbot = document.getElementById('chatbot');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');

const testimonialItems = [
  {
    quote: 'Mamadou livre des solutions propres, rapides et fiables. La collaboration a été simple et très professionnelle.',
    author: 'Client partenaire'
  },
  {
    quote: 'Ses formations sont claires, concrètes et adaptées au niveau de chacun. Les apprenants progressent vite.',
    author: 'Apprenant'
  },
  {
    quote: 'Excellent sens du détail sur les projets techniques, avec une vraie rigueur dans l’organisation.',
    author: 'Responsable projet'
  }
];

const chatbotReplies = {
  saluer: 'Bonjour et bienvenue. Je peux vous guider sur les projets, services, compétences, le CV ou les moyens de contact.',
  projets: 'Je peux vous présenter les applications, sites web et le projet réseau du complexe scolaire Halima de Mamou.',
  services: 'Les services couvrent le développement web, les applications, les bases de données, la formation et le marketing digital.',
  contact: 'Vous pouvez écrire via le formulaire ou utiliser directement l’email, le téléphone et LinkedIn affichés sur la page.',
  cv: 'Le CV est disponible en téléchargement direct depuis le bouton du menu ou le bouton du hero.',
  skills: 'Mes compétences principales couvrent HTML, CSS, JavaScript, PHP, Java, Python, WinDev, MySQL et l’administration réseau.'
};

const chatbotState = {
  greeted: false
};

revealElements.forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
});

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const offset = 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});

function startTypewriter() {
  if (!typewriter) return;
  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = texts[textIndex];
    charIndex += deleting ? -1 : 1;
    typewriter.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex === current.length) {
      deleting = true;
      window.setTimeout(tick, 1800);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    window.setTimeout(tick, deleting ? 45 : 70);
  };

  tick();
}

function animateProgressBars() {
  progressBars.forEach((bar) => {
    const level = Number(bar.dataset.level || 0);
    bar.style.width = `${level}%`;
  });
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  const duration = 1500;
  const start = performance.now();

  const step = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    counter.textContent = Math.round(progress * target).toString();
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('counter')) {
      animateCounter(entry.target);
    }
    if (entry.target.id === 'skills') {
      animateProgressBars();
    }
    intersectionObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });

revealElements.forEach((element) => intersectionObserver.observe(element));
counters.forEach((counter) => intersectionObserver.observe(counter));
const skillsSection = document.getElementById('skills');
if (skillsSection) intersectionObserver.observe(skillsSection);

function renderTestimonials() {
  if (!testimonialTrack || !testimonialDots) return;
  testimonialTrack.innerHTML = testimonialItems.map((item) => `
    <article class="testimonial-slide">
      <p>“${item.quote}”</p>
      <strong>${item.author}</strong>
    </article>
  `).join('');

  testimonialDots.innerHTML = testimonialItems.map((_, index) => `<button type="button" aria-label="Afficher le témoignage ${index + 1}"></button>`).join('');

  const dots = Array.from(testimonialDots.querySelectorAll('button'));
  let activeIndex = 0;

  const update = () => {
    testimonialTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === activeIndex));
  };

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    activeIndex = index;
    update();
  }));

  update();

  window.setInterval(() => {
    activeIndex = (activeIndex + 1) % testimonialItems.length;
    update();
  }, 5000);
}

function handleForm() {
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Envoi en cours...';

    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });

      if (!response.ok) throw new Error('Network response was not ok');

      form.reset();
      status.textContent = 'Merci, votre message a bien été envoyé.';
      status.style.color = '#74b8ff';
    } catch (error) {
      status.textContent = 'Le message est prêt, mais la soumission nécessite un déploiement Netlify.';
      status.style.color = '#ffb454';
    }
  });
}

function setupChatbot() {
  if (!chatLauncher || !chatClose || !chatbot || !chatbotBody || !chatbotForm || !chatbotInput) return;

  const appendMessage = (text, role = 'bot') => {
    const message = document.createElement('div');
    message.className = `chatbot-message ${role}`;
    message.textContent = text;
    chatbotBody.appendChild(message);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const replyFromInput = (text) => {
    const normalized = text.toLowerCase();
    if (normalized.includes('projet')) return chatbotReplies.projets;
    if (normalized.includes('service')) return chatbotReplies.services;
    if (normalized.includes('contact') || normalized.includes('email') || normalized.includes('téléphone') || normalized.includes('telephone')) return chatbotReplies.contact;
    if (normalized.includes('cv') || normalized.includes('curriculum')) return chatbotReplies.cv;
    if (normalized.includes('compétence') || normalized.includes('competence') || normalized.includes('skill')) return chatbotReplies.skills;
    if (normalized.includes('bonjour') || normalized.includes('salut') || normalized.includes('hello')) return chatbotReplies.saluer;
    return 'Je peux aider sur les projets, les services, les compétences, le CV ou le contact.';
  };

  const openChatbot = () => {
    chatbot.classList.add('open');
    chatbot.setAttribute('aria-hidden', 'false');
    if (!chatbotState.greeted) {
      appendMessage("Bonjour, je suis l'assistant virtuel de Mamadou Alpha Barry. Comment puis-je vous aider ?", 'bot');
      appendMessage('Vous pouvez cliquer sur un raccourci ou écrire votre question directement.', 'bot');
      chatbotState.greeted = true;
    }
    window.setTimeout(() => chatbotInput.focus(), 50);
  };

  const closeChatbot = () => {
    chatbot.classList.remove('open');
    chatbot.setAttribute('aria-hidden', 'true');
  };

  chatLauncher.addEventListener('click', () => {
    openChatbot();
  });

  chatClose.addEventListener('click', () => {
    closeChatbot();
  });

  chatbot.querySelectorAll('[data-reply]').forEach((button) => {
    button.addEventListener('click', () => {
      const choice = button.dataset.reply || '';
      const question = button.textContent.trim();
      appendMessage(question, 'user');
      appendMessage(chatbotReplies[choice] || chatbotReplies.saluer, 'bot');
    });
  });

  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatbotInput.value.trim();
    if (!message) return;
    appendMessage(message, 'user');
    appendMessage(replyFromInput(message), 'bot');
    chatbotInput.value = '';
    chatbotInput.focus();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeChatbot();
    }
  });

  if (!chatbotState.greeted) {
    appendMessage('Tapez une question ou utilisez les boutons rapides ci-dessous.', 'bot');
    chatbotState.greeted = true;
  }
}

function setupParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas || prefersReducedMotion) return;
  const context = canvas.getContext('2d');
  const particles = [];
  let animationFrameId = 0;
  let running = true;

  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2.2 + 0.8,
    speedX: (Math.random() - 0.5) * 0.45,
    speedY: (Math.random() - 0.5) * 0.45,
    alpha: Math.random() * 0.5 + 0.2
  });

  const count = window.innerWidth < 768 ? 24 : 48;
  for (let index = 0; index < count; index += 1) particles.push(createParticle());

  const animate = () => {
    if (!running) return;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;

      context.beginPath();
      context.fillStyle = `rgba(116, 184, 255, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    animationFrameId = requestAnimationFrame(animate);
  };

  resize();
  animate();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) {
      animate();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  startTypewriter();
  renderTestimonials();
  handleForm();
  setupChatbot();
  setupParticles();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => null);
  });
}
