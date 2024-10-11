import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Asegúrate de que la ruta es correcta
import logo from '../../assets/LogoAzul.png'

const Footer = ({ isShifted }) => {
  return (
    <footer className={isShifted ? 'shifted' : ''}>
      <Link to="/admin">
        <img src={logo} alt="" />
      </Link>

    </footer>
  );
};

export default Footer;

