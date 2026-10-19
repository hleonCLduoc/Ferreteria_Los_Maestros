import { Link } from 'react-router-dom';
import { useCarrito } from '../context/ContextoCarrito';

const formatoPrecio = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);

export const Carrito = () => {
  const {
    carrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    totalProductos,
    precioTotal,
  } = useCarrito();

  if (carrito.length === 0) {
    return (
      <section className="extracto">
        <h2>Mi carrito</h2>
        <p>Tu carrito está vacío.</p>
        <Link to="/">Ver productos</Link>
      </section>
    );
  }

  return (
    <section className="extracto">
      <h2>Mi carrito</h2>

      <div className="productos-contenedor">
        {carrito.map((producto) => (
          <article key={producto.id} className="producto-tarjeta">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="producto-img"
            />

            <h3>{producto.nombre}</h3>

            <p>
              Precio unitario: {formatoPrecio(producto.precioNumero)}
            </p>

            <div>
              <button
                type="button"
                aria-label={`Disminuir cantidad de ${producto.nombre}`}
                onClick={() => actualizarCantidad(producto.id, -1)}
                disabled={producto.cantidad <= 1}
              >
                −
              </button>

              <span> {producto.cantidad} </span>

              <button
                type="button"
                aria-label={`Aumentar cantidad de ${producto.nombre}`}
                onClick={() => actualizarCantidad(producto.id, 1)}
                disabled={producto.cantidad >= producto.stock}
              >
                +
              </button>
            </div>

            <p>
              Subtotal:{' '}
              {formatoPrecio(
                producto.precioNumero * producto.cantidad
              )}
            </p>

            <button
              type="button"
              onClick={() => eliminarDelCarrito(producto.id)}
            >
              Eliminar
            </button>
          </article>
        ))}
      </div>

      <p>Total de unidades: {totalProductos}</p>
      <h3>Total: {formatoPrecio(precioTotal)}</h3>

      <button type="button" onClick={vaciarCarrito}>
        Vaciar carrito
      </button>

      <p>
        <Link to="/">Seguir agregando productos</Link>
      </p>
    </section>
  );
};