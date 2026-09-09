# Ferretería Los Maestros - Sistema de Gestión Web

Este proyecto corresponde a la primera etapa del sistema web para **Ferretería Los Maestros**, un negocio familiar de La Serena con 22 años de trayectoria. La solución abarca la maquetación del frontend estático interactivo y el diseño de la base de datos relacional para optimizar la consulta de inventario, reservas y cuentas corrientes de contratistas.

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico**: Estructuración limpia mediante etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- **CSS3 Responsivo**: Diseño adaptable mediante el modelo de cajas, Flexbox y Media Queries.
- **JavaScript (Vanilla)**: Menú de navegación dinámico inyectado en el DOM y validación de formularios de reserva en el cliente.
- **Oracle SQL**: Modelo relacional normalizado en Tercera Forma Normal (3FN) con triggers automáticos.

## 📁 Estructura del Repositorio

```text
ferreteria-los-maestros/
├── index.html                  # Catálogo de productos y presentación
├── reservar.html               # Formulario de reserva de materiales
├── cuentas.html                # Vista de cuenta corriente y saldos
├── assets/
│   ├── css/
│   │   └── style.css           # Hoja de estilos general y responsiva
│   ├── js/
│   │   └── funciones.js        # Inyección dinámica de navbar y validaciones
│   └── img/                    # Logotipo y fotos de productos locales
├── modelo_oracle_ferreteria.sql # Script DDL para la base de datos Oracle
└── README.md                   # Documentación del proyecto
🚀 Instrucciones de Ejecución
Visualizar Frontend: Clonar o descargar la carpeta y abrir el archivo index.html en cualquier navegador web.
Navegación: Utilizar el menú superior generado por JavaScript para navegar entre las vistas.
Base de Datos: Cargar y ejecutar el script modelo_oracle_ferreteria.sql en Oracle SQL Developer, DBeaver u Oracle APEX.
👥 Créditos y Contexto
Asignatura: DSY1104 - Desarrollo Full Stack II
Institución: Duoc UC
Año: 2026

---
