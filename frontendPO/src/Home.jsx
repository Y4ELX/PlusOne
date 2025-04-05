import React, { useState, useEffect } from 'react';
import Notification from './components/notification/Notification.jsx';
import './App.css';

function Home() {
  const [notification, setNotification] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({ 
    userId: localStorage.getItem('userId'), // Obtén el userId desde localStorage
    nombre: '', 
    descripcion: '' 
  });
  const [isCreating, setIsCreating] = useState(false);

  // Cargar grupos del usuario al montar el componente
  useEffect(() => {
    const cargarGrupos = async () => {
      try {

        const response = await fetch('http://localhost:5000/api/grupos', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Incluir cookies de sesión
        });
        
        if (!response.ok) throw new Error('Error al cargar grupos');
        
        const data = await response.json();
        // Asegúrate de que `data.grupos` sea un array
        setGrupos(data.grupos || []); // Si `data.grupos` no existe, usa un array vacío
      } catch (error) {
        console.error('Error al cargar los grupos:', error);
        showNotification(`❌ ${error.message}`, 'error');
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
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setNuevoGrupo({ nombre: '', descripcion: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoGrupo({ ...nuevoGrupo, [name]: value });
  };

  const handleSubmitGrupo = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const userId = localStorage.getItem('userId'); // Obtén el userId desde localStorage
      const response = await fetch('http://localhost:5000/api/grupos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // OTRO BASTARDO HOMOSEXUAL
        body: JSON.stringify(nuevoGrupo, userId)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear grupo');
      }

      showNotification('✅ Grupo creado con éxito', 'success');
      setGrupos([...grupos, { ...nuevoGrupo, id: Date.now() }]);
      handleCerrarModal();
    } catch (error) {
      console.error('Error al crear el grupo:', error);
      showNotification(`❌ ${error.message}`, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerDetalles = (grupoId) => {
    showNotification(`🔍 Viendo detalles del grupo ${grupoId}`, "info");
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

      {/* Modal para crear grupo - Versión mejorada */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Crear Nuevo Grupo</h2>
              <button className="modal-close" onClick={handleCerrarModal}>
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmitGrupo} className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre del Grupo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nuevoGrupo.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Familia, Amigos, Equipo de trabajo"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={nuevoGrupo.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe el propósito de este grupo"
                  rows="3"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCerrarModal}
                  disabled={isCreating}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creando...' : 'Crear Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="home-header">
        <h1 className="title">Eventos</h1>
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