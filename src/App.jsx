import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import Admin from './components/Admin/Admin';
import NoticiaDetalle from './components/Main/Noticia/NoticiaDetalle';
import './App.css';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='app'>
      <Router>
        <Header toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        <Routes>
          <Route path="*" element={<Main isShifted={isMenuOpen} />} />
          <Route path="/admin" element={<Admin isShifted={isMenuOpen} />} />
          <Route path='/noticia/:id' element={<NoticiaDetalle isShifted={isMenuOpen} />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} /> {/* Agrega esto */}
        </Routes>
        <Footer isShifted={isMenuOpen} />
      </Router>
    </div>
  );
};

export default App;
