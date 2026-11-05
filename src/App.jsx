import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorCompras } from './context/ContextoCompras';
import { Pago } from './pages/Pago';
import { Confirmacion } from './pages/Confirmacion';
import { VolverArriba } from './components/VolverArriba';
import { ProveedorAut } from './context/ContextoAutenticacion';
import { ProveedorCarrito } from './context/ContextoCarrito';
import { ProveedorProductos } from './context/ContextoProductos';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RutaProtegida } from './components/RutaProtegida';
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Reservar } from './pages/Reservar';
import { Blog } from './pages/Blog';
import { AccesoCuenta } from './pages/AccesoCuenta';
import { MiCuenta } from './pages/MiCuenta';
import { AdminHome } from './pages/AdminHome';
import { Carrito } from './pages/Carrito';
import { Nosotros } from './pages/Nosotros';
import { NotFound } from './pages/NotFound';
export default function App() {
  return (
    <ProveedorAut>
      <ProveedorCompras>
        <ProveedorProductos>
          <ProveedorCarrito>
            <BrowserRouter>
              <VolverArriba />
              <Header />
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<Catalogo />} />
                  <Route path="/carrito" element={<Carrito />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/nosotros" element={<Nosotros />} />
                  <Route path="/login" element={<AccesoCuenta />} />
                  <Route path="/registro" element={<AccesoCuenta />} />
                  <Route path="/cuentas" element={<MiCuenta />} />
                  <Route element={<RutaProtegida />}>
                    <Route path="/pago" element={<Pago />} />
                    <Route
                      path="/confirmacion/:tipo/:id"
                      element={<Confirmacion />}
                    />
                    <Route path="/reservar" element={<Reservar />} />
                    <Route element={<RutaProtegida roles={['ADMIN']} />}>
                      <Route path="/admin" element={<AdminHome />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </BrowserRouter>
          </ProveedorCarrito>
        </ProveedorProductos>
      </ProveedorCompras>
    </ProveedorAut>
  );
}
