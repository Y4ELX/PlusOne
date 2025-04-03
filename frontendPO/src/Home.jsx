// src/Home.jsx
import React, { useState } from 'react';
import Notification from './components/notification/Notification.jsx';
import './App.css';

function Home() {
  const [notification, setNotification] = useState(null);
  // Datos de ejemplo para grupos
  const [grupos, setGrupos] = useState([
    { id: 1, nombre: 'Familia', miembros: 8, color: '#FF9AA2' },
    { id: 2, nombre: 'Amigos del trabajo', miembros: 5, color: '#FFB7B2' },
    { id: 3, nombre: 'Equipo de fútbol', miembros: 11, color: '#FFDAC1' },
    { id: 4, nombre: 'Universidad', miembros: 15, color: '#E2F0CB' },
    { id: 5, nombre: 'Vecinos', miembros: 7, color: '#B5EAD7' },
  ]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCrearGrupo = () => {
    showNotification("🔄 Funcionalidad en desarrollo", "info");
    // Aquí iría la lógica para crear un nuevo grupo
  };

  return (
    <div className="app-container">
      {/* Notificación */}
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {/* Encabezado */}
      <div className="home-header">
        <h1 className="title">Tus Grupos</h1>
        <p className="subtitle">Grupos a los que perteneces</p>
      </div>

      {/* Lista de grupos */}
      <div className="grupos-container">
        {grupos.map(grupo => (
          <div 
            key={grupo.id} 
            className="grupo-card"
            style={{ backgroundColor: grupo.color }}
          >
            <h3>{grupo.nombre}</h3>
            <p>{grupo.miembros} miembros</p>
          </div>
        ))}
      </div>

      {/* Navbar inferior */}
      <div className="navbar">
        <button className="nav-button">
          <i className="fas fa-user"></i> {/* Icono de ejemplo, necesitarías Font Awesome */}
        </button>
        
        <button 
          className="nav-button central" 
          onClick={handleCrearGrupo}
        >
          <i className="fas fa-plus"></i> {/* Icono de + */}
        </button>
        
        <button className="nav-button">
          <i className="fas fa-cog"></i> {/* Icono de ajustes */}
        </button>
      </div>
    </div>
  );
}

export default Home;