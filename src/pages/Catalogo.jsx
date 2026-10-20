import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { productos } from '../data/productos';

const categorias = [
  ...new Set(productos.map((producto) => producto.categoria)),
];

export const Catalogo = () => {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 15;

 
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      )
    : productos;

  
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

      <div className="filtro-catalogo">
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

      <p role="status">
        {productosFiltrados.length} productos encontrados
      </p>

      {/* Productos de la página seleccionada */}
      <div className="productos-contenedor">
        {productosVisibles.map((producto) => (
          <ProductCard key={producto.id} {...producto} />
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