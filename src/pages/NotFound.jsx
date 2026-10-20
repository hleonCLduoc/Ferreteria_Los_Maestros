import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <main style={{ padding: '40px', textAlign: 'center' }}>
      <section className="extracto">
        <h2>404 - Página no encontrada</h2>
        <p>La sección o producto que estás buscando no existe o fue movido.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="boton-reserva">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
};