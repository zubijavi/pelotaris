import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Jugadores = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jugadores"));
        const playersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlayers(playersData);
      } catch (error) {
        console.error("Error obteniendo jugadores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <p>Cargando jugadores...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Listado de Jugadores</h2>

      {players.length === 0 ? (
        <p>No hay jugadores cargados.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {players.map((player) => (
            <li
              key={player.id}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <strong>
                {player.nombre}
              </strong>
              <br />
              Categoría Frontón: {player.categoriaFronton}
              <br />
              Categoria Trinquete: {player.categoriaTrinquete}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jugadores;
