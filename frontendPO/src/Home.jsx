import React, { useState, useEffect } from 'react';
import Notification from './components/notification/Notification.jsx';
import './App.css';

function Home() {
  const [notification, setNotification] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: '', descripcion: '' }); // Datos del nuevo grupo

  // Cargar grupos del usuario al montar el componente
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        // Simulando una llamada a la API
        const response = await fetch('http://localhost:5000/api/usuario/grupos', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
        
        if (!response.ok) throw new Error('Error al cargar grupos');
        
        const data = await response.json();
        setGrupos(data);
      } catch (error) {
        showNotification(`❌ ${error.message}`, "error");
        // Datos de ejemplo si falla la API (solo para desarrollo)
        setGrupos([
          { id: 1, nombre: 'Familia', miembros: 8, color: '#FF9AA2', esAdmin: true },
          { id: 2, nombre: 'Amigos del trabajo', miembros: 5, color: '#FFB7B2', esAdmin: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarGrupos();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCrearGrupo = () => {
    setShowModal(true); // Mostrar el modal
  };

  const handleCerrarModal = () => {
    setShowModal(false); // Ocultar el modal
    setNuevoGrupo({ nombre: '', descripcion: '' }); // Limpiar los datos del formulario
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoGrupo({ ...nuevoGrupo, [name]: value });
  };

  const handleSubmitGrupo = async (e) => {
    e.preventDefault();

    try {
        console.log('Datos enviados:', nuevoGrupo); // Depuración: Verifica los datos enviados

        const response = await fetch('http://localhost:5000/api/grupos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...nuevoGrupo,
                creado_por: localStorage.getItem('userId'), // ID del usuario creador
            }),
        });

        const data = await response.json();

        if (data.success) {
            showNotification('✅ Grupo creado con éxito', 'success');
            setGrupos([...grupos, { ...nuevoGrupo, id: Date.now() }]); // Agregar el nuevo grupo a la lista
            handleCerrarModal();
        } else {
            showNotification(`❌ ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error al crear el grupo:', error);
        showNotification('❌ Error en el servidor', 'error');
    }
  };

  const handleVerDetalles = (grupoId) => {
    showNotification(`🔍 Viendo detalles del grupo ${grupoId}`, "info");
    // navigate(`/grupo/${grupoId}`); // Si estás usando react-router
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus grupos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Notificación */}
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {/* Modal para crear grupo */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCerrarModal}>
              &times;
            </span>
            <h2>Crear Grupo</h2>
            <form onSubmit={handleSubmitGrupo}>
              <label>
                Nombre del Grupo:
                <input
                  type="text"
                  name="nombre"
                  value={nuevoGrupo.nombre}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Descripción:
                <textarea
                  name="descripcion"
                  value={nuevoGrupo.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Crear</button>
            </form>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="home-header">
        <h1 className="title">Tus Grupos</h1>
        <p className="subtitle">Grupos a los que perteneces</p>
      </div>

      {/* Lista de grupos */}
      <div className="grupos-container">
        {grupos.length > 0 ? (
          grupos.map(grupo => (
            <div 
              key={grupo.id} 
              className="grupo-card"
              style={{ backgroundColor: grupo.color || '#f0f0f0' }}
              onClick={() => handleVerDetalles(grupo.id)}
            >
              <div className="grupo-header">
                <h3>{grupo.nombre}</h3>
                {grupo.esAdmin && <span className="admin-badge">Admin</span>}
              </div>
              <p className="grupo-miembros">{grupo.miembros} miembros</p>
              <p className="grupo-descripcion">{grupo.descripcion || 'Sin descripción'}</p>
            </div>
          ))
        ) : (
          <div className="no-grupos">
            <p>No perteneces a ningún grupo aún</p>
            <button 
              className="crear-primer-grupo"
              onClick={handleCrearGrupo}
            >
              Crear mi primer grupo
            </button>
          </div>
        )}
      </div>

      {/* Navbar inferior */}
      <div className="navbar">
        <button className="nav-button">
          <i className="fas fa-home"></i>
          <span>Inicio</span>
        </button>
        
        <button 
          className="nav-button central" 
          onClick={handleCrearGrupo}
        >
          <div className="plus-circle">
            <i className="fas fa-plus">+</i>
          </div>
        </button>
        
        <button className="nav-button">
          <i className="fas fa-user"></i>
          <span>Perfil</span>
        </button>
      </div>
    </div>
  );
}

export default Home;