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



router.get('/join/:grupoId', async (req, res) => {
    const { grupoId } = req.params;

    try {
        // Verifica si el grupo existe
        const sqlGrupo = `SELECT id FROM Grupos_T WHERE id = @param1`;
        const resultadoGrupo = await ejecutarConsulta(sqlGrupo, [grupoId]);

        if (resultadoGrupo.length === 0) {
            return res.status(404).json({ success: false, message: "Grupo no encontrado" });
        }

        // Si el usuario no está autenticado, redirige al login
        if (!req.session || !req.session.user) {
            return res.redirect(`/login?redirect=/join/${grupoId}`);
        }

        const usuarioId = req.session.user.id;

        // Verifica si el usuario ya está en el grupo
        const sqlVerificar = `
            SELECT * FROM Usuario_Grupo_T WHERE usuario_id = @param1 AND grupo_id = @param2
        `;
        const resultadoVerificar = await ejecutarConsulta(sqlVerificar, [usuarioId, grupoId]);

        if (resultadoVerificar.length > 0) {
            return res.status(200).json({ success: true, message: "Ya eres miembro de este grupo" });
        }

        // Inserta al usuario en el grupo
        const sqlInsertUsuarioGrupo = `
            INSERT INTO Usuario_Grupo_T (usuario_id, grupo_id, fecha_union, es_administrador)
            VALUES (@param1, @param2, GETDATE(), @param3)
        `;
        await ejecutarConsulta(sqlInsertUsuarioGrupo, [usuarioId, grupoId, 0]); // `0` indica que no es administrador

        res.status(200).json({ success: true, message: "Te has unido al grupo con éxito" });
    } catch (error) {
        console.error("❌ Error al unirse al grupo:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

module.exports = router;

