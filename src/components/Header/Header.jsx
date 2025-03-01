import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Header/Header.css';
import logo from '../../assets/LogoAzul.png';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Header = ({ toggleMenu, isMenuOpen }) => {
  const [eventos, setEventos] = useState([]);
  const menuRef = useRef(null);  // Referencia para el menú

  const closeMenuOnLinkClick = () => {
    toggleMenu();  // Cerrar el menú al hacer clic en un enlace
  };

  const fetchEventos = () => {
    const unsubscribe = onSnapshot(
      collection(db, 'eventos'),
      (querySnapshot) => {
        const eventosArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        eventosArray.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setEventos(eventosArray);
      },
      (error) => {
        console.error('Error al obtener los eventos: ', error);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchEventos();

    // Cerrar el menú al hacer clic fuera de él si está abierto
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(); // Solo cerrar el menú si está abierto
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleMenu, isMenuOpen]);  // Se agregó isMenuOpen a la lista de dependencias

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <button className={`menu-toggle ${isMenuOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={isMenuOpen ? 'nav open' : 'nav'} ref={menuRef}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenuOnLinkClick}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/admin" onClick={closeMenuOnLinkClick}>
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
