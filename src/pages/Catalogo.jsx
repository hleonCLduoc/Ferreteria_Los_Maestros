import { useCarrito } from '../context/ContextoCarrito';
import { ProductCard } from '../components/ProductCard';

export const Catalogo = () => {
  const { productos } = useCarrito();

  return (
    <main style={{ padding: '20px' }}>
      <section className="extracto">
        <h2>Catálogo de Productos</h2>
        <p>Selecciona los materiales y herramientas para tu proyecto. El stock se actualiza en tiempo real.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {productos.map((producto) => (
            <ProductCard key={producto.id} {...producto} />
          ))}
        </div>
      </section>
    </main>
  );
};