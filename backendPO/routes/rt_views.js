const express = require('express');
const router = express.Router();
const { ejecutarConsulta } = require('../db');
const { authenticateSession } = require('../middlewares/mdw_auth'); // Asegúrate de que la ruta sea correcta

router.get('/home',authenticateSession, async (req, res) => {
    if (!res.locals.user) {
        return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }

    const { id } = res.locals.user; // Extraer el ID del usuario desde res.locals
    console.log('ID del usuario desde res.locals:', id); // Depuración

    res.json({ success: true, userId: id }); // Enviar el ID como respuesta
});

module.exports = router;

