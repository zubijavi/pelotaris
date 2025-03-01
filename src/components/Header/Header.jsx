import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import '../Header/Header.css';
import logo from '../../assets/LogoAzul.png';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Header = ({ toggleMenu, isMenuOpen }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [eventos, setEventos] = useState([]);

  const openModal = () => {
    setModalOpen(true);
    toggleMenu(); // Cierra el menú desplegable al abrir el modal
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const closeMenuOnLinkClick = () => {
    toggleMenu();
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
    return () => unsubscribe();
  }, []);

  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <button className={`menu-toggle ${isMenuOpen ? 'hidden' : ''}`} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={isMenuOpen ? 'nav open' : 'nav'}>
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

          <li onClick={openModal}>Torneos</li> {/* Cierra el menú y abre el modal */}
        </ul>
      </nav>

      <Modal isOpen={isModalOpen} onClose={closeModal} eventos={eventos} />
    </header>
  );
};

export default Header;
