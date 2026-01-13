import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
// import "./Torneos.css";

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);

  const fetchTorneos = async () => {
    const eventosSnap = await getDocs(collection(db, "eventos"));
    const data = eventosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Filtrar solo torneos
    const soloTorneos = data.filter((ev) => ev.tipo === "torneo");

    setTorneos(soloTorneos);
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  return (
    <div className="torneos-container">
      <h1>Torneos</h1>

      {torneos.length === 0 && <p>No hay torneos cargados.</p>}

      <div className="torneos-list">
        {torneos.map((torneo) => (
          <div key={torneo.id} className="torneo-card">
            <h2>{torneo.titulo}</h2>
            <p><strong>Fecha:</strong> {torneo.fecha}</p>
            <p>{torneo.descripcion}</p>

            {/* Mostrar imágenes si existen */}
            {torneo.imagenes && torneo.imagenes.length > 0 && (
              <div className="torneo-imagenes">
                {torneo.imagenes.map((img, index) => (
                  <img key={index} src={img} alt="img torneo" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Torneos;
