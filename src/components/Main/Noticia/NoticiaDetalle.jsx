import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase'; // Asegúrate de importar correctamente tu configuración de Firebase
import { doc, getDoc } from 'firebase/firestore'; // Importa las funciones necesarias de Firestore
import './NoticiaDetalle.css';
import novedad from "../../../assets/novedad.jpeg"

const NoticiaDetalle = () => {
    const { id } = useParams(); // Obtener el id de la URL
    const [noticia, setNoticia] = useState(null); // Estado para almacenar la noticia
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    // Función para obtener la noticia desde Firestore
    const fetchNoticia = async () => {
        try {
            const docRef = doc(db, 'eventos', id); // Referencia al documento en Firestore usando el id
            const docSnap = await getDoc(docRef); // Obtener el documento

            if (docSnap.exists()) {
                const noticiaData = docSnap.data();
                console.log('Noticia obtenida:', noticiaData); // Imprimir la noticia obtenida
                setNoticia(noticiaData); // Actualizar el estado con los datos del documento
            } else {
                setError('Noticia no encontrada');
            }
        } catch (err) {
            console.error('Error al obtener la noticia:', err);
            setError('Hubo un error al cargar la noticia');
        } finally {
            setLoading(false); // Finalizar la carga
        }
    };

    // useEffect para cargar la noticia cuando el componente se monte
    useEffect(() => {
        fetchNoticia();
    }, [id]); // Se ejecuta cada vez que cambia el id

    if (loading) {
        return <p>Cargando...</p>; // Mostrar mensaje de carga mientras se obtienen los datos
    }

    if (error) {
        return <h2>{error}</h2>; // Mostrar mensaje de error si ocurre
    }

    if (!noticia) {
        return null; // No hacer nada si no hay noticia
    }

    return (
        <main>
            <div className="detalle-noticia">
                <span className="detalle-fecha">{noticia.fecha}</span>
                <h2>{noticia.titulo}</h2> {/* Cambia 'evento' por 'titulo' según tu estructura */}
                <p className="detalle-descripcion" dangerouslySetInnerHTML={{ __html: noticia.descripcion }} />

                {/* Mostrar imagen principal */}
                {/* Mostrar todas las imágenes */}
                <div className="detalle-imagenes">
                    {noticia.imagenes && noticia.imagenes.length > 0 ? (
                        noticia.imagenes.map((imagen, index) => (
                            <img
                                key={index}
                                className="detalle-imagen"
                                src={imagen}
                                alt={`Imagen ${index + 1} de la noticia`}
                            />
                        ))
                    ) : (
                        <img
                            className="detalle-imagen"
                            src={novedad} // Asegúrate de definir esta variable antes
                            alt="Imagen por defecto"
                        />
                    )}
                </div>

            </div>
        </main>
    );
};

export default NoticiaDetalle;
