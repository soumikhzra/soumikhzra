const sections = Array.from(document.querySelectorAll('.section.reveal'));
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
const progressBar = document.querySelector('.scroll-progress span');
const body = document.body;

const observer = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    }
  },
  { threshold: 0.18 }
);

sections.forEach(section => observer.observe(section));

const sectionTargets = navLinks
  .map(link => {
    if (link.getAttribute('href') === '#home') {
      return null;
    }
    const target = document.querySelector(link.getAttribute('href'));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

const homeLink = navLinks.find(link => link.getAttribute('href') === '#home');

function updateActiveNav() {
  const scrollPosition = window.scrollY;
  const viewportMidpoint = scrollPosition + window.innerHeight * 0.38;
  let activeLink = homeLink;

  for (const { link, target } of sectionTargets) {
    const top = target.offsetTop;
    const bottom = top + target.offsetHeight;
    if (viewportMidpoint >= top && viewportMidpoint < bottom) {
      activeLink = link;
    }
  }

  navLinks.forEach(link => link.classList.toggle('active', link === activeLink));
  body.classList.toggle('scrolled', scrollPosition > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollPosition / scrollable) * 100 : 0;
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
}

let ticking = false;

function requestUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    ticking = false;
  });
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
window.addEventListener('load', updateActiveNav);
updateActiveNav();

document.addEventListener('click', async event => {
  const callLink = event.target.closest('[data-smart-call="true"]');
  if (!callLink) return;

  const supportsDialer = window.matchMedia('(hover: none)').matches || navigator.maxTouchPoints > 0;
  if (supportsDialer) return;

  event.preventDefault();

  const phoneNumber = '+91 74396 55821';
  try {
    await navigator.clipboard.writeText(phoneNumber);
    const originalText = callLink.textContent;
    callLink.textContent = 'Number copied';
    window.setTimeout(() => {
      callLink.textContent = originalText;
    }, 1600);
  } catch {
    window.prompt('Copy the phone number:', phoneNumber);
  }
});
