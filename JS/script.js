// ====================== GODINA U FOOTERU ======================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====================== HAMBURGER + OVERLAY ======================
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
const overlay = document.getElementById('navOverlay');

let lastFocusedBeforeOpen = null;

function toggleNav(open) {
  if (!hamburger || !nav || !overlay) return;

  if (open) {
    nav.classList.add('show');
    overlay.classList.add('show');
    document.documentElement.classList.add('no-scroll');
    hamburger.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');

    lastFocusedBeforeOpen = document.activeElement;
    const firstLink = nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    firstLink?.focus();
  } else {
    nav.classList.remove('show');
    overlay.classList.remove('show');
    document.documentElement.classList.remove('no-scroll');
    hamburger.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    lastFocusedBeforeOpen?.focus?.();
  }
}
function closeNav(){ toggleNav(false); }

if (hamburger && nav && overlay) {
  hamburger.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-hidden', 'true');

  hamburger.addEventListener('click', () => {
    const isOpen = !nav.classList.contains('show');
    toggleNav(isOpen);
  });

  overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('show')) closeNav();

    // focus trap u otvorenom panelu
    if (e.key === 'Tab' && nav.classList.contains('show')) {
      const f = nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

// ====================== SMOOTH SCROLL HELPERS ======================
function smoothGoTo(hash){
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // upiši hash u URL bez skoka
  if (history.pushState) history.pushState(null, '', hash);
}

// ====================== LINKOVI U HAMBURGER PANELU ======================
if (nav) {
  nav.addEventListener('click', (e) => {
    const link = e.target instanceof Element ? e.target.closest('a') : null;
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothGoTo(href);
      closeNav();
    } else {
      closeNav(); // spoljašnji link – samo zatvori panel i pusti default
    }
  });
}

// ====================== LINKOVI VAN MENIJA (npr. dugme u hero sekciji) ======================
document.querySelectorAll('a[href^="#"]:not(.nav a)').forEach(a => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    smoothGoTo(hash);
    if (nav?.classList.contains('show')) closeNav();
  });
});

// ====================== REVEAL (IntersectionObserver) ======================
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('in'));
  }
})();
