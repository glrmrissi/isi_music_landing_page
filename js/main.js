document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark') {
    html.classList.add('dark');
    themeIcon.textContent = 'dark_mode';
  } else {
    html.classList.remove('dark');
    themeIcon.textContent = 'light_mode';
  }

  themeToggleBtn.addEventListener('click', () => {
    html.classList.toggle('dark');
    const dark = html.classList.contains('dark');
    themeIcon.textContent = dark ? 'dark_mode' : 'light_mode';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 400) {
            backToTop.classList.remove('opacity-0', 'pointer-events-none');
            backToTop.classList.add('opacity-100', 'pointer-events-auto');
          } else {
            backToTop.classList.add('opacity-0', 'pointer-events-none');
            backToTop.classList.remove('opacity-100', 'pointer-events-auto');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
