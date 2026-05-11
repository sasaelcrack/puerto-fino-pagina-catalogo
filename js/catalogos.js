/* ═══════════════════════════════════════
   PUERTO FINO — catalogos.js
   Lógica compartida para las 6 páginas de catálogo.
   Cada página HTML define window.PRODUCTOS antes de cargar este archivo.
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── REFERENCIAS AL DOM ── */
  const grid      = document.getElementById('productosGrid');
  const countEl   = document.getElementById('productCount');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbNombre  = document.getElementById('lbNombre');
  const lbPrecio  = document.getElementById('lbPrecio');
  const lbClose   = document.getElementById('lbClose');
  const navbar    = document.getElementById('navbar');
  const backTop   = document.getElementById('backTop');

  /* ── ESTADO ── */
  let productos = window.PRODUCTOS || [];
  let ordenActual = 'default';

  /* ═══════════════════
     1. RENDER PRODUCTOS
  ═══════════════════ */
  function renderProductos(lista) {
    grid.innerHTML = '';

    if (lista.length === 0) {
      grid.innerHTML = `
        <div class="productos-empty">
          <p>No hay productos en esta categoría aún.</p>
        </div>`;
      return;
    }

    lista.forEach((prod, i) => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.style.animationDelay = `${i * 0.06}s`;
      card.innerHTML = `
        <div class="producto-img-wrap">
          <span class="producto-badge">Plata 925</span>
          <img
            class="producto-img"
            src="${prod.imagen}"
            alt="${prod.nombre}"
            loading="lazy"
          />
        </div>
        <div class="producto-info">
          <h3 class="producto-nombre">${prod.nombre}</h3>
          <p class="producto-precio">${formatPrecio(prod.precio)}</p>
        </div>
      `;

      /* abrir lightbox al hacer clic */
      card.addEventListener('click', () => abrirLightbox(prod));
      grid.appendChild(card);
    });

    /* actualizar contador */
    if (countEl) countEl.textContent = lista.length;

    /* activar animaciones reveal */
    observarCards();
  }

  /* ═══════════════════
     2. FORMATO PRECIO
  ═══════════════════ */
  function formatPrecio(precio) {
    if (!precio && precio !== 0) return '$ Consultar';
    return '$ ' + precio.toLocaleString('es-CO');
  }

  /* ═══════════════════
     3. FILTRO / ORDEN
  ═══════════════════ */
  function ordenarProductos(orden) {
    let lista = [...productos];

    if (orden === 'asc') {
      lista.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    } else if (orden === 'desc') {
      lista.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    }

    return lista;
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orden = btn.dataset.orden;

      /* si ya está activo, desactivar (volver a default) */
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        ordenActual = 'default';
        renderProductos(productos);
        return;
      }

      /* activar este, desactivar los demás */
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ordenActual = orden;

      renderProductos(ordenarProductos(orden));
    });
  });

  /* ═══════════════════
     4. LIGHTBOX
  ═══════════════════ */
  function abrirLightbox(prod) {
    lbImg.src    = prod.imagen;
    lbImg.alt    = prod.nombre;
    lbNombre.textContent = prod.nombre;
    lbPrecio.textContent = formatPrecio(prod.precio);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  if (lbClose)  lbClose.addEventListener('click', cerrarLightbox);
  if (lightbox) lightbox.addEventListener('click', e => {
    if (e.target === lightbox) cerrarLightbox();
  });

  /* cerrar con ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarLightbox();
  });

  /* ═══════════════════
     5. REVEAL ANIMACIÓN
  ═══════════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  function observarCards() {
    document.querySelectorAll('.producto-card').forEach(card => {
      revealObserver.observe(card);
    });
  }

  /* reveal para elementos estáticos (fade-up) */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  /* ═══════════════════
     6. NAVBAR SCROLL
  ═══════════════════ */
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ═══════════════════
     7. BACK TO TOP
  ═══════════════════ */
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 300);
    }, { passive: true });

    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════
     8. NAV LINK ACTIVO
  ═══════════════════ */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.cat-nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ── INICIO ── */
  renderProductos(productos);

});
