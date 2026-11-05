import { Link, useParams } from 'react-router-dom';
import { useCompras } from '../context/compras';
import { moneda, fechaHora } from '../services/almacenamiento';
import { ResumenCompra } from '../components/ResumenCompra';
export function Confirmacion() {
  const { tipo, id } = useParams();
  const { pedidos, reservas } = useCompras();
  const esReserva = tipo === 'reserva';
  const registro = (
    esReserva ? reservas : tipo === 'compra' ? pedidos : []
  ).find((r) => r.id === id);
  if (!registro)
    return (
      <section className="extracto">
        <h2>No encontramos ese comprobante</h2>
        <Link to="/cuentas">Volver a mi cuenta</Link>
      </section>
    );
  const cancelado = ['CANCELADO', 'CANCELADA', 'VENCIDA'].includes(
    registro.estado,
  );
  const comprada = esReserva && registro.estado === 'COMPRADA';
  const pendiente = !esReserva && registro.estadoPago === 'PENDIENTE';
  return (
    <section className="confirmacion">
      <div className="confirmacion-cabecera">
        <span
          className={
            cancelado ? 'confirmacion-icono inactivo' : 'confirmacion-icono'
          }
          aria-hidden="true"
        >
          {cancelado ? '—' : '✓'}
        </span>
        <span className="etiqueta-seccion">{registro.numero}</span>
        <h2>
          {cancelado
            ? esReserva
              ? 'Esta reserva ya no está activa'
              : 'Pedido cancelado'
            : comprada
              ? 'Tu reserva ya es una compra'
              : esReserva
                ? 'Tus materiales quedaron reservados'
                : pendiente
                  ? 'Tu pedido está confirmado'
                  : '¡Compra completada!'}
        </h2>
        <p>
          {cancelado
            ? 'Operación cancelada.'
            : comprada
              ? 'Reserva convertida en compra.'
              : esReserva
                ? `Puedes retirar o pagar tu reserva hasta el ${fechaHora(registro.vence)}.`
                : registro.metodo === 'CUENTA_CORRIENTE'
                  ? 'Agregamos la compra a tu cuenta corriente. Ya puedes revisar el movimiento.'
                  : pendiente
                    ? 'Falta completar el pago. Puedes hacerlo desde tu cuenta cuando quieras.'
                    : 'Pago aprobado.'}
        </p>
        <p className="numero-operacion">
          {fechaHora(registro.fecha)} · Total {moneda(registro.total)}
        </p>
      </div>
      <div className="compra-layout">
        <div className="panel-proceso">
          <h3>{esReserva ? 'Datos de la reserva' : 'Datos del pedido'}</h3>
          {esReserva && (cancelado || comprada) ? (
            <p>
              {cancelado
                ? 'Puedes elegir materiales en el catálogo y hacer una nueva reserva.'
                : 'Tus materiales ya están asociados a una compra.'}
            </p>
          ) : esReserva ? (
            <>
              <p>
                Presenta el número <strong>{registro.numero}</strong> para
                identificar tus materiales.
              </p>
              <p>
                Tu reserva se libera si pasan 24 horas sin completar la compra.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>
                  {registro.entrega === 'RETIRO'
                    ? 'Retiro en tienda'
                    : 'Despacho a domicilio'}
                </strong>
              </p>
              <p>
                {registro.direccion}
                {registro.entrega === 'DESPACHO' ? `, ${registro.comuna}` : ''}
              </p>
              <p>Teléfono: {registro.telefono}</p>
              <p>
                Pago:{' '}
                {registro.metodo === 'CUENTA_CORRIENTE'
                  ? 'Cuenta corriente'
                  : registro.metodo === 'TRANSFERENCIA'
                    ? 'Transferencia'
                    : 'Tarjeta'}{' '}
                · {registro.estadoPago === 'PAGADO' ? 'Pagado' : 'Pendiente'}
              </p>
            </>
          )}
          <div className="acciones">
            {comprada && (
              <Link
                className="boton-reserva"
                to={`/confirmacion/compra/${registro.pedidoId}`}
              >
                Ver compra
              </Link>
            )}
            {esReserva && registro.estado === 'ACTIVA' && (
              <Link
                className="boton-reserva"
                to={`/pago?reserva=${registro.id}`}
              >
                Pagar mi reserva
              </Link>
            )}
            <Link
              className="boton-secundario"
              to={`/cuentas?seccion=${esReserva ? 'reservas' : 'compras'}`}
            >
              Ver en mi cuenta
            </Link>
            <Link to="/productos">Seguir comprando</Link>
          </div>
        </div>
        <ResumenCompra
          productos={registro.productos}
          titulo={esReserva ? 'Materiales reservados' : 'Detalle de la compra'}
        />
      </div>
    </section>
  );
}
