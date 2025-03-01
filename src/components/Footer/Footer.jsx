import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Asegúrate de que la ruta es correcta
import logo from '../../assets/LogoAzul.png'

const Footer = ({ isShifted }) => {
  return (
    <footer className={isShifted ? 'shifted' : ''}>
        {/* <img src={logo} alt="" /> */}
        <p>Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;

