const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { ejecutarConsulta } = require('../db');

// 📝 Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { usuario, contraseña } = req.body;

    try {
        const resultado = await ejecutarConsulta(
            'SELECT * FROM Usuarios_T WHERE usuario = @param1',
            [usuario]
        );

        if (resultado.length > 0) {
            const user = resultado[0];

            // Compara la contraseña ingresada con la hasheada en la BD
            const match = await bcrypt.compare(contraseña, user.contrasena);

            if (match) {
                // Guardar el usuario en la sesión
                req.session.user = { id: user.id, usuario: user.usuario };
                res.json({ success: true, message: 'Inicio de sesión exitoso', userId: user.id });
            } else {
                res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error("❌ Error en el login:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// 📝 Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Error al cerrar sesión:", err);
            return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
        }
        res.clearCookie('connect.sid'); // Elimina la cookie de sesión
        res.json({ success: true, message: "Sesión cerrada con éxito" });
    });
});

// 📝 Ruta para registrar usuario con contraseña hasheada
router.post("/register", async (req, res) => {
    const { usuario, email, password } = req.body;

    if (!usuario || !email || !password) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña
        const sql = "INSERT INTO Usuarios_T (usuario, email, contrasena) VALUES (@param1, @param2, @param3)";

        await ejecutarConsulta(sql, [usuario, email, hashedPassword]);

        res.status(201).json({ success: true, message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// Endpoint para obtener grupos del usuario
router.get('/api/usuario/grupos', async (req, res) => {
    try {
        const usuarioId = req.user.id; // Asumiendo que tienes autenticación
        
        const grupos = await pool.query(`
            SELECT g.id, g.nombre, g.descripcion, ug.fecha_union, ug.es_administrador
            FROM Grupos_T g
            JOIN Usuario_Grupo_T ug ON g.id = ug.grupo_id
            WHERE ug.usuario_id = @usuarioId
        `, { usuarioId });
        
        res.json(grupos.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📝 Ruta para crear un grupo
router.post('/api/grupos', async (req, res) => {
    const { nombre, descripcion } = req.body;

    console.log('Datos recibidos:', req.body); // Depuración: Verifica los datos recibidos

    const creado_por = req.session.user.id; // Extraer el ID del usuario desde la sesión

    if (!nombre || !descripcion || !creado_por) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    try {
        const sql = `
            INSERT INTO Grupos_T (nombre, descripcion, fecha_creacion, creado_por)
            VALUES (@param1, @param2, GETDATE(), @param3)
        `;

        await ejecutarConsulta(sql, [nombre, descripcion, creado_por]);

        res.status(201).json({ success: true, message: "Grupo creado con éxito" });
    } catch (error) {
        console.error("❌ Error al crear el grupo:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

module.exports = router;