export const Buscador = ({busqueda, setBusqueda, categoria, setCategoria, categorias}) => {
    return (
        <div className="filtros-contenedor">
            <input type="text"
            placeholder="Buscar productos..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            />
        <select value={categoria} onChange={(e)=>setCategoria(e.target.value)}>
            {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
            ) )}
        </select>
        </div>
    );
};
