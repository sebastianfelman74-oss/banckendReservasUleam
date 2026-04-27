const express = require('express');
const router = express.Router();
const connection = require('../db.js');
const { verificarAdmin } = require('../middlewares/auth'); // ✅ Middleware de sesión

// 1. CREAR ROL (Solo Admin)
router.post("/rol", verificarAdmin, (req, res) => {
    const nuevoRol = {
        ROL_ID: req.body.ROL_ID,
        NOMBRE: req.body.NOMBRE
    };

    const query = 'INSERT INTO roles SET ?';
    
    connection.query(query, nuevoRol, (err, result) => {
        if (err) {
            console.error("Error al crear rol:", err);
            res.status(500).send("Error al crear rol");
        } else {
            res.json({
                mensaje: "Rol creado exitosamente",
                rolId: result.insertId
            });
        }
    });
});

// 2. OBTENER TODOS LOS ROLES
router.get("/rol", (req, res) => {
    const query = 'SELECT * FROM roles ORDER BY ROL_ID';
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener roles:", err);
            res.status(500).send("Error al obtener roles");
        } else {
            res.json(results);
        }
    });
});

// 3. OBTENER ROL POR ID
router.get("/rol/:id", (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM roles WHERE ROL_ID = ?';
    
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener rol:", err);
            res.status(500).send("Error al obtener rol");
        } else if (results.length === 0) {
            res.status(404).send("Rol no encontrado");
        } else {
            res.json(results[0]);
        }
    });
});

// 4. ACTUALIZAR ROL (Solo Admin)
router.put("/rol/:id", verificarAdmin, (req, res) => {
    const id = req.params.id;
    const datosActualizar = {
        ROL_ID: req.body.ROL_ID,
        NOMBRE: req.body.NOMBRE
    };

    const query = 'UPDATE roles SET ? WHERE ROL_ID = ?';
    
    connection.query(query, [datosActualizar, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar rol:", err);
            res.status(500).send("Error al actualizar rol");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Rol no encontrado");
        } else {
            res.send("Rol actualizado exitosamente");
        }
    });
});

// 5. ELIMINAR ROL (Solo Admin)
router.delete("/rol/:id", verificarAdmin, (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM roles WHERE ROL_ID = ?';
    
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar rol:", err);
            res.status(500).send("Error al eliminar rol");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Rol no encontrado");
        } else {
            res.send("Rol eliminado exitosamente");
        }
    });
});

module.exports = router;