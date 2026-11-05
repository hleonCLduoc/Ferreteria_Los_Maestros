import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAut } from '../context/auth';
import { useCompras } from '../context/compras';
import { moneda, fechaHora } from '../services/almacenamiento';
export const AdminHome = () => {
  const { usuario, clientes, actualizarCuenta, cerrarSesion } = useAut();
  const { consultarCliente } = useCompras();
  const [busqueda, setBusqueda] = useState(''),
    [edicion, setEdicion] = useState(null),
    [error, setError] = useState(''),
    [mensaje, setMensaje] = useState('');
  if (usuario?.rol !== 'ADMIN')
    return (
      <section className="extracto">
        <h2>Acceso restringido</h2>
        <Link to="/cuentas">Volver a mi cuenta</Link>
      </section>
    );
  const cuentas = clientes.map((c) => ({ ...c, ...consultarCliente(c.id) }));
  const seleccionado = cuentas.find((c) => c.id === edicion?.id);
  const filtradas = cuentas.filter((c) =>
    `${c.razonSocial} ${c.email} ${c.rut}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );
  const elegir = (c) => {
    setEdicion({
      id: c.id,
      lineaCredito: String(c.lineaCredito),
      activo: c.activo,
    });
    setError('');
    setMensaje('');
  };
  const guardar = (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      actualizarCuenta(edicion.id, {
        lineaCredito: Number(edicion.lineaCredito),
        activo: edicion.activo,
      });
      setMensaje(
        `Cuenta de ${seleccionado.razonSocial} actualizada.`,
      );
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <section>
      <div className="encabezado-pagina cabecera-cuenta">
        <div>
          <span className="etiqueta-seccion">Mi cuenta · Administrador</span>
          <h2>Administrar cuentas</h2>
        </div>
        <div className="acciones-cuenta">
          <Link className="boton-secundario" to="/productos">
            Ver tienda
          </Link>
          <button className="boton-secundario" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="indicadores-cuenta">
        <div>
          <span>Clientes registrados</span>
          <strong>{cuentas.length}</strong>
        </div>
        <div>
          <span>Cupos activos</span>
          <strong>
            {moneda(
              cuentas
                .filter((c) => c.activo)
                .reduce((s, c) => s + c.lineaCredito, 0),
            )}
          </strong>
        </div>
        <div>
          <span>Saldo total utilizado</span>
          <strong>{moneda(cuentas.reduce((s, c) => s + c.saldo, 0))}</strong>
        </div>
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
      <section className="panel-proceso">
        <div className="grupo-formulario">
          <label htmlFor="buscar-cuentas">
            Buscar cliente por nombre, correo o RUT
          </label>
          <input
            id="buscar-cuentas"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cliente…"
          />
        </div>
        <div className="tabla-cuentas">
          <table>
            <caption>Clientes</caption>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Cupo aprobado</th>
                <th>Saldo utilizado</th>
                <th>Disponible</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.razonSocial}</strong>
                    <small>{c.email}</small>
                    <small>{c.rut}</small>
                  </td>
                  <td>{moneda(c.lineaCredito)}</td>
                  <td>{moneda(c.saldo)}</td>
                  <td>{moneda(c.lineaCredito - c.saldo)}</td>
                  <td>
                    <span
                      className={`estado ${c.activo ? 'positivo' : 'neutro'}`}
                    >
                      {c.activo ? 'Activa' : 'Desactivada'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="boton-secundario"
                      aria-label={`Gestionar cuenta de ${c.razonSocial}`}
                      onClick={() => elegir(c)}
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtradas.length && (
          <p>No hay clientes que coincidan con la búsqueda.</p>
        )}
      </section>
      {seleccionado ? (
        <div className="cuenta-resumen">
          <form className="panel-proceso" onSubmit={guardar}>
            <h3>Cuenta de {seleccionado.razonSocial}</h3>
            <p>
              {seleccionado.email} · {seleccionado.rut}
            </p>
            <div className="grupo-formulario">
              <label htmlFor="cupo-cliente">Cupo de crédito (CLP)</label>
              <input
                id="cupo-cliente"
                type="number"
                min={seleccionado.saldo}
                max={100000000}
                step={1}
                required
                value={edicion.lineaCredito}
                onChange={(e) =>
                  setEdicion({ ...edicion, lineaCredito: e.target.value })
                }
              />
              <small>
                El cupo no puede ser menor al saldo utilizado:{' '}
                {moneda(seleccionado.saldo)}.
              </small>
            </div>
            <label className="opcion-check">
              <input
                type="checkbox"
                checked={edicion.activo}
                onChange={(e) =>
                  setEdicion({ ...edicion, activo: e.target.checked })
                }
              />{' '}
              Cuenta activa
            </label>
            <button className="boton-enviar">Guardar cambios</button>
          </form>
          <section className="panel-proceso">
            <h3>Actividad del cliente</h3>
            <p>
              {seleccionado.pedidos.length} compras ·{' '}
              {
                seleccionado.reservas.filter((r) => r.estado === 'ACTIVA')
                  .length
              }{' '}
              reservas activas.
            </p>
            <h4 className="subtitulo-actividad">Compras</h4>
            {seleccionado.pedidos.length ? (
              <ul className="lista-movimientos">
                {seleccionado.pedidos.map((p) => (
                  <li key={p.id}>
                    <div>
                      <strong>{p.numero}</strong>
                      <span>
                        {fechaHora(p.fecha)} ·{' '}
                        {p.estado === 'CANCELADO'
                          ? 'Cancelado'
                          : p.estadoPago === 'PAGADO'
                            ? 'Pagado'
                            : 'Pendiente de pago'}
                      </span>
                    </div>
                    <strong>{moneda(p.total)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Este cliente aún no tiene compras.</p>
            )}
            <h4 className="subtitulo-actividad">Reservas</h4>
            {seleccionado.reservas.length ? (
              <ul className="lista-movimientos">
                {seleccionado.reservas.map((reserva) => (
                  <li key={reserva.id}>
                    <div>
                      <strong>{reserva.numero}</strong>
                      <span>
                        {reserva.estado === 'ACTIVA'
                          ? 'Activa'
                          : reserva.estado === 'COMPRADA'
                            ? 'Convertida en compra'
                            : reserva.estado === 'VENCIDA'
                              ? 'Vencida'
                              : 'Cancelada'}
                      </span>
                    </div>
                    <strong>{moneda(reserva.total)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tiene reservas registradas.</p>
            )}
          </section>
        </div>
      ) : (
        <p className="ayuda-admin">
          Selecciona un cliente.
        </p>
      )}
    </section>
  );
};
