import { useState } from 'react';
import { useAut } from '../context/auth';
import { productos } from '../data/productos';
import { rutValido } from '../services/validaciones';
export const Reservar = () => {
  const { usuario } = useAut();
  const [form, setForm] = useState({
    nombre: usuario.razonSocial,
    rut: usuario.rut,
    telefono: '',
    producto: 'MC001',
    cantidad: 1,
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const seleccionado = productos.find((p) => p.id === form.producto);
  const enviar = (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!form.nombre.trim() || !rutValido(form.rut)) {
      setError('Revisa el nombre y RUT.');
      return;
    }
    const cantidad = Number(form.cantidad);
    if (
      !seleccionado?.disponible ||
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > seleccionado.stock
    ) {
      setError('La cantidad debe estar dentro del stock disponible.');
      return;
    }
    setMensaje(
      `Reserva de demostración: ${cantidad} unidades de ${seleccionado.nombre} para ${form.nombre}. No se envió una reserva a la tienda.`,
    );
  };
  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <section className="extracto">
      <h2>Reserva de Materiales en Línea</h2>
      <p>Formulario de demostración de reserva de materiales.</p>
      <form className="formulario-contenedor" onSubmit={enviar}>
        {error && (
          <p role="alert" className="mensaje error">
            {error}
          </p>
        )}
        {mensaje && (
          <p role="status" className="mensaje">
            {mensaje}
          </p>
        )}
        <div className="grupo-formulario">
          <label htmlFor="reserva-nombre">Nombre completo / Razón social</label>
          <input
            id="reserva-nombre"
            name="nombre"
            required
            value={form.nombre}
            onChange={cambiar}
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="reserva-rut">RUT</label>
          <input
            id="reserva-rut"
            name="rut"
            required
            value={form.rut}
            onChange={cambiar}
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="reserva-telefono">Teléfono de contacto</label>
          <input
            id="reserva-telefono"
            name="telefono"
            type="tel"
            required
            minLength={8}
            maxLength={30}
            value={form.telefono}
            onChange={cambiar}
          />
        </div>
        <div className="grupo-formulario">
          <label htmlFor="reserva-producto">Producto a reservar</label>
          <select
            id="reserva-producto"
            name="producto"
            value={form.producto}
            onChange={cambiar}
          >
            {productos
              .filter((p) => p.disponible && p.stock > 0)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
          </select>
          <p>Stock disponible: {seleccionado?.stock ?? 0}</p>
        </div>
        <div className="grupo-formulario">
          <label htmlFor="reserva-cantidad">Cantidad</label>
          <input
            id="reserva-cantidad"
            name="cantidad"
            type="number"
            required
            min={1}
            max={seleccionado?.stock ?? 0}
            step={1}
            value={form.cantidad}
            onChange={cambiar}
          />
        </div>
        <button type="submit" className="boton-enviar">
          Confirmar reserva de prueba
        </button>
      </form>
    </section>
  );
};
