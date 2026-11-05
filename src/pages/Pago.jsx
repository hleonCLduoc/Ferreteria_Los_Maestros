import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAut } from '../context/auth';
import { useCarrito } from '../context/carrito';
import { useCompras } from '../context/compras';
import { moneda } from '../services/almacenamiento';
import { ResumenCompra } from '../components/ResumenCompra';
import { PagoPrueba } from '../components/PagoPrueba';
export function Pago() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { usuario } = useAut();
  const { carrito, vaciarCarrito } = useCarrito();
  const { pedidos, reservas, saldo, crearPedido, pagarPedido } = useCompras();
  const reservaId = params.get('reserva');
  const pedidoId = params.get('pedido');
  const reserva = reservas.find((r) => r.id === reservaId);
  const pendiente = pedidos.find((p) => p.id === pedidoId);
  const productos = pedidoId
    ? pendiente?.productos || []
    : reservaId
      ? reserva?.productos || []
      : carrito;
  const [paso, setPaso] = useState(pedidoId ? 2 : 1),
    [form, setForm] = useState({
      entrega: pendiente?.entrega || 'RETIRO',
      telefono: pendiente?.telefono || reserva?.telefono || '',
      direccion: pendiente?.direccion || '',
      comuna: pendiente?.comuna || 'La Serena',
    });
  const [metodo, setMetodo] = useState('TARJETA'),
    [resultado, setResultado] = useState('APROBADO'),
    [error, setError] = useState(''),
    [enviando, setEnviando] = useState(false);
  const clave = useRef(crypto.randomUUID());
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [paso]);
  const procesando = useRef(false);
  const total = productos.reduce((s, p) => s + p.precioNumero * p.cantidad, 0);
  const avanzar = (e) => {
    e.preventDefault();
    if (!/^[+0-9 ()-]{8,30}$/.test(form.telefono)) {
      setError('Revisa tu teléfono de contacto.');
      return;
    }
    if (
      form.entrega === 'DESPACHO' &&
      (!form.direccion.trim() || !form.comuna.trim())
    ) {
      setError('Completa la dirección y comuna de despacho.');
      return;
    }
    setError('');
    setPaso(2);
  };
  const pagar = async (e) => {
    e.preventDefault();
    if (procesando.current) return;
    procesando.current = true;
    setEnviando(true);
    setError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if ((pedidoId || metodo === 'TARJETA') && resultado === 'RECHAZADO')
        throw new Error(
          'Pago rechazado. Intenta nuevamente.',
        );
      if (pedidoId) {
        pagarPedido(pedidoId);
        navigate(`/confirmacion/compra/${pedidoId}`, { replace: true });
      } else {
        const pedido = crearPedido({
          productos,
          ...form,
          metodo,
          clave: clave.current,
          reservaId,
        });
        if (!reservaId) vaciarCarrito();
        navigate(`/confirmacion/compra/${pedido.id}`, { replace: true });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      procesando.current = false;
      setEnviando(false);
    }
  };
  if (
    !productos.length ||
    (reservaId && (!reserva || reserva.estado !== 'ACTIVA')) ||
    (pedidoId &&
      (!pendiente ||
        pendiente.estado === 'CANCELADO' ||
        pendiente.estadoPago !== 'PENDIENTE' ||
        pendiente.metodo !== 'TRANSFERENCIA'))
  )
    return (
      <section className="extracto">
        <h2>No hay una compra pendiente</h2>
        <p>Revisa tu carrito o consulta el estado en tu cuenta.</p>
        <div className="acciones">
          <Link to="/carrito">Ver carrito</Link>
          <Link to="/cuentas">Mi cuenta</Link>
        </div>
      </section>
    );
  return (
    <section className="proceso-compra">
      <div className="encabezado-pagina">
        <span className="etiqueta-seccion">
          {reservaId
            ? `Reserva ${reserva.numero}`
            : pedidoId
              ? `Pedido ${pendiente.numero}`
              : ''}
        </span>
        <h2>Finalizar compra</h2>
      </div>
      <ol className="pasos-compra" aria-label="Pasos de compra">
        <li
          className={paso === 1 ? 'actual' : 'completo'}
          aria-current={paso === 1 ? 'step' : undefined}
        >
          1. Entrega
        </li>
        <li
          className={paso === 2 ? 'actual' : ''}
          aria-current={paso === 2 ? 'step' : undefined}
        >
          2. Pago
        </li>
        <li>3. Confirmación</li>
      </ol>
      <div className="compra-layout">
        <div className="panel-proceso">
          {paso === 1 ? (
            <form onSubmit={avanzar}>
              <h3>¿Cómo recibirás tus materiales?</h3>
              <div className="opciones-entrega">
                <label
                  className={
                    form.entrega === 'RETIRO' ? 'opcion seleccionada' : 'opcion'
                  }
                >
                  <input
                    type="radio"
                    name="entrega"
                    checked={form.entrega === 'RETIRO'}
                    onChange={() => setForm({ ...form, entrega: 'RETIRO' })}
                  />
                  <strong>Retiro en tienda</strong>
                  <span>Av. Francisco de Aguirre #450, La Serena.</span>
                </label>
                <label
                  className={
                    form.entrega === 'DESPACHO'
                      ? 'opcion seleccionada'
                      : 'opcion'
                  }
                >
                  <input
                    type="radio"
                    name="entrega"
                    checked={form.entrega === 'DESPACHO'}
                    onChange={() => setForm({ ...form, entrega: 'DESPACHO' })}
                  />
                  <strong>Despacho a domicilio</strong>
                  <span>Sin costo</span>
                </label>
              </div>
              <div className="grupo-formulario">
                <label htmlFor="compra-telefono">Teléfono de contacto</label>
                <input
                  id="compra-telefono"
                  type="tel"
                  required
                  minLength={8}
                  maxLength={30}
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                  autoComplete="tel"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              {form.entrega === 'DESPACHO' && (
                <>
                  <div className="grupo-formulario">
                    <label htmlFor="compra-direccion">
                      Dirección de despacho
                    </label>
                    <input
                      id="compra-direccion"
                      required
                      maxLength={200}
                      autoComplete="street-address"
                      value={form.direccion}
                      onChange={(e) =>
                        setForm({ ...form, direccion: e.target.value })
                      }
                    />
                  </div>
                  <div className="grupo-formulario">
                    <label htmlFor="compra-comuna">Comuna</label>
                    <input
                      id="compra-comuna"
                      required
                      maxLength={100}
                      value={form.comuna}
                      onChange={(e) =>
                        setForm({ ...form, comuna: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
              {error && (
                <p className="mensaje error" role="alert">
                  {error}
                </p>
              )}
              <button className="boton-enviar">Continuar al pago</button>
              <Link
                className="enlace-volver"
                to={reservaId ? '/cuentas?seccion=reservas' : '/carrito'}
              >
                Volver
              </Link>
            </form>
          ) : (
            <form onSubmit={pagar}>
              <fieldset disabled={enviando}>
                <h3>
                  {pedidoId
                    ? 'Completar pago pendiente'
                    : 'Elige tu forma de pago'}
                </h3>
                <p className="entrega-resumida">
                  <strong>
                    {form.entrega === 'RETIRO'
                      ? 'Retiro en tienda'
                      : 'Despacho a domicilio'}
                  </strong>{' '}
                  ·{' '}
                  {form.entrega === 'RETIRO'
                    ? 'La Serena'
                    : `${form.direccion}, ${form.comuna}`}
                </p>
                {!pedidoId && (
                  <fieldset className="metodos-pago">
                    <legend>Forma de pago</legend>
                    {[
                      ['TARJETA', 'Tarjeta'],
                      ['TRANSFERENCIA', 'Transferencia'],
                      ['CUENTA_CORRIENTE', 'Cuenta corriente'],
                    ].map(([id, label]) => (
                      <label
                        className={
                          metodo === id ? 'opcion seleccionada' : 'opcion'
                        }
                        key={id}
                      >
                        <input
                          type="radio"
                          name="metodo"
                          checked={metodo === id}
                          onChange={() => {
                            setMetodo(id);
                            setError('');
                          }}
                        />
                        <strong>{label}</strong>
                      </label>
                    ))}
                  </fieldset>
                )}
                {(metodo === 'TARJETA' || pedidoId) && (
                  <PagoPrueba
                    resultado={resultado}
                    onCambiar={setResultado}
                    transferencia={!!pedidoId}
                  />
                )}
                {!pedidoId && metodo === 'TRANSFERENCIA' && (
                  <p className="mensaje">
                    Transferencia pendiente de confirmación.
                  </p>
                )}
                {!pedidoId && metodo === 'CUENTA_CORRIENTE' && (
                  <div className="mensaje">
                    <p>
                      Crédito disponible:{' '}
                      <strong>{moneda(usuario.lineaCredito - saldo)}</strong>
                    </p>
                  </div>
                )}
                {error && (
                  <p className="mensaje error" role="alert">
                    {error}
                  </p>
                )}
                <button
                  className="boton-enviar"
                  disabled={
                    enviando ||
                    (!pedidoId &&
                      metodo === 'CUENTA_CORRIENTE' &&
                      total > usuario.lineaCredito - saldo)
                  }
                >
                  {enviando
                    ? 'Procesando pago…'
                    : pedidoId
                      ? `Confirmar pago · ${moneda(total)}`
                      : metodo === 'TRANSFERENCIA'
                        ? 'Confirmar pedido pendiente de pago'
                        : metodo === 'CUENTA_CORRIENTE'
                          ? `Comprar a cuenta · ${moneda(total)}`
                          : `Pagar · ${moneda(total)}`}
                </button>
                {!pedidoId && (
                  <button
                    className="enlace-boton"
                    type="button"
                    disabled={enviando}
                    onClick={() => {
                      setPaso(1);
                      setError('');
                    }}
                  >
                    Volver a entrega
                  </button>
                )}
              </fieldset>
            </form>
          )}
        </div>
        <ResumenCompra productos={productos} />
      </div>
    </section>
  );
}
