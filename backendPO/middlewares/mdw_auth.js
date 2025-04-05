function authenticateSession(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }

    res.locals.user = req.session.user;
    console.log('Usuario en res.locals:', res.locals.user); // Depuración
    next();
}

module.exports = { authenticateSession };