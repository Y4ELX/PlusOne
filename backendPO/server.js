require('dotenv').config(); // Asegúrate de que esto esté al inicio
const express = require('express');
const cors = require('cors');
const session = require('express-session');

//Middleware
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174', // Cambia esto al dominio de tu frontend
    credentials: true, // Permitir cookies de sesión
}));

// Configurar express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_secreto_super_seguro', // Cambia esto a un valor seguro
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Cambia a true si usas HTTPS
        maxAge: 1000 * 60 * 60, // 1 hora
    },
}));

// Middleware para depurar la sesión
app.use((req, res, next) => {
    console.log('Contenido de la sesión:', req.session); // Depuración
    next();
});

// Middleware para verificar la sesión
const authenticateSession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'No has iniciado sesión' });
    }
    next();
};

// Usar el middleware en rutas protegidas
/* app.use('/api', authenticateSession); */

//Rutas
app.use('/', require('./routes/rt_index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
