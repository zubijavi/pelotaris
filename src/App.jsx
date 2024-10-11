// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importar Router, Routes y Route
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import Admin from './components/Admin/Admin'
import NoticiaDetalle from './components/Main/Noticia/NoticiaDetalle';
import './App.css';
import Carousel from './components/Carousel/Carousel';
import Aside from './components/Aside/Aside';

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
          <Route path="/" element={<Main isShifted={isMenuOpen} />} />
          <Route path="/admin" element={<Admin isShifted={isMenuOpen} />} />

          <Route path='/noticia/:id' element={<NoticiaDetalle isShifted={isMenuOpen} />} />
        </Routes>
        <Carousel isShifted={isMenuOpen} />
        <Aside isShifted={isMenuOpen} />
        <Footer isShifted={isMenuOpen} />
      </Router>
    </div>
  );
};

export default App;


{/* <Route path="/noticia/:id" element={<NoticiaDetalle isShifted={isMenuOpen}/>} /> */ }
