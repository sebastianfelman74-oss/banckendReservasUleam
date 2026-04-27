// Middleware para verificar si el usuario está logueado
const verificarAutenticacion = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a esta función"
        });
    }
    next();
};

// Middleware para verificar si es administrador
const verificarAdmin = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a esta función"
        });
    }

    if (req.session.usuario.rolId !== 1) {
        return res.status(403).json({
            mensaje: "Acceso denegado. Solo administradores pueden realizar esta acción."
        });
    }
    next();
};

// Middleware para verificar si es profesor o admin
const verificarProfesorOAdmin = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a esta función"
        });
    }

    const { rolId, tipo } = req.session.usuario;
    if (rolId !== 1 && tipo !== 'PROFESOR') {
        return res.status(403).json({
            mensaje: "Acceso denegado. Solo profesores y administradores pueden realizar esta acción."
        });
    }
    next();
};

// Middleware para verificar si es estudiante, profesor o admin (usuarios autenticados)
const verificarUsuarioAutenticado = (req, res, next) => {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensaje: "Debes iniciar sesión para acceder a esta función"
        });
    }
    
    const { tipo } = req.session.usuario;
    if (!['ESTUDIANTE', 'PROFESOR', 'ADMINISTRADOR'].includes(tipo)) {
        return res.status(403).json({
            mensaje: "Acceso denegado. Tipo de usuario no válido."
        });
    }
    next();
};

module.exports = {
    verificarAutenticacion,
    verificarAdmin,
    verificarProfesorOAdmin,
    verificarUsuarioAutenticado
};

// Middleware Sirve para verificar si el usuario es un profesor o un administrador 
// y si está autenticado, permitiendo el acceso a ciertas rutas según su rol.
// Se utiliza en rutas que requieren permisos especiales, como la gestión de cursos o usuarios.
