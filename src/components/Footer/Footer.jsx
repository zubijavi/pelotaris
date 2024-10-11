import React from 'react';
import './Footer.css'; // Asegúrate de que la ruta es correcta
import logo from '../../assets/LogoAzul.png'

const Footer = ({ isShifted }) => {
  return (
    <footer className={isShifted ? 'shifted' : ''}>
      <img src={logo} alt="" />

    </footer>
  );
};

export default Footer;

