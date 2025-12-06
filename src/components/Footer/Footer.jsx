import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Asegúrate de que la ruta es correcta
import logo from '../../assets/LogoAzul.png'

const Footer = () => {
  return (
    <footer id="footer">
        <p>Todos los derechos reservados</p>
      <ul>
          <li>
            <Link to="/admin">
              ADMIN
            </Link>
          </li>
          </ul>
    </footer>
  );
};

export default Footer;

