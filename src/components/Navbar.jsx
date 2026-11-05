import { useState } from 'react';
import { NavLink } from 'react-router-dom';
export const Navbar = () => {
  const [abierto, setAbierto] = useState(false);
  return (
    <nav className="navegacion" aria-label="Navegación principal">
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-principal"
        onClick={() => setAbierto(!abierto)}
      >
        ☰ Menú
      </button>
      <div
        id="menu-principal"
        className={abierto ? 'menu abierto' : 'menu'}
        onClick={() => setAbierto(false)}
      >
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Catálogo</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        <NavLink to="/cuentas">Mi cuenta</NavLink>
      </div>
    </nav>
  );
};
