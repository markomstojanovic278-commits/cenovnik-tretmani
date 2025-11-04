// ====================== GODINA U FOOTERU ======================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====================== NAV / HAMBURGER ======================
(() => {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  // button hardening
  if (btn.tagName === 'BUTTON' && btn.type !== 'button') btn.type = 'button';

  // Overlay: postojeći ili kreiraj
  let overlay =
    document.getElementById('navOverlay') ||
    document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  const OPEN_CLASS = 'show';
  const BTN_ACTIVE = 'active';
  let lastFocusedBeforeOpen = null;
  let scrollY = 0;

  // ===== Scroll-freeze (bez skoka) =====
  function freezeScroll() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('no-scroll-fixed');
  }
  function unfreezeScroll() {
    document.body.classList.remove('no-scroll-fixed');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  // ===== Otvaranje / zatvaranje =====
  function openNav() {
    nav.classList.add(OPEN_CLASS);
    overlay.classList.add(OPEN_CLASS);
    btn.classList.add(BTN_ACTIVE);
    btn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    lastFocusedBeforeOpen = document.activeElement;
    freezeScroll();
    nav.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus?.();
  }

  function closeNav() {
    nav.classList.remove(OPEN_CLASS);
    overlay.classList.remove(OPEN_CLASS);
    btn.classList.remove(BTN_ACTIVE);
    btn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    unfreezeScroll();
    lastFocusedBeforeOpen?.focus?.();
  }

  function isOpen() {
    return nav.classList.contains(OPEN_CLASS);
  }

  // ===== Klik na hamburger =====
  btn.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (btn.tagName === 'A') e.preventDefault();
    if (a) {
      const href = a.getAttribute('href') || '';
      if (href === '#' || href.startsWith('#')) e.preventDefault();
    }
    isOpen() ? closeNav() : openNav();
    e.stopPropagation();
  });

  // ===== Klik unutar menija =====
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) { e.stopPropagation(); return; }

    const href = link.getAttribute('href') || '';
    // #anchor: PRVO zatvorimo meni, PA onda skrol (sledeći frame)
    if (href.startsWith('#')) {
      e.preventDefault();
      const runScroll = () => smoothGoTo(href);
      closeNav();
      // odloži skrol da unfreeze vrati layout pre pomeranja
      requestAnimationFrame(() => requestAnimationFrame(runScroll));
      return;
    }

    // spoljašnji link – samo zatvori i pusti default
    closeNav();
  });

  // ===== Klik na overlay zatvara =====
  overlay.addEventListener('click', closeNav);

  // ===== Klik van menija/dugmeta zatvara =====
  document.addEventListener('click', (e) => {
    if (!isOpen()) return;
    if (!nav.contains(e.target) && !btn.contains(e.target)) closeNav();
  });

  // ===== Tastatura =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeNav();
      btn.focus();
      return;
    }
    // focus-trap
    if (e.key === 'Tab' && isOpen()) {
      const f = nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

// ====================== SMOOTH SCROLL HELPERS ======================
function smoothGoTo(hash){
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (history.pushState) history.pushState(null, '', hash);
}

// ====================== LINKOVI VAN MENIJA (npr. dugme u hero) ======================
document.querySelectorAll('a[href^="#"]:not(.nav a)').forEach(a => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    smoothGoTo(hash);
  });
});

// ====================== REVEAL (IntersectionObserver) ======================
(() => {
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
