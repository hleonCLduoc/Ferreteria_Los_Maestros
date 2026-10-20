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

  //  si el carrito está vacío
  if (carrito.length === 0) {
    return (
      <section className="extracto">
        <h2>Mi carrito</h2>
        <p>Tu carrito está vacío.</p>
        <Link 
          to="/productos" 
          style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block', marginTop: '10px' }}
        >
          Ver productos
        </Link>
      </section>
    );
  }

  // Qué mostrar si hay productos
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

      {/* --- agregue boton de navegacion  y pago  --- */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          onClick={vaciarCarrito}
          style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Vaciar carrito
        </button>

        <Link 
          to="/" 
          style={{ padding: '10px 20px', backgroundColor: '#64748b', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
        >
          Volver al Inicio
        </Link>
        
        <button 
          onClick={() => alert("¡Procesando pago...!")} 
          style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Ir a Pagar
        </button>
      </div>

      <p style={{ marginTop: '20px' }}>
        <Link to="/productos">Seguir agregando productos</Link>
      </p>
    </section>
  );
};