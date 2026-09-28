(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const updateThemeButton = () => {
    const dark = root.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  };
  updateThemeButton();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch { /* Keep working without storage. */ }
    updateThemeButton();
  });
  systemTheme.addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('portfolio-theme'); } catch { /* Storage is optional. */ }
    if (saved !== 'light' && saved !== 'dark') {
      root.dataset.theme = event.matches ? 'dark' : 'light';
      updateThemeButton();
    }
  });
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(section => {
      section.classList.add('is-ready');
      observer.observe(section);
    });
    const revealTarget = () => {
      let target;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
      target?.classList.add('is-visible');
    };
    revealTarget();
    window.addEventListener('hashchange', revealTarget);
  }

  const copy = document.querySelector('.copy-button');
  const status = document.querySelector('.copy-status');
  let reset;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kontakt.danieldanek@gmail.com');
      status.textContent = 'Email copied.';
      copy.querySelector('use').setAttribute('href', './assets/icons/tabler-sprite.svg#check');
      clearTimeout(reset);
      reset = setTimeout(() => {
        status.textContent = '';
        copy.querySelector('use').setAttribute('href', './assets/icons/tabler-sprite.svg#copy');
      }, 2500);
    } catch {
      status.textContent = 'Copy unavailable. Select the email address above or click to send a message.';
    }
  });
})();
