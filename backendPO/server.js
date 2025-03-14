require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ejecutarConsulta } = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
    const resultado = await ejecutarConsulta(
      'SELECT * FROM Usuarios_T WHERE usuario = @param1 AND contrasena = @param2',
      [usuario, contraseña]
    );

    if (resultado.length > 0) {
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
