import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAut } from '../context/auth';
export const Navbar = () => {
  const [abierto, setAbierto] = useState(false);
  const { usuario, cerrarSesion } = useAut();
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
        <NavLink to="/reservar">Reservar</NavLink>
        <NavLink to="/cuentas">Cuentas</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        {usuario ? (
          <>
            <NavLink to="/admin">Admin</NavLink>
            <button className="salir" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/registro">Registro</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};
