import React, { useState } from 'react';
import Notification from './components/notification/Notification.jsx';
import './App.css';

function Login() {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Incluir cookies de sesión
                body: JSON.stringify({ usuario, contraseña }),
            });

            const data = await response.json();

            if (data.success) {

                console.log('Token recibido:', data.token);
                // Guardar el token y el ID del usuario en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                showNotification('✅ Inicio de sesión exitoso', 'success');
                // Redirigir al usuario a la página principal
            } else {
                showNotification(`❌ ${data.message}`, 'error');
            }
        } catch (error) {
            console.error('❌ Error al iniciar sesión:', error);
            showNotification('❌ Error en el servidor', 'error');
        }
    };

    return (
        <div className="login-container">
            {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
            <form onSubmit={handleLogin}>
                <label>
                    Usuario:
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Contraseña:
                    <input
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login;