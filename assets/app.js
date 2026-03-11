(() => {
  const body = document.body;
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  const modal = document.querySelector('[data-modal]');
  const openPolicy = document.querySelectorAll('[data-open-policy]');
  const closePolicy = document.querySelectorAll('[data-close-policy]');
  let lastFocus = null;

  const getFocusables = () => drawer ? [...drawer.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])')] : [];

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    backdrop?.classList.add('active');
    burger?.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
    getFocusables()[0]?.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop?.classList.remove('active');
    burger?.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  burger?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', closeDrawer));

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const menu = btn.parentElement?.querySelector('[data-lang-menu]');
      if (!menu) return;
      document.querySelectorAll('[data-lang-menu]').forEach(m => { if (m !== menu) m.classList.remove('open'); });
      menu.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-wrap').forEach((wrap) => {
      const menu = wrap.querySelector('[data-lang-menu]');
      if (menu && !wrap.contains(e.target)) menu.classList.remove('open');
    });
    if (modal && !modal.hasAttribute('hidden') && e.target === modal) {
      modal.setAttribute('hidden', '');
      body.classList.remove('no-scroll');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.querySelectorAll('[data-lang-menu]').forEach(m => m.classList.remove('open'));
      if (modal && !modal.hasAttribute('hidden')) {
        modal.setAttribute('hidden', '');
        body.classList.remove('no-scroll');
      }
    }
    if (e.key === 'Tab' && drawer?.classList.contains('open')) {
      const nodes = getFocusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item').forEach(other => { if (other !== item) other.open = false; });
    });
  });

  openPolicy.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal?.removeAttribute('hidden');
    body.classList.add('no-scroll');
  }));
  closePolicy.forEach(btn => btn.addEventListener('click', () => {
    modal?.setAttribute('hidden', '');
    body.classList.remove('no-scroll');
  }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
