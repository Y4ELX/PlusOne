import { useState, useEffect } from 'react';
import oneplusImg from './assets/img/oneplus.png';
import './App.css';

function App() {
  const [isVisible, setIsVisible] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.documentElement.classList.add('bg-transition'); 
      document.body.style.backgroundColor = '#ffffff';
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
        setMensaje('✅ Inicio de sesión exitoso');
        
      } else {
        setMensaje('❌ Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setMensaje('❌ Error en la conexión con el servidor');
    }
  };

  return (
    <div className="app-container">
      {isVisible && (
        <img
          src={oneplusImg}
          alt="OnePlus"
          style={{ width: '200px', height: '200px' }}
          className={`oneplus-image ${isVisible ? 'visible' : 'fade-out'}`}
        />
      )}

      {showLogin && (
        <div className="login-container">
          <p className='title'>Hola!</p>
          <p className='subtitle'>Iniciar Sesión</p>
          <form onSubmit={handleLogin}>
        <p className='label'>
          Usuario
        </p>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <p className='label' style={{ marginTop: '10px' }}>
          Contraseña
        </p>
        <input
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit" className='ingresarButton'>Iniciar Sesión</button>
        <button type="submit" className='registerButton'>Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
        </div>
      )}
    </div>
  );
}

export default App;