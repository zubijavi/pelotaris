import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase'; // Asegúrate de importar correctamente tu configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importar las funciones necesarias de Firestore
import './Article.css'; // Importar los estilos

const Article = () => {
    // Estado para almacenar los eventos obtenidos de Firestore
    const [eventos, setEventos] = useState([]);

    // Función para formatear la fecha como día/mes/año
    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        const dia = String(fecha.getDate()).padStart(2, '0'); // Añadir un 0 si el día tiene solo un dígito
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, por eso sumamos 1
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`; // Formato día/mes/año
    };

    // Función para obtener los eventos desde Firestore
    const fetchEventos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'eventos')); // 'eventos' es el nombre de la colección en Firestore
            const eventosArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Formatear los datos
            
            // Ordenar los eventos por fecha (más recientes primero)
            eventosArray.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Asegúrate de que 'fecha' sea un string ISO o un formato de fecha válido
            
            setEventos(eventosArray); // Actualizar el estado con los eventos ordenados
            
        } catch (error) {
            console.error('Error al obtener los eventos: ', error);
        }
    };

    // useEffect para ejecutar la consulta cuando el componente se monte
    useEffect(() => {
        fetchEventos();
    }, []);

    return (
        <>
        <article>
            {eventos.length > 0 ? (
                eventos.map((evento) => (
                    <Link to={`/noticia/${evento.id}`} key={evento.id} className="card"> {/* Usar Link para la navegación */}
                        <span className="card-date">{formatFecha(evento.fecha)}</span> {/* Formatear la fecha */}
                        <div className="image-container">
                            {/* Mostrar la primera imagen de las imágenes disponibles */}
                            {evento.imagenes && evento.imagenes.length > 0 && (
                                <img 
                                    src={evento.imagenes[0]} 
                                    alt={`Imagen de ${evento.titulo}`} // Cambia 'evento.evento' a 'evento.titulo' para mayor claridad
                                    className="card-image" 
                                />
                            )}
                            <h3 className="card-title">{evento.titulo}</h3> {/* Cambia 'evento.evento' a 'evento.titulo' */}
                        </div>
                    </Link>
                ))
            ) : (
                <p>Cargando eventos...</p> // Mensaje de carga mientras se obtienen los eventos
            )}
        </article>
        </>
    );
};

export default Article;
