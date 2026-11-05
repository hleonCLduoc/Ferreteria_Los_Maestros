import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAut } from '../context/auth';
export const RutaProtegida = ({ roles }) => {
  const { usuario } = useAut();
  const location = useLocation();
  if (!usuario)
    return (
      <Navigate
        to="/cuentas"
        state={{ desde: location.pathname + location.search }}
        replace
      />
    );
  if (roles && !roles.includes(usuario.rol))
    return (
      <section className="extracto">
        <h2>Acceso restringido</h2>
        <p>Esta sección es solo para el administrador.</p>
        <Link to="/cuentas">Volver a mi cuenta</Link>
      </section>
    );
  return <Outlet />;
};
