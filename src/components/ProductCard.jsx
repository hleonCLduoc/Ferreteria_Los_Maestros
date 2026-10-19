import { useCarrito } from '../context/ContextoCarrito';

export const ProductCard = (producto) => {
  const { agregarAlCarrito, carrito } = useCarrito();

  const { id, nombre, precio, stock, disponible, imagen } = producto;

  const cantidadEnCarrito =
    carrito.find((item) => item.id === id)?.cantidad ?? 0;

  const puedeAgregar = disponible && cantidadEnCarrito < stock;

  return (
<div className="producto-tarjeta tarjeta-catalogo">
        <img src={imagen} alt={nombre} className="producto-img" />

      <h3>{nombre}</h3>
      <p className="precio">{precio}</p>

      <p className={`stock ${disponible ? 'disponible' : 'agotado'}`}>
        {disponible ? `Stock: ${stock} unidades` : 'Agotado (Sin Stock)'}
      </p>

      <button
        type="button"
        className="boton-reserva"
        onClick={() => agregarAlCarrito(producto)}
        disabled={!puedeAgregar}
      >
        {!disponible || stock <= 0
          ? 'Sin stock'
          : puedeAgregar
            ? 'Agregar al carrito'
            : 'Stock máximo en carrito'}
      </button>
    </div>
  );
};