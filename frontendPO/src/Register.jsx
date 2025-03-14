import { useState } from 'react';
import './Register.css'; // Importa los estilos

function Register() {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

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
        setMensaje('✅ Registro exitoso');
      } else {
        setMensaje('❌ ' + data.message);
      }
    } catch (error) {
      setMensaje('❌ Error de conexión con el servidor');
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="registerButton">Registrarse</button>
      </form>
      {mensaje && <p className="register-message">{mensaje}</p>}
    </div>
  );
}

export default Register;
