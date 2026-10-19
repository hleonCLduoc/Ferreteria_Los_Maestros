export const Nosotros = () => {
  return (
    <section className="nosotros">
      <div className="extracto">
        <h2>Nuestra Historia</h2>

        <p>
          Somos un negocio familiar de la Región de Coquimbo dedicado
          a abastecer a los contratistas, maestros de obra y familias
          de La Serena con materiales de construcción de calidad
          y herramientas de confianza.
        </p>

        <p>
          Contamos con 22 años de trayectoria apoyando los proyectos
          de nuestra comunidad.
        </p>
      </div>

      <div className="historia-tarjeta-wrap">
        <div className="historia-tarjeta">
          <img
            src="/assets/img/fachada.jpeg"
            alt="Fachada de Ferretería Los Maestros en La Serena"
            className="historia-foto"
          />
        </div>
      </div>
    </section>
  );
};