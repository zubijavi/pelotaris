// src/components/Main/Main.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importar Routes y Route
import './Main.css'; // Asegúrate de que la ruta es correcta
import Article from './Article/Article';
import NoticiaDetalle from '../Main/Noticia/NoticiaDetalle'; // Asegúrate de que la ruta es correcta

const Main = ({ isShifted }) => {
  return (
    <main className={`main ${isShifted ? 'shifted' : ''}`}>
      <Routes>
        <Route path="/" element={<Article />} /> {/* Ruta principal para las noticias */}
        <Route path="/noticia/:id" element={<NoticiaDetalle />} /> {/* Ruta para el detalle de la noticia */}
      </Routes>
    </main>
  );
};

export default Main;
