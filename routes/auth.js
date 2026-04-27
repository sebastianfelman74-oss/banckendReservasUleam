const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Importar conexión a la base de datos
const connection = require('../db.js');

// LOGIN - Iniciar sesión
router.post("/login", (req, res) => {
    const { CORREO, CONTRASENA } = req.body;

    if (!CORREO || !CONTRASENA) {
        return res.status(400).json({
            mensaje: "Correo y contraseña son requeridos"
        });
    }

    // Buscar usuario con su rol
    const query = `
        SELECT u.*, r.NOMBRE as ROL_NOMBRE
        FROM usuarios u 
        JOIN roles r ON u.ROL_ID = r.ROL_ID 
        WHERE u.CORREO = ?
    `;

    connection.query(query, [CORREO], async (err, results) => {
        if (err) {
            console.error("Error en login:", err);
            return res.status(500).json({ mensaje: "Error del servidor" });
        }

        if (results.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const usuario = results[0];

        try {
            // Comparar contraseña (si usas bcrypt)
            const passwordMatch = await bcrypt.compare(CONTRASENA, usuario.CONTRASENA);
            
            // Por ahora comparación directa (sin encriptación)
            //const passwordMatch = CONTRASENA === usuario.CONTRASENA;

            if (!passwordMatch) {
                return res.status(401).json({ mensaje: "Credenciales incorrectas" });
            }

            // Crear sesión
            req.session.usuario = {
                id: usuario.USUARIO_ID,
                nombre: usuario.NOMBRE,
                correo: usuario.CORREO,
                rolId: usuario.ROL_ID,
                rolNombre: usuario.ROL_NOMBRE,
                tipo: usuario.TIPO
            };

            // Respuesta exitosa
            res.json({
                mensaje: "Login exitoso",
                usuario: {
                    id: usuario.USUARIO_ID,
                    nombre: usuario.NOMBRE,
                    correo: usuario.CORREO,
                    tipo: usuario.TIPO,
                    rolId: usuario.ROL_ID,
                },
                permisos: {
                    esAdmin: usuario.ROL_ID === 1,
                    esProfesor: usuario.TIPO === 'PROFESOR',
                    esEstudiante: usuario.TIPO === 'ESTUDIANTE'
                }
            });

        } catch (error) {
            console.error("Error al verificar contraseña:", error);
            res.status(500).json({ mensaje: "Error del servidor" });
        }
    });
});

// LOGOUT - Cerrar sesión (VERSIÓN CORREGIDA - Solo una ruta)
router.post("/logout", (req, res) => {
    // Verificar si hay sesión
    if (!req.session.usuario) {
        return res.status(200).json({ mensaje: "No había sesión activa" });
    }

    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ mensaje: "Error al cerrar sesión" });
        }
        
        // Limpiar cookie de sesión
        res.clearCookie("connect.sid");
        
        // También limpiar otras cookies si las tienes
        res.clearCookie("token");
        
        res.json({ mensaje: "Sesión cerrada exitosamente" });
    });
});

// VERIFICAR SESIÓN ACTUAL 
router.get("/me", (req, res) => {
    if (!req.session.usuario) {
        return res.status(401).json({ mensaje: "No hay sesión activa" });
    }

    res.json({
        usuario: req.session.usuario,
        permisos: {
            esAdmin: req.session.usuario.rolId === 1,
            esProfesor: req.session.usuario.tipo === 'PROFESOR',
            esEstudiante: req.session.usuario.tipo === 'ESTUDIANTE'
        }
    });
});

module.exports = router;