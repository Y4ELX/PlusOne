require('dotenv').config();
const express = require('express');
const cors = require('cors');




//Middleware
const app = express();
app.use(express.json());
app.use(cors());



//Rutas
app.use('/', require('./routes/rt_index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
