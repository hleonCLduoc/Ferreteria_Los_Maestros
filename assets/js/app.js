document.addEventListener("DOMContentLoaded", () => {
  cargarNavbar();
  cargarFooter();
});

// Carga de la Barra de Navegación
function cargarNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");

  if (placeholder) {
    placeholder.innerHTML = `
      <nav>
        <a href="index.html">Inicio</a> |
        <a href="catalogo.html">Catálogo y Stock</a> |
        <a href="reservar.html">Reservar Materiales</a> |
        <a href="cuenta.html">Mi Cuenta Corriente</a> |
        <a href="nosotros.html">Nosotros</a> |
        <a href="blogs.html">Blog y Consejos</a> |
        <a href="login.html">Iniciar Sesion</a>

      </nav>
    `;
  }
}

// Carga del Pie de Página (3 Columnas con Tarjetas)
function cargarFooter() {
  const placeholder = document.getElementById("footer-placeholder");

  if (placeholder) {
    placeholder.innerHTML = `
      <footer class="main-footer">
        <div class="footer-contenedor">
          
          <div class="footer-columna">
            <h3>Ferretería Los Maestros</h3>
            <p class="footer-descripcion">
              Más de 22 años proveyendo materiales de construcción, herramientas de calidad y atención personalizada a los maestros de La Serena.
            </p>
            <span class="footer-badge">📍 Región de Coquimbo, Chile</span>
          </div>

          <div class="footer-columna">
            <h3>Enlaces Rápidos</h3>
            <ul class="footer-links">
              <li><a href="catalogo.html">Catálogo y Stock</a></li>
              <li><a href="reservar.html">Reservar Materiales</a></li>
              <li><a href="cuenta.html">Mi Cuenta Corriente</a></li>
              <li><a href="blog.html">Blog y Consejos</a></li>
            </ul>
          </div>

          <div class="footer-columna">
            <h3>Atención al Cliente</h3>
            <p>📞 <strong>Teléfono:</strong> +56 51 223 4455</p>
            <p>📍 <strong>Dirección:</strong> Av. Fco. de Aguirre #450</p>
            <p>⏰ <strong>Horario:</strong> Lun - Vie: 8:00 a 18:30 hrs</p>
            <p>🗓️ <strong>Sábados:</strong> 9:00 a 14:00 hrs</p>
          </div>

          <div class="footer-derechos">
            <p>Desarrollado por <strong>AFarmer & HLeon © 2026</strong> - Todos los derechos reservados</p>
          </div>

        </div>
      </footer>
    `;
  }
}


const publicaciones = [
  {
    id: 1,
    titulo: "Cómo calcular el rendimiento del Cemento en tu obra",
    categoria: "Consejos",
    fecha: "05 de Septiembre, 2026",
    resumen: "Aprende a calcular los sacos de cemento exactos para radieres y muros sin desperdiciar material.",
    imagen: "assets/img/Cemento-Polpaico-Constructor-Dumpex-www.paginaswebs.cl-.jpg"
  },
  {
    id: 2,
    titulo: "Mantenimiento esencial para tu Taladro Percutor",
    categoria: "Herramientas",
    fecha: "01 de Septiembre, 2026",
    resumen: "Consejos prácticos de limpieza y cambio de carbones para prolongar la vida útil de tus equipos.",
    imagen: "assets/img/taladrobosch.jpg"
  },
  {
    id: 3,
    titulo: "Nuevo servicio de reserva online para Contratistas",
    categoria: "Noticias",
    fecha: "20 de Agosto, 2026",
    resumen: "Conoce nuestro sistema de reservas por la web para retirar directamente en mesón sin hacer filas.",
    imagen: "assets/img/pala_punta_huevo.jpg"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  cargarNavbar();
  if (document.getElementById("blog-grid")) {
    renderizarBlogs();
  }
});

function renderizarBlogs() {
  const contenedor = document.getElementById("blog-grid");
  if (!contenedor) return;

  contenedor.innerHTML = publicaciones.map(pub => `
    <article>
      <div>
        <span>${pub.categoria}</span>
        <p>${pub.fecha}</p>
        <h3>${pub.titulo}</h3>
        <p>${pub.resumen}</p>
      </div>
    </article>
  `).join("");
}