import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorCarrito } from "./context/ContextoCarrito";
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Páginas
import { Home } from './pages/Home';
import { Catalogo } from './pages/Catalogo';
import { Reservar } from './pages/Reservar';
import { Cuentas } from './pages/Cuentas';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { AdminHome } from './pages/AdminHome';
import { Carrito } from "./pages/Carrito";
import { Nosotros } from './pages/Nosotros';


export default function App() {
  return (
   <ProveedorCarrito>
    <BrowserRouter>
      <Header />
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/nosotros" element={<Nosotros />} />
        </Routes>
      </main>

    <Footer />
    </BrowserRouter>
    </ProveedorCarrito>
    

  );
}
