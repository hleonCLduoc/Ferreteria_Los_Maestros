import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { productos } from '../data/productos';

const categorias = [
  ...new Set(productos.map((producto) => producto.categoria)),
];

export const Catalogo = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 15;

  // Filtrado por categoría y texto (nombre, marca o código)
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = categoriaSeleccionada
      ? producto.categoria === categoriaSeleccionada
      : true;

    const termino = busqueda.toLowerCase().trim();
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(termino) ||
      (producto.marca && producto.marca.toLowerCase().includes(termino)) ||
      (producto.codigo && producto.codigo.toLowerCase().includes(termino));

    return coincideCategoria && coincideBusqueda;
  });

  // Cálculo de paginación
  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  const inicio = (paginaActual - 1) * productosPorPagina;
  const productosVisibles = productosFiltrados.slice(
    inicio,
    inicio + productosPorPagina
  );

  return (
    <section className="catalogo">
      <h2>Catálogo de productos</h2>
      <p>Encuentra herramientas y materiales para tus proyectos.</p>

      {/* Controles de filtro y búsqueda */}
      <div className="filtro-catalogo">
        <label htmlFor="busqueda-productos">Buscar</label>
        <input
          id="busqueda-productos"
          type="text"
          placeholder="Buscar por nombre, marca o código..."
          value={busqueda}
          onChange={(evento) => {
            setBusqueda(evento.target.value);
            setPaginaActual(1);
          }}
        />

        <label htmlFor="categoria-productos">Categoría</label>
        <select
          id="categoria-productos"
          value={categoriaSeleccionada}
          onChange={(evento) => {
            setCategoriaSeleccionada(evento.target.value);
            setPaginaActual(1);
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      <p role="status">{productosFiltrados.length} productos encontrados</p>

      {/* Productos de la página seleccionada */}
      <div className="productos-contenedor">
        {productosVisibles.map((producto) => (
          <ProductCard key={producto.id || producto.codigo} {...producto} />
        ))}
      </div>

      {/* Botones para cambiar de página */}
      {totalPaginas > 1 && (
        <nav className="paginacion" aria-label="Páginas del catálogo">
          <button
            type="button"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            Anterior
          </button>

          {Array.from({ length: totalPaginas }, (_, indice) => {
            const numeroPagina = indice + 1;
            return (
              <button
                key={numeroPagina}
                type="button"
                onClick={() => setPaginaActual(numeroPagina)}
                className={
                  paginaActual === numeroPagina ? 'pagina-activa' : ''
                }
                aria-current={
                  paginaActual === numeroPagina ? 'page' : undefined
                }
              >
                {numeroPagina}
              </button>
            );
          })}

          <button
            type="button"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}
    </section>
  );
};
