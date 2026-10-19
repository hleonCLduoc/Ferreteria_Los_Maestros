import { BotonCarrito } from './BotonCarrito';

export const Header = () => {
  return (
    <header>
      <div className="header-contenido">
        <img
          src="/assets/img/logo.png"
          alt="Logo de Ferretería Los Maestros"
          className="logo-img"
        />

        <div className="header-texto">
          <BotonCarrito />
          <h1>Ferretería Los Maestros</h1>
          <p>
            22 años junto a tus proyectos en La Serena
          </p>
        </div>
      </div>
    </header>
  );
};
