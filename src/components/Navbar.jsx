import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav>
      <NavLink to="/">Inicio</NavLink> |{' '}
      <NavLink to="/productos">Catálogo</NavLink> |{' '}
      <NavLink to="/reservar">Reservar</NavLink> |{' '}
      <NavLink to="/cuentas">Cuentas</NavLink> |{' '}
      <NavLink to="/blog">Blog</NavLink> |{' '}
      <NavLink to="/nosotros">Nosotros</NavLink> |{' '}
      <NavLink to="/login">Login</NavLink> |{' '}
      <NavLink to="/registro">Registro</NavLink> |{' '}
      <NavLink to="/admin">Admin</NavLink>
    </nav>
  );
};