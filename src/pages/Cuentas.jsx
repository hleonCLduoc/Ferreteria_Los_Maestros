import { Navigate, Link } from 'react-router-dom';
import { useAut } from '../context/ContextoAutenticacion';

export const Cuentas = () => {
  const { usuario, cerrarSesion } = useAut();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const formatoMoneda = (valor) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);

  return (
    <main>
      <section className="extracto">
        <h2>Mi Cuenta Corriente</h2>
        <p>Estado de crédito y saldo pendiente para contratistas registrados:</p>

        <div className="formulario-contenedor" style={{ textAlign: 'left' }}>
          <h3>Datos del Cliente</h3>
          <p><strong>Razón Social:</strong> {usuario.razonSocial}</p>
          <p><strong>RUT:</strong> {usuario.rut}</p>

          <hr style={{ margin: '15px 0', borderColor: '#e2e8f0' }} />

          <h3>Estado Financiero</h3>
          <p><strong>Línea de Crédito Total:</strong> {formatoMoneda(usuario.lineaCredito)}</p>
          <p>
            <strong>Saldo Utilizado:</strong> 
            <span style={{ color: '#dc2626', fontWeight: 'bold', marginLeft: '5px' }}>
              {formatoMoneda(usuario.saldoUtilizado)}
            </span>
          </p>
          <p><strong>Próximo Vencimiento:</strong> {usuario.proximoVencimiento}</p>

          {/* Nuevos botones de acción */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
            <Link 
              to="/" 
              style={{ padding: '10px 20px', backgroundColor: '#64748b', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
            >
              Volver al Inicio
            </Link>
            
            <Link 
              to="/productos" 
              style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
            >
              Comprar
            </Link>

            <button 
              onClick={cerrarSesion} 
              style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};