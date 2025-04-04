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
                console.log('Sesión antes de guardar:', req.session); // Depuración
                req.session.save((err) => { // Asegurarse de que la sesión se guarde
                    if (err) {
                        console.error("❌ Error al guardar la sesión:", err);
                        return res.status(500).json({ success: false, message: "Error al guardar la sesión" });
                    }
                    console.log('Sesión después de iniciar sesión:', req.session); // Depuración
                    res.json({ success: true, message: 'Inicio de sesión exitoso', userId: user.id });
                });
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

// 📝 Ruta para obtener todos los grupos
router.get('/api/grupos', async (req, res) => {
    try {
        const sql = `
            SELECT id, nombre, descripcion, fecha_creacion, creado_por
            FROM Grupos_T
        `;

        const resultado = await ejecutarConsulta(sql);

        // Asegúrate de que `resultado` sea un array
        const grupos = resultado.recordset || resultado; // Si `recordset` existe, úsalo; de lo contrario, usa `resultado`

        res.status(200).json({ success: true, grupos });
    } catch (error) {
        console.error("❌ Error al obtener los grupos:", error);
        res.status(500).json({ success: false, message: "Error al obtener los grupos" });
    }
});

// 📝 Ruta para crear un grupo
router.post('/api/grupos', async (req, res) => {
    console.log('Sesión en /api/grupos:', req.session); // Depuración

    const { nombre, descripcion } = req.body;
    
    const creado_por = 32||req.session.user?.id; // Extraer el ID del usuario desde la sesión

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