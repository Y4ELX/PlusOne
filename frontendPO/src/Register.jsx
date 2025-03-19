import { useState } from 'react';
import Login from './App.jsx';
import Notification from './components/notification/Notification.jsx';
import './Register.css';

function Register() {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Ocultar después de 3s
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, email, password }), // Corrección aquí
      });

      const data = await response.json();
      if (data.success) {
        showNotification("✅ Registro exitoso", "success");
        setTimeout(() => {
          setShowLogin(true);
        }, 200);
      } else {
        showNotification("❌ " + data.message, "error");
      }
    } catch (error) {
      showNotification("❌ Error de conexión con el servidor", "error");
    }
  };

  return (
    <div className="register-container">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {showLogin ? (
        <Login />
      ) : (
        <>
          <p className='title'>Regístrate</p>
          <p className='subtitle'>Crea una cuenta</p>
          <form onSubmit={handleRegister} className="register-form">
            <p className='label'>Usuario</p>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
            <p style={{ marginTop: '10px' }} className='label'>Correo</p>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p style={{ marginTop: '10px' }} className='label'>Contraseña</p>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button style={{ marginTop: '40px' }} type="submit" className="registerButton">Registrarse</button>
          </form>
          {mensaje && <p className="register-message">{mensaje}</p>}
        </>
      )}
    </div>
  );  
}

export default Register;
