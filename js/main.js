document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Default to light mode
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

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el));
});
