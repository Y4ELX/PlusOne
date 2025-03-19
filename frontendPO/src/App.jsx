import { useState, useEffect } from 'react';
import oneplusImg from './assets/img/oneplus.png';
import Register from './Register.jsx';
import Notification from './components/notification/Notification.jsx';
import './Register.css';
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Ocultar después de 3s
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.documentElement.classList.add('bg-transition'); 
      document.body.style.backgroundColor = 'var(--softer-gray)';
      setTimeout(() => {
        setShowLogin(true);
      }, 2500);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contraseña }),
      });

      const data = await response.json();
      if (data.success) {
        showNotification("✅ Inicio de sesión exitoso", "success");
        setTimeout(() => {
          window.location.href = "https://example.com";
        }, 1500);
      } else {
        showNotification("❌ " + data.message, "error");
      }
    } catch (error) {
      showNotification("❌ Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="app-container">
      {/* Notificación */}
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {isVisible && (
        <img
          src={oneplusImg}
          alt="OnePlus"
          style={{ width: "200px", height: "200px" }}
          className={`oneplus-image ${isVisible ? "visible" : "fade-out"}`}
        />
       )}

      {showLogin && !showRegister && (
        <div className="login-container">
          <p className='title'>Hola!</p>
          <p className='subtitle'>Iniciar Sesión</p>
          <form onSubmit={handleLogin}>
            <p className='label'>Usuario</p>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
            <p className='label' style={{ marginTop: '10px' }}>Contraseña</p>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <button type="submit" className='ingresarButton'>Iniciar Sesión</button>
            <button type="button" className='registerButton' onClick={() => setShowRegister(true)}>
              Registrarse
            </button>
          </form>
          {mensaje && <p>{mensaje}</p>}
        </div>
      )}

      {showRegister && <Register />}
    </div>
  );
}

export default App;
