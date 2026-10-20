import { useState } from 'react';
import { productos as listaProductos } from '../data/productos';

export const Reservar = () => {
  const [productosData, setProductosData] = useState(listaProductos);

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    sucursal: 'La Serena - Av. Balmaceda 1450',
  });

  const [itemsReservados, setItemsReservados] = useState([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
  const [cantidadInput, setCantidadInput] = useState(1);

  const [errores, setErrores] = useState({});

  const productoActual = productosData.find((p) => p.id === Number(productoSeleccionadoId));

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const handleAgregarProducto = () => {
    const errorProd = {};

    if (!productoSeleccionadoId) {
      errorProd.producto = 'Selecciona un producto.';
    }

    const cant = Number(cantidadInput);
    if (!cantidadInput || cant < 1) {
      errorProd.cantidad = 'La cantidad debe ser al menos 1.';
    } else if (productoActual && cant > productoActual.stock) {
      errorProd.cantidad = `Stock insuficiente. Disponible: ${productoActual.stock}`;
    }

    if (Object.keys(errorProd).length > 0) {
      setErrores({ ...errores, ...errorProd });
      return;
    }

    const existe = itemsReservados.find((item) => item.id === productoActual.id);

    if (existe) {
      if (existe.cantidad + cant > productoActual.stock) {
        setErrores({ ...errores, cantidad: `Excede el stock total disponible (${productoActual.stock})` });
        return;
      }
      setItemsReservados(
        itemsReservados.map((item) =>
          item.id === productoActual.id ? { ...item, cantidad: item.cantidad + cant } : item
        )
      );
    } else {
      setItemsReservados([
        ...itemsReservados,
        {
          id: productoActual.id,
          nombre: productoActual.nombre,
          precioNumero: productoActual.precioNumero,
          cantidad: cant,
          stockMaximo: productoActual.stock,
        },
      ]);
    }

    setProductoSeleccionadoId('');
    setCantidadInput(1);
    setErrores({ ...errores, producto: '', cantidad: '' });
  };

  const handleEliminarItem = (id) => {
    setItemsReservados(itemsReservados.filter((item) => item.id !== id));
  };

  const validarFormularioGlobal = () => {
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

    if (itemsReservados.length === 0) {
      nuevosErrores.lista = 'Debes agregar al menos un producto a la lista de reserva.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormularioGlobal()) return;

    const codigoReserva = 'RES-' + Math.floor(100000 + Math.random() * 900000);

    setProductosData((prevProductos) =>
      prevProductos.map((prod) => {
        const reservado = itemsReservados.find((item) => item.id === prod.id);
        if (reservado) {
          const nuevoStock = prod.stock - reservado.cantidad;
          return {
            ...prod,
            stock: nuevoStock,
            disponible: nuevoStock > 0,
          };
        }
        return prod;
      })
    );

    const resumenProductos = itemsReservados
      .map((item) => `- ${item.nombre} (x${item.cantidad})`)
      .join('\n');

    const totalEstimado = itemsReservados.reduce(
      (acc, item) => acc + item.precioNumero * item.cantidad,
      0
    );

    alert(
      `¡RESERVA REALIZADA CON ÉXITO!\n\n` +
        `Código de Reserva: ${codigoReserva}\n` +
        `Cliente: ${formData.nombre} (${formData.rut})\n` +
        `Sucursal de Retiro: ${formData.sucursal}\n\n` +
        `Productos Reservados (Stock Descontado):\n${resumenProductos}\n\n` +
        `Monto Total Estimado a Pagar en Caja: $${totalEstimado.toLocaleString('es-CL')} CLP\n\n` +
        `Dispones de 48 horas para retirar tu pedido presencialmente.`
    );

    setFormData({
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      sucursal: 'La Serena - Av. Balmaceda 1450',
    });
    setItemsReservados([]);
    setErrores({});
  };

  return (
    <main>
      <section className="extracto">
        <h2>Reserva de Materiales (Retiro Presencial)</h2>
        <p>Aparta múltiples productos del catálogo para asegurar tu stock antes de retirar y pagar en tienda.</p>

        <div className="formulario-contenedor" style={{ maxWidth: '650px', margin: '30px auto', textAlign: 'left' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '6px', marginBottom: '25px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>1. Agregar Productos a la Reserva</h3>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '2', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Catálogo completo:</label>
                <select
                  value={productoSeleccionadoId}
                  onChange={(e) => setProductoSeleccionadoId(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: errores.producto ? '#dc2626' : '#ccc' }}
                >
                  <option value="">-- Selecciona un producto --</option>
                  {productosData.map((prod) => (
                    <option key={prod.id} value={prod.id} disabled={prod.stock <= 0}>
                      {prod.nombre} - ${prod.precioNumero.toLocaleString('es-CL')} (Stock: {prod.stock})
                    </option>
                  ))}
                </select>
                {errores.producto && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{errores.producto}</span>}
              </div>

              <div style={{ flex: '1', minWidth: '100px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={cantidadInput}
                  onChange={(e) => setCantidadInput(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: errores.cantidad ? '#dc2626' : '#ccc' }}
                />
                {errores.cantidad && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{errores.cantidad}</span>}
              </div>

              <button
                type="button"
                onClick={handleAgregarProducto}
                className="boton-enviar"
                style={{ marginTop: '22px', padding: '8px 16px' }}
              >
                Agregar
              </button>
            </div>

            {itemsReservados.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ marginBottom: '8px' }}>Productos a reservar:</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {itemsReservados.map((item) => (
                    <li key={item.id} style={{ marginBottom: '6px' }}>
                      <strong>{item.nombre}</strong> x{item.cantidad} - ${(item.precioNumero * item.cantidad).toLocaleString('es-CL')}{' '}
                      <button
                        type="button"
                        onClick={() => handleEliminarItem(item.id)}
                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px' }}
                      >
                        [Quitar]
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errores.lista && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '10px' }}>{errores.lista}</p>}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <h3>2. Datos para el Retiro en Tienda</h3>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleFormChange}
                placeholder="Ej. Pedro Pascal"
                style={{ width: '100%', padding: '8px', borderColor: errores.nombre ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.nombre && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.nombre}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label htmlFor="rut" style={{ display: 'block', marginBottom: '5px' }}>RUT:</label>
              <input
                type="text"
                id="rut"
                name="rut"
                value={formData.rut}
                onChange={handleFormChange}
                placeholder="12.345.678-9"
                style={{ width: '100%', padding: '8px', borderColor: errores.rut ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.rut && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.rut}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="correo@ejemplo.com"
                style={{ width: '100%', padding: '8px', borderColor: errores.email ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.email && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.email}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px' }}>
              <label htmlFor="telefono" style={{ display: 'block', marginBottom: '5px' }}>Teléfono de Contacto:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleFormChange}
                placeholder="+56 9 1234 5678"
                style={{ width: '100%', padding: '8px', borderColor: errores.telefono ? '#dc2626' : '#ccc', borderRadius: '4px' }}
              />
              {errores.telefono && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errores.telefono}</span>}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '20px' }}>
              <label htmlFor="sucursal" style={{ display: 'block', marginBottom: '5px' }}>Sucursal para Retiro:</label>
              <select
                id="sucursal"
                name="sucursal"
                value={formData.sucursal}
                onChange={handleFormChange}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
              >
                <option value="La Serena - Av. Balmaceda 1450">La Serena - Av. Balmaceda 1450</option>
                <option value="Coquimbo - Ruta 5 Norte #300">Coquimbo - Ruta 5 Norte #300</option>
              </select>
            </div>

            <button type="submit" className="boton-enviar" style={{ width: '100%', padding: '12px' }}>
              Confirmar Reserva Presencial
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};