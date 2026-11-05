import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAut } from '../context/auth';
import { useCarrito } from '../context/carrito';
import { useProductos } from '../context/productos';
import { useCompras } from '../context/compras';
import { ResumenCompra } from '../components/ResumenCompra';
export const Reservar = () => {
  const { usuario } = useAut();
  const { productos } = useProductos();
  const { carrito, vaciarCarrito } = useCarrito();
  const { crearReserva } = useCompras();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const desdeCarrito = params.get('carrito') === '1';
  const [productoId, setProductoId] = useState(
    params.get('producto') ||
      productos.find((p) => p.id === 'MC001' && p.stock > 0)?.id ||
      productos.find((p) => p.stock > 0)?.id ||
      '',
  );
  const [cantidad, setCantidad] = useState(1),
    [telefono, setTelefono] = useState(''),
    [error, setError] = useState('');
  const enviando = useRef(false);
  const seleccionado = productos.find((p) => p.id === productoId);
  const lineas = desdeCarrito
    ? carrito
    : seleccionado
      ? [{ ...seleccionado, cantidad: Number(cantidad) || 1 }]
      : [];
  const enviar = (e) => {
    e.preventDefault();
    if (enviando.current) return;
    enviando.current = true;
    setError('');
    try {
      const reserva = crearReserva({ productos: lineas, telefono });
      if (desdeCarrito) vaciarCarrito();
      navigate(`/confirmacion/reserva/${reserva.id}`, { replace: true });
    } catch (e) {
      setError(e.message);
      enviando.current = false;
    }
  };
  return (
    <section>
      <div className="encabezado-pagina">
        <h2>Reserva tus materiales</h2>
        <p>
          Reserva por 24 horas.
        </p>
      </div>
      <div className="compra-layout">
        <form className="panel-proceso" onSubmit={enviar}>
          <h3>
            {desdeCarrito
              ? 'Reservar los materiales del carrito'
              : 'Materiales'}
          </h3>
          <p className="cliente-reserva">
            Reserva a nombre de <strong>{usuario.razonSocial}</strong> ·{' '}
            {usuario.rut}
          </p>
          {!desdeCarrito && (
            <>
              <div className="grupo-formulario">
                <label htmlFor="reserva-producto">Producto a reservar</label>
                <select
                  id="reserva-producto"
                  value={productoId}
                  onChange={(e) => {
                    setProductoId(e.target.value);
                    setCantidad(1);
                  }}
                >
                  {productos
                    .filter((p) => p.disponible && p.stock > 0)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grupo-formulario">
                <label htmlFor="reserva-cantidad">Cantidad</label>
                <input
                  id="reserva-cantidad"
                  type="number"
                  required
                  min={1}
                  max={seleccionado?.stock || 0}
                  step={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
                <small>Disponibles: {seleccionado?.stock || 0} unidades.</small>
              </div>
            </>
          )}
          <div className="grupo-formulario">
            <label htmlFor="reserva-telefono">Teléfono de contacto</label>
            <input
              id="reserva-telefono"
              type="tel"
              required
              minLength={8}
              maxLength={30}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              autoComplete="tel"
              placeholder="+56 9 1234 5678"
            />
          </div>
          <div className="informacion-retiro">
            <strong>Retiro en tienda</strong>
            <p>Av. Francisco de Aguirre #450, La Serena.</p>
          </div>
          {error && (
            <p role="alert" className="mensaje error">
              {error}
            </p>
          )}
          <button className="boton-enviar" disabled={!lineas.length}>
            Confirmar reserva · sin pago
          </button>
          <Link
            className="enlace-volver"
            to={desdeCarrito ? '/carrito' : '/productos'}
          >
            Volver al {desdeCarrito ? 'carrito' : 'catálogo'}
          </Link>
        </form>
        <ResumenCompra productos={lineas} titulo="Materiales a reservar" />
      </div>
    </section>
  );
};
