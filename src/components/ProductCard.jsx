import { Link } from 'react-router-dom';

export const ProductCard = ({ nombre, precio, stock, disponible, imagen }) => {
  return (
    <div className="producto-tarjeta">
      <img src={imagen} alt={nombre} className="producto-img" />
      <h3>{nombre}</h3>
      <p className="precio">{precio}</p>
      
      <p className={`stock ${disponible ? 'disponible' : 'agotado'}`}>
        {disponible ? `Stock: ${stock} unidades` : 'Agotado (Sin Stock)'}
      </p>

      {disponible && (
        <Link to="/reservar" className="boton-reserva">
          Reservar
        </Link>
      )}
    </div>
  );
};