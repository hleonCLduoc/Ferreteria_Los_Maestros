document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formReserva");

    if (form) {
        form.addEventListener("submit", (e) => {
            // Evitar que la página se recargue automáticamente
            e.preventDefault();

            // Obtener los valores de los campos
            const nombre = document.getElementById("nombre").value.trim();
            const rut = document.getElementById("rut").value.trim();
            const producto = document.getElementById("producto").value;
            const cantidad = document.getElementById("cantidad").value;

            // Validación básica para verificar que no haya campos vacíos
            if (nombre === "" || rut === "" || producto === "" || cantidad === "") {
                alert("Por favor, complete todos los campos obligatorios.");
                return;
            }

            // Simulación de éxito de la reserva
            alert(`¡Reserva Exitosa!\n\nEstimado(a) ${nombre}, hemos reservado ${cantidad} unidades de su producto. Recuerde retirar en nuestro mesón de La Serena dentro de las próximas 2 horas.`);
            
            // Limpiar el formulario
            form.reset();
        });
    }
});
