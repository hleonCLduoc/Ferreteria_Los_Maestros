import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, redirect } from "react-router-dom";
import { ProveedorCarrito } from "./context/ContextoCarrito";
import { ProductCard } from "./components/ProductCard";
import { Navbar } from "./components/Navbar";

const productoDisponible = {
  id: "MC001",
  nombre: "Cemento Polpaico 25 kg",
  precio: "$5.990",
  stock: 80,
  disponible: true,
  imagen: "/assets/img/cemento.jpg",
};

const productoAgotado = {
  id: "MC002",
  nombre: "Martillo Carpintero",
  precio: "$7.990",
  stock: 0,
  disponible: false,
  imagen: "/assets/img/martillo.jpg",
};

describe("Pruebas de Renderizado", () => {
  it("Test 1: Renderiza el nombre y precio del producto en ProductCard", () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>,
    );

    expect(screen.getByText("Cemento Polpaico 25 kg")).toBeTruthy();
    expect(screen.getByText("$5.990")).toBeTruthy();
  });

  it("Test 2: Renderiza los enlaces principales en Navbar", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText("Inicio")).toBeTruthy();
    expect(screen.getByText(/Cat/i)).toBeTruthy();
    expect(screen.getByText("Reservar")).toBeTruthy();
  });
});

describe("Pruebas de Renderizado Condicional", () => {
  it("Test 3: Muestra el botón habilitado cuando hay stock disponible", () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>,
    );

    const boton = screen.getByRole("button", { name: "Agregar al carrito" });
    expect(boton.disabled).toBe(false);
  });

  it("Test 4: Muestra el estado Agotado y deshabilita el boton cuando no hay stock", () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoAgotado} />
      </ProveedorCarrito>,
    );
    expect(screen.getByText(/Agotado/i)).toBeTruthy();
    const botonAgotado = screen.getByRole("button", { name: /sin stock/i });
    expect(botonAgotado.disabled).toBe(true);
  });
});

//3. pruebas de propiedades / 2 test

describe('Pruebas de propiedades (props)', () =>{
    it('Test 5: ProductCard recibe y muestra la cantidad de stock correcta via props',()=>{
        render(
            <ProveedorCarrito>
                <ProductCard{...productoDisponible}/>

            </ProveedorCarrito>
        );
        expect(screen.getAllByText('Stock: 80 unidades')).toBeTruthy();
    });
})

it('Test 6 : ProductCard asigna la ruta e imagenes pasadas por props', ()=>{
    render(
        <ProveedorCarrito>
            <ProductCard{...productoDisponible}/>
        </ProveedorCarrito>
    );
    const imagen = screen.getByRole('img');
    expect(imagen.getAttribute('src ')).toBe('/assets/img/cemento.jpg');
    expect(imagen.getAttribute('alt ')).toBe('Cemento Polpaico 25 kg');
    }); 
});

// 4. Pruebas de estado y eventos(4 test)

describe('Pruebas de estado y eventos', ()=>

it('Test 7 : Actualiza el estado del input de correo al escribir en el login ', ()=> {
    render(
        <ProveedorAut></ProveedorAut>
    )
}

)

)