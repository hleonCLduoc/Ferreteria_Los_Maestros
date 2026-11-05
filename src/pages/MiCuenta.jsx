import { useAut } from '../context/auth';
import { AccesoCuenta } from './AccesoCuenta';
import { Cuentas } from './Cuentas';
import { AdminHome } from './AdminHome';
export function MiCuenta() {
  const { usuario } = useAut();
  return !usuario ? (
    <AccesoCuenta />
  ) : usuario.rol === 'ADMIN' ? (
    <AdminHome />
  ) : (
    <Cuentas />
  );
}
