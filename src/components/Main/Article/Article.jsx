import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Article.css";
import noticia from '../../../assets/novedad.jpeg'

const Article = () => {
    const [eventos, setEventos] = useState([]);
    const [eventos2025, setEventos2025] = useState([]);
    const [añosDisponibles, setAñosDisponibles] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState("");
    const navigate = useNavigate();

    // Función para formatear la fecha como día/mes/año
    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        const dia = String(fecha.getDate() + 1).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // Función para obtener eventos desde Firestore
    const fetchEventos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "eventos"));
            const eventosArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Ordenar eventos por fecha (más recientes primero)
            eventosArray.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            // Filtrar eventos de 2025
            const eventos2025 = eventosArray.filter(
                (evento) => new Date(evento.fecha).getFullYear() === 2025
            );

            // Extraer años disponibles de eventos anteriores
            const añosUnicos = [
                ...new Set(
                    eventosArray
                        .map((evento) => new Date(evento.fecha).getFullYear())
                        .filter((year) => year < 2025) // Solo años anteriores
                ),
            ];

            setEventos(eventosArray);
            setEventos2025(eventos2025);
            setAñosDisponibles(añosUnicos);
        } catch (error) {
            console.error("Error al obtener los eventos: ", error);
        }
    };

    // useEffect para ejecutar la consulta cuando el componente se monte
    useEffect(() => {
        fetchEventos();
    }, []);

    // Manejar el cambio de selección y redirigir a la página del evento
    const handleChange = (e) => {
        const eventoId = e.target.value;
        setEventoSeleccionado(eventoId);

        if (eventoId) {
            navigate(`/noticia/${eventoId}`); // Redirige a la página del evento
        }
    };

    return (
        <>
            {/* Sección de tarjetas para eventos de 2025 */}
            <article>
                <div className="cards">
                    {eventos2025.length > 0 ? (
                        eventos2025.map((evento) => (
                            <Link to={`/noticia/${evento.id}`} key={evento.id} className="card">
                                <span className="card-date">{formatFecha(evento.fecha)}</span>
                               <div className="image-container">
                                    <img
                                        src={evento.imagenes && evento.imagenes.length > 0 ? evento.imagenes[0] : noticia}
                                        alt={`Imagen de ${evento.titulo}`}
                                        className="card-image"
                                    />

                                    <h3 className="card-title">{evento.titulo}</h3>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No hay eventos para 2025.</p>
                    )}
                </div>
            </article>

            {/* Selector de eventos de años anteriores */}
            <div className="year-selector">
                <label htmlFor="year">Noticias Anteriores</label>
                <select id="year" value={eventoSeleccionado} onChange={handleChange}>
                    <option value="">Selecciona un evento</option>
                    {añosDisponibles.map((year) => (
                        <optgroup label={year} key={year}>
                            {eventos
                                .filter((evento) => new Date(evento.fecha).getFullYear() === year)
                                .map((evento) => (
                                    <option key={evento.id} value={evento.id}>
                                        {evento.titulo}
                                    </option>
                                ))}
                        </optgroup> 
                    ))}
                </select>
            </div>
        </>
    );
};

export default Article;
