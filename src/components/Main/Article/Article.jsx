import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Article.css";
import noticia from "../../../assets/novedad.jpeg";

const Article = () => {
    const [eventos, setEventos] = useState([]);

    // Formatear fecha
    const formatFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        const dia = String(fecha.getDate() + 1).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    // Obtener eventos desde Firestore
    const fetchEventos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "eventos"));
            const eventosArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Ordenar por fecha (recientes primero)
            eventosArray.sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );

            setEventos(eventosArray);
        } catch (error) {
            console.error("Error al obtener eventos: ", error);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    return (
        <article>
            <h1>NOVEDADES</h1>
            <div className="cards">
                {eventos.length > 0 ? (
                    eventos.map((evento) => (
                        <Link to={`/noticia/${evento.id}`} key={evento.id} className="card">

                            {/* IZQUIERDA: fecha + título */}
                            <div className="card-info">
                                <span className="card-date">
                                    {formatFecha(evento.fecha)}
                                </span>

                                <h3 className="card-title">
                                    {evento.titulo}
                                </h3>
                            </div>

                            {/* DERECHA: imagen */}
                            <div className="image-container">
                                <img
                                    src={
                                        evento.imagenes?.length > 0
                                            ? evento.imagenes[0]
                                            : noticia
                                    }
                                    alt={evento.titulo}
                                    className="card-image"
                                />
                            </div>

                        </Link>
                    ))
                ) : (
                    <p>No hay eventos disponibles.</p>
                )}
            </div>
        </article>
    );
};

export default Article;
