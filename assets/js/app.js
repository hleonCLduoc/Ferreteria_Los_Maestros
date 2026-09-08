document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el contenedor donde queremos que vaya el menú
    const placeholder = document.getElementById("navbar-placeholder");
    
    if (placeholder) {
        placeholder.innerHTML = `
            <nav>
                <a href="index.html">Inicio</a> | 
                <a href="#">Catálogo y Stock</a> | 

                <a href="reservar.html">Reservar Materiales</a> | 
                <a href="#">Mi Cuenta Corriente</a>
            </nav>
        `;
    }
});