import { Link } from 'react-router-dom';
import { useCarrito } from '../context/ContextoCarrito';

export const ProductCard = ({ id, nombre, precio, precioNumero, stock, disponible, imagen }) => {
  const { agregarAlCarrito } = useCarrito();

  const handleAgregar = () => {
    const producto = { id, nombre, precio, precioNumero, stock, disponible, imagen };
    const exito = agregarAlCarrito(producto);
    if (exito) {
      alert(`¡Enviado al carrito! Se agregó: ${nombre}`);
    }
  };

  return (
    <div className="producto-tarjeta">
      <img src={imagen} alt={nombre} className="producto-img" />
      <h3>{nombre}</h3>
      <p className="precio">{precio}</p>

      <p className={`stock ${disponible && stock > 0 ? 'disponible' : 'agotado'}`}>
        {disponible && stock > 0 ? `Stock: ${stock} unidades` : 'Agotado (Sin Stock)'}
      </p>

      {disponible && stock > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          <button type="button" onClick={handleAgregar} className="boton-enviar">
            Agregar al Carrito
          </button>
          <Link to="/reservar" className="boton-reserva">
            Reservar
          </Link>
        </div>
      ) : (
        <button disabled className="boton-enviar" style={{ backgroundColor: '#9ca3af', cursor: 'not-allowed' }}>
          Sin Stock
        </button>
      )}
    </div>
  );
};