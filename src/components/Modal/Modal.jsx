import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import './Modal.css'; // Asegúrate de que la ruta sea correcta

const Modal = ({ isOpen, onClose, eventos }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Cerrar el modal si se hace clic en el área de superposición (overlay)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Torneos</h2>
        <ul>
          {eventos.length > 0 ? ( // Verifica si hay eventos para mostrar
            eventos.map((evento) => (
              <li key={evento.id}> {/* Usa el id del evento como clave */}
                <Link 
                  to={`/noticia/${evento.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }} 
                  onClick={onClose} // Cierra el modal al hacer clic en un enlace
                >
                  <strong> {evento.titulo} </strong>
                </Link>
              </li>
            ))
          ) : (
            <li>No hay eventos disponibles.</li> // Mensaje si no hay eventos
          )}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
