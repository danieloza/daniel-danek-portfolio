// Apply the theme before paint to avoid a flash of the wrong background.
(() => {
  let preference;
  try { preference = localStorage.getItem('portfolio-theme'); } catch { /* Storage is optional. */ }
  document.documentElement.dataset.theme = preference === 'light' || preference === 'dark'
    ? preference : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
})();
