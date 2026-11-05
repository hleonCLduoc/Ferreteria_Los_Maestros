import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAut } from '../context/auth';
import { useCompras } from '../context/compras';
import { moneda, fechaHora } from '../services/almacenamiento';
import { ResumenCompra } from '../components/ResumenCompra';
import { PagoPrueba } from '../components/PagoPrueba';
const nombres = {
  ACTIVA: 'Activa',
  CANCELADA: 'Cancelada',
  VENCIDA: 'Vencida',
  COMPRADA: 'Convertida en compra',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  PAGADO: 'Pagado',
  PENDIENTE: 'Pendiente de pago',
};
const metodoPago = (metodo) =>
  ({
    TARJETA: 'Tarjeta',
    TRANSFERENCIA: 'Transferencia',
    CUENTA_CORRIENTE: 'Cuenta corriente',
  })[metodo];
export const Cuentas = () => {
  const { usuario, cerrarSesion } = useAut();
  const {
    pedidos,
    reservas,
    abonos,
    saldo,
    cancelarReserva,
    cancelarPedido,
    abonar,
  } = useCompras();
  const [params, setParams] = useSearchParams();
  const opciones = ['resumen', 'compras', 'reservas', 'movimientos'];
  const seccion = opciones.includes(params.get('seccion'))
    ? params.get('seccion')
    : 'resumen';
  const [confirmar, setConfirmar] = useState(null),
    [mensaje, setMensaje] = useState(''),
    [error, setError] = useState(''),
    [monto, setMonto] = useState(''),
    [resultado, setResultado] = useState('APROBADO'),
    [enviando, setEnviando] = useState(false);
  const abonoClave = useRef(null),
    procesando = useRef(false);
  const activas = reservas.filter((r) => r.estado === 'ACTIVA').length;
  const cierre = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).toLocaleDateString('es-CL');
  const cambiar = (valor) => {
    setParams({ seccion: valor });
    setMensaje('');
    setError('');
    setConfirmar(null);
  };
  const cancelar = () => {
    try {
      if (confirmar.tipo === 'reserva') cancelarReserva(confirmar.id);
      else cancelarPedido(confirmar.id);
      setMensaje(
        'La operación fue cancelada y los materiales volvieron a estar disponibles.',
      );
      setConfirmar(null);
    } catch (e) {
      setError(e.message);
    }
  };
  const pagarAbono = async (e) => {
    e.preventDefault();
    if (procesando.current) return;
    procesando.current = true;
    setEnviando(true);
    setError('');
    setMensaje('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (resultado === 'RECHAZADO')
        throw new Error('Pago rechazado.');
      if (abonoClave.current?.monto !== monto)
        abonoClave.current = { monto, id: crypto.randomUUID() };
      abonar(Number(monto), abonoClave.current.id);
      setMonto('');
      abonoClave.current = null;
      setMensaje('Pago aprobado. El abono ya aparece en tus movimientos.');
    } catch (e) {
      setError(e.message);
    } finally {
      procesando.current = false;
      setEnviando(false);
    }
  };
  const movimientos = [
    ...pedidos
      .filter(
        (p) => p.metodo === 'CUENTA_CORRIENTE' && p.estado !== 'CANCELADO',
      )
      .map((p) => ({
        id: p.id,
        fecha: p.fecha,
        detalle: `Compra ${p.numero}`,
        monto: p.total,
      })),
    ...abonos.map((a) => ({
      ...a,
      detalle: 'Abono',
      monto: -a.monto,
    })),
  ].sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha));
  return (
    <section className="mi-cuenta">
      <div className="encabezado-pagina cabecera-cuenta">
        <div>
          <h2>Mi cuenta</h2>
          <p>
            Hola, <strong>{usuario.razonSocial}</strong>.
          </p>
        </div>
        <div className="acciones-cuenta">
          <Link className="boton-secundario" to="/reservar">
            Reservar materiales
          </Link>
          <button className="boton-secundario" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="cuenta-menu" aria-label="Secciones de mi cuenta">
        {[
          ['resumen', 'Resumen'],
          ['compras', `Mis compras (${pedidos.length})`],
          ['reservas', `Mis reservas (${reservas.length})`],
          ['movimientos', 'Cuenta corriente'],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            aria-pressed={seccion === id}
            onClick={() => cambiar(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {mensaje && (
        <p className="mensaje" role="status">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="mensaje error" role="alert">
          {error}
        </p>
      )}
      {confirmar && (
        <div
          className="confirmar-cancelacion"
          role="group"
          aria-label="Confirmar cancelación"
        >
          <p>
            ¿Quieres cancelar {confirmar.numero}? Los materiales se liberarán.
          </p>
          <div className="acciones">
            <button className="boton-peligro" onClick={cancelar}>
              Sí, cancelar
            </button>
            <button
              className="boton-secundario"
              onClick={() => setConfirmar(null)}
            >
              Mantener
            </button>
          </div>
        </div>
      )}
      {seccion === 'resumen' && (
        <>
          <div className="indicadores-cuenta">
            <div>
              <span>Compras registradas</span>
              <strong>{pedidos.length}</strong>
              <button onClick={() => cambiar('compras')}>Ver compras</button>
            </div>
            <div>
              <span>Reservas activas</span>
              <strong>{activas}</strong>
              <button onClick={() => cambiar('reservas')}>Ver reservas</button>
            </div>
            <div>
              <span>Saldo pendiente</span>
              <strong>{moneda(saldo)}</strong>
              <button onClick={() => cambiar('movimientos')}>
                Ver cuenta corriente
              </button>
            </div>
          </div>
          <div className="cuenta-resumen">
            <div className="panel-proceso">
              <h3>Mis datos</h3>
              <dl className="datos-cliente">
                <dt>Nombre / Razón social</dt>
                <dd>{usuario.razonSocial}</dd>
                <dt>RUT</dt>
                <dd>{usuario.rut}</dd>
                <dt>Correo electrónico</dt>
                <dd>{usuario.email}</dd>
              </dl>
            </div>
            <div className="panel-proceso">
              <h3>Catálogo y reservas</h3>
              <div className="acciones">
                <Link className="boton-reserva" to="/productos">
                  Ir al catálogo
                </Link>
                <Link className="boton-secundario" to="/reservar">
                  Reservar materiales
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      {seccion === 'compras' && (
        <div>
          <h3>Mis compras</h3>
          {!pedidos.length && (
            <div className="estado-vacio">
              <h4>Aún no tienes compras</h4>
              <Link className="boton-reserva" to="/productos">
                Explorar catálogo
              </Link>
            </div>
          )}
          {pedidos.map((p) => (
            <article className="registro-cuenta" key={p.id}>
              <header>
                <div>
                  <strong>{p.numero}</strong>
                  <span>{fechaHora(p.fecha)}</span>
                </div>
                <span
                  className={`estado ${p.estado === 'CANCELADO' ? 'neutro' : p.estadoPago === 'PAGADO' ? 'positivo' : 'pendiente'}`}
                >
                  {p.estado === 'CANCELADO'
                    ? 'Cancelado'
                    : nombres[p.estadoPago]}
                </span>
              </header>
              <div className="registro-resumen">
                <p>
                  {p.productos.reduce((s, p) => s + p.cantidad, 0)} unidades ·{' '}
                  {p.entrega === 'RETIRO'
                    ? 'Retiro en tienda'
                    : 'Despacho a domicilio'}
                </p>
                <strong>{moneda(p.total)}</strong>
              </div>
              <p>
                {metodoPago(p.metodo)}
                {p.saldoPendiente > 0
                  ? ` · Saldo: ${moneda(p.saldoPendiente)}`
                  : ''}
              </p>
              <details>
                <summary>Ver detalle de la compra</summary>
                <ResumenCompra productos={p.productos} titulo="Materiales" />
                <p>
                  {p.direccion} · {p.telefono}
                </p>
              </details>
              <div className="acciones">
                {p.estado !== 'CANCELADO' &&
                  p.estadoPago === 'PENDIENTE' &&
                  p.metodo === 'TRANSFERENCIA' && (
                    <Link className="boton-reserva" to={`/pago?pedido=${p.id}`}>
                      Completar pago
                    </Link>
                  )}
                {p.estado === 'CONFIRMADO' &&
                  p.estadoPago === 'PENDIENTE' &&
                  (p.metodo !== 'CUENTA_CORRIENTE' ||
                    p.saldoPendiente === p.total) && (
                    <button
                      className="enlace-boton"
                      onClick={() =>
                        setConfirmar({
                          tipo: 'pedido',
                          id: p.id,
                          numero: p.numero,
                        })
                      }
                    >
                      Cancelar pedido
                    </button>
                  )}
                <Link to={`/confirmacion/compra/${p.id}`}>Ver comprobante</Link>
              </div>
            </article>
          ))}
        </div>
      )}
      {seccion === 'reservas' && (
        <div>
          <h3>Mis reservas</h3>
          {!reservas.length && (
            <div className="estado-vacio">
              <h4>Todavía no tienes reservas</h4>
              <Link className="boton-reserva" to="/reservar">
                Hacer una reserva
              </Link>
            </div>
          )}
          {reservas.map((r) => (
            <article className="registro-cuenta" key={r.id}>
              <header>
                <div>
                  <strong>{r.numero}</strong>
                  <span>{fechaHora(r.fecha)}</span>
                </div>
                <span
                  className={`estado ${r.estado === 'ACTIVA' ? 'positivo' : 'neutro'}`}
                >
                  {nombres[r.estado]}
                </span>
              </header>
              <div className="registro-resumen">
                <p>
                  {r.productos
                    .map((p) => `${p.cantidad} × ${p.nombre}`)
                    .join(' · ')}
                </p>
                <strong>{moneda(r.total)}</strong>
              </div>
              <p>
                {r.estado === 'ACTIVA'
                  ? `Retira o paga antes del ${fechaHora(r.vence)}.`
                  : r.estado === 'COMPRADA'
                    ? 'Esta reserva ya se convirtió en una compra.'
                    : 'Los materiales de esta reserva ya fueron liberados.'}
              </p>
              <div className="acciones">
                {r.estado === 'ACTIVA' && (
                  <>
                    <Link
                      className="boton-reserva"
                      to={`/pago?reserva=${r.id}`}
                    >
                      Pagar reserva
                    </Link>
                    <button
                      className="enlace-boton"
                      onClick={() =>
                        setConfirmar({
                          tipo: 'reserva',
                          id: r.id,
                          numero: r.numero,
                        })
                      }
                    >
                      Cancelar reserva
                    </button>
                  </>
                )}
                <Link
                  to={
                    r.pedidoId
                      ? `/confirmacion/compra/${r.pedidoId}`
                      : `/confirmacion/reserva/${r.id}`
                  }
                >
                  Ver comprobante
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
      {seccion === 'movimientos' && (
        <>
          <div className="indicadores-cuenta">
            <div>
              <span>Cupo de crédito</span>
              <strong>{moneda(usuario.lineaCredito)}</strong>
            </div>
            <div>
              <span>Saldo utilizado</span>
              <strong>{moneda(saldo)}</strong>
            </div>
            <div>
              <span>Crédito disponible</span>
              <strong>{moneda(usuario.lineaCredito - saldo)}</strong>
            </div>
          </div>
          <p>
            Próximo cierre: {cierre}.
          </p>
          <div className="cuenta-resumen">
            <section className="panel-proceso">
              <h3>Movimientos</h3>
              {!movimientos.length ? (
                <p>Aún no hay cargos ni abonos en tu cuenta.</p>
              ) : (
                <ul className="lista-movimientos">
                  {movimientos.map((m) => (
                    <li key={m.id}>
                      <div>
                        <strong>{m.detalle}</strong>
                        <span>{fechaHora(m.fecha)}</span>
                      </div>
                      <strong className={m.monto < 0 ? 'texto-positivo' : ''}>
                        {m.monto < 0 ? '−' : '+'}
                        {moneda(Math.abs(m.monto))}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="panel-proceso">
              <h3>Abonar a mi cuenta</h3>
              {saldo > 0 ? (
                <form onSubmit={pagarAbono}>
                  <fieldset disabled={enviando}>
                    <div className="grupo-formulario">
                      <label htmlFor="monto-abono">Monto del abono (CLP)</label>
                      <input
                        id="monto-abono"
                        type="number"
                        min={1}
                        max={saldo}
                        step={1}
                        required
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                      />
                    </div>
                    <PagoPrueba
                      resultado={resultado}
                      onCambiar={setResultado}
                      nombre="resultado-abono"
                    />
                    <button className="boton-enviar" disabled={enviando}>
                      {enviando ? 'Procesando…' : 'Pagar abono'}
                    </button>
                  </fieldset>
                </form>
              ) : (
                <p className="cuenta-al-dia">
                  Tu cuenta está al día. No tienes saldo pendiente.
                </p>
              )}
            </section>
          </div>
        </>
      )}
    </section>
  );
};
