import { moneda } from '../services/almacenamiento';
export function ResumenCompra({ productos, titulo = 'Resumen de tu compra' }) {
  const total = productos.reduce(
    (sum, p) => sum + p.precioNumero * p.cantidad,
    0,
  );
  return (
    <aside className="resumen-compra">
      <h3>{titulo}</h3>
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            <img src={p.imagen} alt="" />
            <div>
              <strong>{p.nombre}</strong>
              <span>
                {p.cantidad} × {moneda(p.precioNumero)}
              </span>
            </div>
            <strong>{moneda(p.precioNumero * p.cantidad)}</strong>
          </li>
        ))}
      </ul>
      <div className="total-compra">
        <span>Total</span>
        <strong>{moneda(total)}</strong>
      </div>
    </aside>
  );
}
