function guardarUsuarioEnLocals(req, res, next) {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user; // Guarda el usuario en res.locals
        console.log('Usuario guardado en res.locals:', res.locals.user); // Depuración
    }
    next(); // Continúa con la siguiente función middleware o ruta
}

module.exports = { guardarUsuarioEnLocals };