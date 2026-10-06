import { BlogCard } from '../components/BlogCard';
import { publicaciones } from '../data/publicaciones';

export const Blog = () => {
  return (
    <main>
      <section className="catalogo">
        <h2>Blog y Consejos para Maestros</h2>
        <p>Guías técnicas, recomendaciones de uso de materiales y novedades para tus proyectos:</p>

        <div className="banner-reserva">
          <div className="texto-promo">
            <h2>¡Aprende a rendir al máximo tus materiales!</h2>
            <p>Revisa nuestros artículos técnicos para cuidar tus herramientas y evitar desperdicios en obra.</p>
          </div>
        </div>

        {/* Renderizado dinámico de tarjetas de blog */}
        <div className="productos-contenedor">
          {publicaciones.map((pub) => (
            <BlogCard key={pub.id} {...pub} />
          ))}
        </div>
      </section>

      <section className="banner-liquidacion">
        <span className="etiqueta-alerta">¡CONSEJO DE LA SEMANA!</span>
        <h2>¿Tienes dudas con un proyecto en La Serena?</h2>
        <p>Ven a nuestro local en mesón y conversamos directamente sobre los materiales que más te convienen.</p>
      </section>
    </main>
  );
};
