import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { productos } from '../data/productos';

export const Home = () => {
  return (
    <main>
      {/* SECCIÓN CATÁLOGO Y DISPONIBILIDAD */}
      <section className="catalogo">
        <h2>Disponibilidad de Materiales</h2>
        <p>Consulta nuestro stock disponible antes de dirigirte a nuestra tienda física:</p>

        {/* BANNER PROMOCIONAL */}
        <div className="banner-reserva">
          <div className="texto-promo">
            <h2>¡Herramientas profesionales para tus proyectos!</h2>
            <p>Asegura tus materiales reservando online y retira sin hacer filas en el mesón.</p>
          </div>
          <Link to="/reservar">
            <img 
              src="/assets/img/reservar.gif" 
              alt="reservar-ahora" 
              className="boton-reservar" 
            />
          </Link>
        </div>

        {/* LISTADO DINÁMICO DE PRODUCTOS */}
        <div className="productos-contenedor">
          {productos.map((producto) => (
            <ProductCard 
              key={producto.id} 
              {...producto} 
            />
          ))}
        </div>
      </section>

      {/* BANNER DE LIQUIDACIÓN */}
      <section className="banner-liquidacion">
        <span className="etiqueta-alerta">¡OFERTA DE LA SEMANA!</span>
        <img src="/assets/img/oferta.jpg" alt="Banner-oferta" className="banner-img" />
        <h2>Gran Liquidación de Herramientas Manuales</h2>
        <p>
          Hasta un <strong>30% de descuento</strong> en alicates, destornilladores y sets de llaves. 
          Solo por compras con retiro en local hasta agotar stock.
        </p>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section className="extracto">
        <h2>Sobre Nosotros</h2>
        <p>
          Somos un negocio familiar de la Región de Coquimbo dedicado a abastecer a los contratistas, 
          maestros de obra y familias de La Serena con materiales de construcción de calidad y herramientas de confianza.
        </p>
      </section>
    </main>
  );
};