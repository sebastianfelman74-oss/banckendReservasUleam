const express = require('express');
const router = express.Router();

// Importar conexión
const connection = require('../db.js');

// Crear usuario
router.post('/crearUsuario', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.CONTRASENA, 10);
    const nuevoUsuario = {
        NOMBRE: req.body.NOMBRE,
        APELLIDO: req.body.APELLIDO,
        CORREO: req.body.CORREO,
        CONTRASENA: hashedPassword, // Contraseña encriptada  Cambios en 26-04-2026
        TIPO: req.body.TIPO,
        ROL_ID: req.body.ROL_ID
    };

    connection.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err, result) => {
        if (err) {
            console.error("Error al insertar usuario: ", err);
            res.status(500).send("Error en el servidor");
        } else {
            res.send("Usuario creado exitosamente");
        }
    });
});

// Obtener todos los usuarios
router.get('/', (req, res) => {
    connection.query("SELECT * FROM usuarios", (err, results) => {
        if (err) return res.status(500).send("Error");
        res.json(results);
    });
});

// Obtener usuario por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM usuarios WHERE USUARIO_ID = ?", [id], (err, results) => {
        if (err) return res.status(500).send("Error");
        res.json(results[0]);
    });
});


// Actualizar usuario por ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    connection.query("UPDATE usuarios SET ? WHERE USUARIO_ID = ?", [data, id], (err, results) => {
        if (err) return res.status(500).send("Error");
        res.send("Usuario actualizado");
    });
});

// Eliminar usuario por ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    connection.query("DELETE FROM usuarios WHERE USUARIO_ID = ?", [id], (err, results) => {
        if (err) return res.status(500).send("Error");
        res.send("Usuario eliminado");
    });
});
module.exports = router;

