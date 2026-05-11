    // Navbar sombra al hacer scroll
    const navbar  = document.getElementById('navbar');
    const backTop = document.getElementById('backTop');

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 40;
      navbar.classList.toggle('scrolled', scrolled);
      backTop.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    // Volver arriba
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Intersection Observer — reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .cat-card').forEach(el => observer.observe(el));