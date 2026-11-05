import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAut } from '../context/auth';
export const RutaProtegida = () => {
  const { usuario } = useAut();
  const location = useLocation();
  return usuario ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ desde: location.pathname }} replace />
  );
};
