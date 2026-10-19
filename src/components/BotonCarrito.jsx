import { NavLink } from 'react-router-dom';
import { useCarrito } from '../context/ContextoCarrito';

export const BotonCarrito = () => {
  const { totalProductos } = useCarrito();

  return (
    <NavLink
      to="/carrito"
      className="enlace-carrito"
      aria-label={`Carrito con ${totalProductos} unidades`}
    >
      <span className="carrito-icono">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 3h3l4 13h10l3-9H7" />
          <circle cx="10" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
        </svg>

        <span className="carrito-contador">
          {totalProductos}
        </span>
      </span>

      <span>Carrito</span>
    </NavLink>
  );
};