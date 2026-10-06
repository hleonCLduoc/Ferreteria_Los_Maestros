import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Páginas
import { Home } from './pages/Home';
import { Reservar } from './pages/Reservar';
import { Cuentas } from './pages/Cuentas';
import { Blog } from './pages/Blog';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { AdminHome } from './pages/AdminHome';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}