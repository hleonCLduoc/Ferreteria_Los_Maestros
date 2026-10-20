import { useState } from 'react';
import { useCarrito } from '../context/ContextoCarrito';
import { Link } from 'react-router-dom';

export const Carrito = () => {
  const { carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, precioTotal } = useCarrito();

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const handleRetractarse = () => {
    if (window.confirm('¿Estás seguro de cancelar tu compra? Los productos volverán al stock del catálogo.')) {
      vaciarCarrito(true);
      alert('Se ha cancelado la orden y el stock de los productos ha sido devuelto al catálogo.');
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    }

    if (!formData.rut.trim()) {
      nuevosErrores.rut = 'El RUT es obligatorio.';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono de contacto es obligatorio.';
    }

    if (!formData.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección de despacho es obligatoria.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const ordenId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    alert(
      `¡COMPRA REALIZADA CON ÉXITO!\n\n` +
        `Número de Orden: ${ordenId}\n` +
        `Cliente: ${formData.nombre} (${formData.rut})\n` +
        `Dirección de envío: ${formData.direccion}\n` +
        `Total Pagado: $${precioTotal.toLocaleString('es-CL')} CLP`
    );

    vaciarCarrito(false);
    setFormData({
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      direccion: '',
    });
    setErrores({});
  };

  if (carrito.length === 0) {
    return (
      <main style={{ padding: '40px', textAlign: 'center' }}>
        <section className="extracto">
          <h2>Tu Carrito de Compras está vacío</h2>
          <p>Explora nuestro catálogo para agregar productos.</p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/productos" className="boton-reserva">
              Ver Productos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ padding: '20px' }}>
      <section className="extracto">
        <h2>Carrito de Compras</h2>

        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '10px' }}>Producto</th>
                <th style={{ padding: '10px' }}>Precio</th>
                <th style={{ padding: '10px' }}>Cantidad</th>
                <th style={{ padding: '10px' }}>Subtotal</th>
                <th style={{ padding: '10px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.imagen} alt={item.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    <span>{item.nombre}</span>
                  </td>
                  <td style={{ padding: '10px' }}>${item.precioNumero.toLocaleString('es-CL')}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button onClick={() => actualizarCantidad(item.id, -1)} style={{ padding: '2px 8px' }}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => actualizarCantidad(item.id, 1)} style={{ padding: '2px 8px' }}>+</button>
                    </div>
                  </td>
                  <td style={{ padding: '10px' }}>${(item.precioNumero * item.cantidad).toLocaleString('es-CL')}</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => eliminarDelCarrito(item.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Quitar (Devolver Stock)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <button
            onClick={handleRetractarse}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Retractarse / Vaciar Carrito (Restaurar Stock)
          </button>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            Total: ${precioTotal.toLocaleString('es-CL')} CLP
          </div>
        </div>

        <div className="formulario-contenedor" style={{ maxWidth: '500px', margin: '30px auto', textAlign: 'left' }}>
          <h3>Datos para el Despacho y Pago</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                style={{ width: '100%', padding: '8px', borderColor: errores.nombre ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.nombre && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.nombre}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>RUT:</label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="12.345.678-9"
                style={{ width: '100%', padding: '8px', borderColor: errores.rut ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.rut && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.rut}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                style={{ width: '100%', padding: '8px', borderColor: errores.email ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.email && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.email}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Teléfono:</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
                style={{ width: '100%', padding: '8px', borderColor: errores.telefono ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.telefono && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.telefono}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Dirección de Despacho:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle, número, comuna"
                style={{ width: '100%', padding: '8px', borderColor: errores.direccion ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.direccion && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.direccion}</span>}
            </div>

            <button type="submit" className="boton-enviar" style={{ width: '100%', padding: '12px' }}>
              Finalizar Compra
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};