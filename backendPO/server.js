require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const { ejecutarConsulta } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

// 📝 Ruta para registrar usuario con contraseña hasheada
app.post("/register", async (req, res) => {
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

// 📝 Ruta para iniciar sesión
app.post('/login', async (req, res) => {
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
                res.json({ success: true, message: 'Inicio de sesión exitoso' });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
