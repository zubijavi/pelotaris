import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase'; // Importar Firestore y Storage
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Para Firestore
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Para Storage
import './Admin.css';

const Admin = () => {
  const [fecha, setFecha] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [posiciones, setPosiciones] = useState([{ club: '' }, { club: '' }, { club: '' }]); // Solo club
  const [imagenes, setImagenes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [editandoEvento, setEditandoEvento] = useState(null); // Estado para el evento en edición
  const [loading, setLoading] = useState(false); // Estado de carga
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga para eliminar

  const handleChange = (e, index) => {
    const updatedPosiciones = [...posiciones];
    updatedPosiciones[index].club = e.target.value; // Solo actualizar el club
    setPosiciones(updatedPosiciones);
  };

  const handleFileChange = (e) => {
    setImagenes([...e.target.files]);
  };

  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const deleteImages = async (imagenesURLs) => {
    const deletionPromises = imagenesURLs.map(async (url) => {
      const fileRef = ref(storage, url); // Usar la URL para obtener la referencia
      await deleteObject(fileRef); // Eliminar el archivo
    });
    await Promise.all(deletionPromises); // Esperar a que todas las eliminaciones se completen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar estado de carga

    const imagenesURLs = imagenes.length > 0 ? await uploadImages(imagenes) : [];

    const evento = {
      fecha,
      titulo,
      descripcion,
      posiciones: posiciones.map((pos) => ({
        club: pos.club
      })),
      imagenes: editandoEvento
        ? [...eventos.find(evento => evento.id === editandoEvento).imagenes, ...imagenesURLs] // Mantener imágenes existentes y agregar nuevas
        : imagenesURLs // Si no está editando, usar solo las nuevas imágenes
    };

    try {
      if (editandoEvento) {
        // Actualizar evento existente
        await updateDoc(doc(db, 'eventos', editandoEvento), evento);
        alert('Evento actualizado exitosamente en Firestore!');
      } else {
        // Crear nuevo evento
        await addDoc(collection(db, 'eventos'), evento);
        alert('Evento guardado exitosamente en Firestore!');
      }
      fetchEventos(); // Actualizar los eventos después de guardar o actualizar
      resetForm(); // Reiniciar el formulario
    } catch (e) {
      console.error('Error al guardar el evento: ', e);
      alert('Hubo un error al guardar el evento');
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  const fetchEventos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'eventos'));
      const eventosArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(eventosArray);
    } catch (error) {
      console.error('Error al obtener los eventos: ', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar este evento?');
    if (confirmDelete) {
      setLoadingDelete(true); // Activar estado de carga para eliminar
      try {
        const eventoAEliminar = eventos.find(evento => evento.id === id); // Buscar el evento
        if (eventoAEliminar.imagenes && eventoAEliminar.imagenes.length > 0) {
          await deleteImages(eventoAEliminar.imagenes); // Eliminar las imágenes de Firebase Storage
        }
        await deleteDoc(doc(db, 'eventos', id)); // Eliminar el evento de Firestore
        alert('Evento eliminado exitosamente.');
        fetchEventos(); // Actualizar la lista de eventos
      } catch (error) {
        console.error('Error al eliminar el evento: ', error);
        alert('Hubo un error al eliminar el evento');
      } finally {
        setLoadingDelete(false); // Desactivar estado de carga para eliminar
      }
    }
  };

  const handleEdit = (evento) => {
    setFecha(evento.fecha);
    setTitulo(evento.titulo);
    setDescripcion(evento.descripcion);
    setPosiciones(evento.posiciones.map(pos => ({ club: pos.club }))); // Solo extraer el club
    setImagenes([]); // Limpiar imágenes para evitar confusión
    setEditandoEvento(evento.id); // Establecer el ID del evento a editar
  };

  const handleDeleteImage = async (imgURL, eventoId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta imagen?');
    if (confirmDelete) {
      try {
        // Eliminar la imagen de Firebase Storage
        const imageRef = ref(storage, imgURL);
        await deleteObject(imageRef);

        // Obtener el evento actual y actualizarlo sin la imagen eliminada
        const evento = eventos.find(evento => evento.id === eventoId);
        const nuevasImagenes = evento.imagenes.filter(img => img !== imgURL);

        // Actualizar el documento en Firestore sin la imagen eliminada
        await updateDoc(doc(db, 'eventos', eventoId), {
          imagenes: nuevasImagenes
        });

        // Actualizar el estado
        setEventos(prevEventos =>
          prevEventos.map(evt =>
            evt.id === eventoId ? { ...evt, imagenes: nuevasImagenes } : evt
          )
        );

        alert('Imagen eliminada exitosamente.');
      } catch (error) {
        console.error('Error al eliminar la imagen: ', error);
        alert('Hubo un error al eliminar la imagen.');
      }
    }
  };

  const resetForm = () => {
    setFecha('');
    setTitulo('');
    setDescripcion('');
    setPosiciones([{ club: '' }, { club: '' }, { club: '' }]); // Reiniciar solo club
    setImagenes([]);
    setEditandoEvento(null); // Resetear el estado de edición
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <>
    <main>
      {loading && <p>Por favor, espera mientras se procesa la solicitud...</p>} {/* Mensaje de carga */}
      {loadingDelete && <p>Por favor, espera mientras se elimina el evento...</p>} {/* Mensaje de carga para eliminar */}
      <div className='formAdmin'>
        <h1>Admin Panel - {editandoEvento ? 'Editar Evento' : 'Crear Evento'}</h1>
        <form onSubmit={handleSubmit}>
          <div className='formulario'>
            <div className='left'>
              <div>
                <label>Fecha:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div>
                <label>Título:</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>
              <div>
                <label>Descripción:</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
              </div>
            </div>

            <div className='right'>
              {posiciones.map((pos, index) => (
                <div key={index}>
                  <h2>Posición {index + 1}</h2>
                  <div>
                    <label>Club:</label>
                    <input type="text" value={pos.club} onChange={(e) => handleChange(e, index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='botones'>
            <div>
              <label>Imágenes del Evento:</label>
              <input type="file" multiple onChange={handleFileChange} />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : editandoEvento ? 'Actualizar Evento' : 'Guardar Evento'}
            </button>
          </div>
        </form>

        {/* Mostrar lista de eventos */}
        {eventos.map((evento) => (
          <div key={evento.id} className='evento'>
            <h2>{evento.titulo} - {evento.fecha}</h2>
            <p>{evento.descripcion}</p>

            <h3>Posiciones:</h3>
            <ol>
              {evento.posiciones.map((pos, index) => (
                <li key={index}>{pos.club}</li>
              ))}
            </ol>

            <h3>Imágenes:</h3>
            <div className='imagenes'>
              {evento.imagenes.map((imgURL, index) => (
                <div key={index} className='imagen-container'>
                  <img src={imgURL} alt={`Imagen ${index + 1}`} />
                  <button onClick={() => handleDeleteImage(imgURL, evento.id)}>Eliminar Imagen</button>
                </div>
              ))}
            </div>

            <div className='botones-evento'>
              <button onClick={() => handleEdit(evento)}>Editar Evento</button>
              <button onClick={() => handleDelete(evento.id)}>Eliminar Evento</button>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
};

export default Admin;
