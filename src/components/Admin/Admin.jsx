import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase'; // Importar Firestore y Storage
import { collection, getDocs, orderBy, query, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Para Storage
import './Admin.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Admin = () => {
  const [fecha, setFecha] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [editandoEvento, setEditandoEvento] = useState(null); // Estado para el evento en edición
  const [loading, setLoading] = useState(false); // Estado de carga
  const [loadingDelete, setLoadingDelete] = useState(false); // Estado de carga para eliminar
  const [modalAbierto, setModalAbierto] = useState(false); // Estado para controlar la visibilidad del modal

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
      setModalAbierto(false); // Cerrar el modal después de guardar
    } catch (e) {
      console.error('Error al guardar el evento: ', e);
      alert('Hubo un error al guardar el evento');
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  const fetchEventos = async () => {
    try {
      const eventosRef = collection(db, 'eventos');
      const q = query(eventosRef, orderBy('fecha', 'desc')); // Ordena por la fecha de manera ascendente

      const querySnapshot = await getDocs(q); // Ejecuta la consulta ordenada
      const eventosArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(eventosArray); // Actualiza el estado con los eventos ordenados
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
    setImagenes([]); // Limpiar imágenes para evitar confusión
    setEditandoEvento(evento.id); // Establecer el ID del evento a editar
    setModalAbierto(true); // Abrir modal en edición
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
    setImagenes([]);
    setEditandoEvento(null); // Resetear el estado de edición
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <>
      <main>
        <div className='admin-container'>
          {loading && <p>Por favor, espera mientras se procesa la solicitud...</p>} {/* Mensaje de carga */}
          {loadingDelete && <p>Por favor, espera mientras se elimina el evento...</p>} {/* Mensaje de carga para eliminar */}
          <div className='formAdmin'>
            <button onClick={() => { resetForm(); setModalAbierto(true); }}>Agregar Evento</button> {/* Botón para abrir el modal */}
            {modalAbierto && (
              <div className="modal">
                <div className="modal-content">
                  <button className="close" onClick={() => setModalAbierto(false)}>X</button> {/* Botón de cierre */}
                  <h1>{editandoEvento ? 'Editar Evento' : 'Agregar Evento'}</h1>
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
                          <ReactQuill value={descripcion} onChange={setDescripcion} required /> {/* ReactQuill para descripción */}
                        </div>
                      </div>
                    </div>

                    <div className='botones'>
                      <div>
                        <label>Imágenes del Evento:</label>
                        <input type="file" multiple onChange={handleFileChange} />
                      </div>

                      {editandoEvento && (
                        <div className='imagenes-evento'>
                          {eventos.find(evt => evt.id === editandoEvento)?.imagenes?.map((img, idx) => (
                            <div key={idx} className="imagen-thumbnail">
                              <img src={img} alt={`Evento ${idx + 1}`} />
                              <button onClick={() => handleDeleteImage(img, editandoEvento)}>Eliminar Imagen</button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button type="submit">
                        {loading ? 'Guardando...' : editandoEvento ? 'Actualizar Evento' : 'Guardar Evento'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className='admin-list'>
            <table className="evento-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Título</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td>{evento.fecha}</td>
                    <td>{evento.titulo}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(evento)}>Editar</button>
                      <button className="delete-btn" onClick={() => handleDelete(evento.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </main>
    </>
  );
};

export default Admin;
