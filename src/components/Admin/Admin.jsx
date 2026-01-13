import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Admin.css";

const Admin = () => {
  const [eventos, setEventos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: "",
    fecha: "",
    descripcion: "",
    tipo: "anuncio", // 🔥 nuevo campo
    imagenes: [],
  });

  const [nuevoJugador, setNuevoJugador] = useState({
    nombre: "",
    categoriaFronton: "",
    categoriaTrinquete: "",
  });

  const [editEventoId, setEditEventoId] = useState(null);
  const [editJugadorId, setEditJugadorId] = useState(null);

  // Leer datos
  const fetchData = async () => {
    const eventosSnap = await getDocs(collection(db, "eventos"));
    const jugadoresSnap = await getDocs(collection(db, "jugadores"));

    setEventos(eventosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setJugadores(jugadoresSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===========================================================
  // SUBIR IMAGENES A STORAGE
  // ===========================================================
  const subirImagenes = async (imagenes) => {
    const urls = [];

    for (let img of imagenes) {
      const imgRef = ref(storage, `eventos/${Date.now()}-${img.name}`);
      await uploadBytes(imgRef, img);
      const url = await getDownloadURL(imgRef);
      urls.push(url);
    }

    return urls;
  };

  // ===========================================================
  // CRUD EVENTOS
  // ===========================================================
  const agregarEvento = async (e) => {
    e.preventDefault();

    let imagenesUrls = [];

    if (nuevoEvento.imagenes.length > 0) {
      imagenesUrls = await subirImagenes(nuevoEvento.imagenes);
    }

    await addDoc(collection(db, "eventos"), {
      titulo: nuevoEvento.titulo,
      fecha: nuevoEvento.fecha,
      descripcion: nuevoEvento.descripcion,
      tipo: nuevoEvento.tipo, // 🔥 agregamos el tipo
      imagenes: imagenesUrls,
    });

    setNuevoEvento({
      titulo: "",
      fecha: "",
      descripcion: "",
      tipo: "anuncio",
      imagenes: [],
    });

    fetchData();
  };

  const borrarEvento = async (id) => {
    await deleteDoc(doc(db, "eventos", id));
    fetchData();
  };

  const editarEvento = async (id) => {
    let imagenesUrls = [];

    if (nuevoEvento.imagenes.length > 0) {
      imagenesUrls = await subirImagenes(nuevoEvento.imagenes);
    }

    await updateDoc(doc(db, "eventos", id), {
      titulo: nuevoEvento.titulo,
      fecha: nuevoEvento.fecha,
      descripcion: nuevoEvento.descripcion,
      tipo: nuevoEvento.tipo, // 🔥 también en edición
      imagenes: imagenesUrls.length > 0 ? imagenesUrls : undefined,
    });

    setEditEventoId(null);

    setNuevoEvento({
      titulo: "",
      fecha: "",
      descripcion: "",
      tipo: "anuncio",
      imagenes: [],
    });

    fetchData();
  };

  // ===========================================================
  // CRUD JUGADORES
  // ===========================================================
  const agregarJugador = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "jugadores"), nuevoJugador);

    setNuevoJugador({
      nombre: "",
      categoriaFronton: "",
      categoriaTrinquete: "",
    });

    fetchData();
  };

  const borrarJugador = async (id) => {
    await deleteDoc(doc(db, "jugadores", id));
    fetchData();
  };

  const editarJugador = async (id) => {
    await updateDoc(doc(db, "jugadores", id), nuevoJugador);

    setEditJugadorId(null);
    setNuevoJugador({
      nombre: "",
      categoriaFronton: "",
      categoriaTrinquete: "",
    });

    fetchData();
  };

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>

      {/* EVENTOS */}
      <section>
        <h2>Eventos</h2>

        <form
          className="admin-form"
          onSubmit={editEventoId ? () => editarEvento(editEventoId) : agregarEvento}
        >
          <input
            type="text"
            placeholder="Título"
            value={nuevoEvento.titulo}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })
            }
            required
          />

          <input
            type="date"
            value={nuevoEvento.fecha}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Descripción"
            value={nuevoEvento.descripcion}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
            }
            required
          ></textarea>

          {/* 🔥 Select de tipo de evento */}
          <select
            value={nuevoEvento.tipo}
            onChange={(e) =>
              setNuevoEvento({ ...nuevoEvento, tipo: e.target.value })
            }
          >
            <option value="anuncio">Anuncio</option>
            <option value="torneo">Torneo</option>
          </select>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setNuevoEvento({
                ...nuevoEvento,
                imagenes: Array.from(e.target.files),
              })
            }
          />

          <button type="submit">
            {editEventoId ? "Guardar Cambios" : "Agregar Evento"}
          </button>
        </form>

        <ul>
          {eventos.map((ev) => (
            <li key={ev.id}>
              <strong>{ev.titulo}</strong> - {ev.fecha}  
              <small>({ev.tipo})</small> {/* 🔥 muestra el tipo */}
              <button
                onClick={() => {
                  setEditEventoId(ev.id);
                  setNuevoEvento({
                    titulo: ev.titulo,
                    fecha: ev.fecha,
                    descripcion: ev.descripcion,
                    tipo: ev.tipo,
                    imagenes: [],
                  });
                }}
              >
                Editar
              </button>
              <button onClick={() => borrarEvento(ev.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* JUGADORES */}
      <section>
        <h2>Jugadores</h2>

        <form
          onSubmit={
            editJugadorId ? () => editarJugador(editJugadorId) : agregarJugador
          }
        >
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoJugador.nombre}
            onChange={(e) =>
              setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Categoría Frontón"
            value={nuevoJugador.categoriaFronton}
            onChange={(e) =>
              setNuevoJugador({
                ...nuevoJugador,
                categoriaFronton: e.target.value,
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Categoría Trinquete"
            value={nuevoJugador.categoriaTrinquete}
            onChange={(e) =>
              setNuevoJugador({
                ...nuevoJugador,
                categoriaTrinquete: e.target.value,
              })
            }
            required
          />

          <button type="submit">
            {editJugadorId ? "Guardar Cambios" : "Agregar Jugador"}
          </button>
        </form>

        <ul>
          {jugadores.map((j) => (
            <li key={j.id}>
              {j.nombre} — F: {j.categoriaFronton} / T: {j.categoriaTrinquete}
              <button
                onClick={() => {
                  setEditJugadorId(j.id);
                  setNuevoJugador({
                    nombre: j.nombre,
                    categoriaFronton: j.categoriaFronton,
                    categoriaTrinquete: j.categoriaTrinquete,
                  });
                }}
              >
                Editar
              </button>
              <button onClick={() => borrarJugador(j.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
