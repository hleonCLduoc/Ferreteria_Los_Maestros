import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav>
      <NavLink to="/">Inicio</NavLink> |{' '}
      <NavLink to="/productos">Catálogo</NavLink> |{' '}
      <NavLink to="/reservar">Reservar</NavLink> |{' '}
      <NavLink to="/cuentas">Cuentas</NavLink> |{' '}
      <NavLink to="/blog">Blog</NavLink> |{' '}
      <NavLink to="/nosotros">Nosotros</NavLink>
    </nav>
  );
};
