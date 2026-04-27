const express = require('express');
const router = express.Router();
const connection = require('../db.js');
const { verificarAdmin } = require('../middlewares/auth');

// 1. OBTENER TODOS LOS BLOQUEOS
router.get("/bloqueos", verificarAdmin, (req, res) => {
    const query = `
        SELECT h.*, r.NOMBRE as RECURSO_NOMBRE
        FROM HORARIOS_BLOQUEADOS h
        JOIN recursos r ON h.RECURSOS_ID = r.RECURSOS_ID
        ORDER BY h.RECURSOS_ID, h.DIA_SEMANA, h.HORA_INICIO
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener bloqueos:", err);
            return res.status(500).json({ mensaje: "Error al obtener bloqueos" });
        }
        res.json(results);
    });
});

// 2. OBTENER BLOQUEOS POR RECURSO
router.get("/bloqueos/recurso/:id", (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT h.*, r.NOMBRE as RECURSO_NOMBRE
        FROM HORARIOS_BLOQUEADOS h
        JOIN recursos r ON h.RECURSOS_ID = r.RECURSOS_ID
        WHERE h.RECURSOS_ID = ?
        ORDER BY h.DIA_SEMANA, h.HORA_INICIO
    `;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener bloqueos del recurso:", err);
            return res.status(500).json({ mensaje: "Error al obtener bloqueos" });
        }
        res.json(results);
    });
});

// 3. CREAR BLOQUEO (Solo Admin)
router.post("/bloqueos", verificarAdmin, (req, res) => {
    const {
        RECURSOS_ID,
        DIA_SEMANA,
        HORA_INICIO,
        HORA_FIN,
        MATERIA,
        PROFESOR,
        NIVEL,
        FECHA_INICIO,
        FECHA_FIN,
        TIPO
    } = req.body;

    // Validaciones
    if (!RECURSOS_ID || !DIA_SEMANA || !HORA_INICIO || !HORA_FIN || !FECHA_INICIO || !FECHA_FIN || !TIPO) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    if (TIPO === 'CLASE' && (!MATERIA || !PROFESOR || !NIVEL)) {
        return res.status(400).json({ 
            mensaje: "Para bloqueos de clase se requiere: materia, profesor y nivel" 
        });
    }

    const nuevoBloqueo = {
        RECURSOS_ID,
        DIA_SEMANA,
        HORA_INICIO,
        HORA_FIN,
        MATERIA: MATERIA || 'MANTENIMIENTO',
        PROFESOR: PROFESOR || '-',
        NIVEL: NIVEL || '-',
        FECHA_INICIO,
        FECHA_FIN,
        TIPO
    };

    connection.query('INSERT INTO HORARIOS_BLOQUEADOS SET ?', nuevoBloqueo, (err, result) => {
        if (err) {
            console.error("Error al crear bloqueo:", err);
            return res.status(500).json({ mensaje: "Error al crear bloqueo" });
        }
        res.json({
            mensaje: `Bloqueo de ${TIPO.toLowerCase()} creado exitosamente`,
            bloqueoId: result.insertId
        });
    });
});

// 4. ACTUALIZAR BLOQUEO (Solo Admin)
router.put("/bloqueos/:id", verificarAdmin, (req, res) => {
    const { id } = req.params;
    const {
        DIA_SEMANA,
        HORA_INICIO,
        HORA_FIN,
        MATERIA,
        PROFESOR,
        NIVEL,
        FECHA_INICIO,
        FECHA_FIN,
        TIPO
    } = req.body;

    const datosActualizar = {
        DIA_SEMANA,
        HORA_INICIO,
        HORA_FIN,
        MATERIA: MATERIA || 'MANTENIMIENTO',
        PROFESOR: PROFESOR || '-',
        NIVEL: NIVEL || '-',
        FECHA_INICIO,
        FECHA_FIN,
        TIPO
    };

    connection.query('UPDATE HORARIOS_BLOQUEADOS SET ? WHERE ID = ?', [datosActualizar, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar bloqueo:", err);
            return res.status(500).json({ mensaje: "Error al actualizar bloqueo" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Bloqueo no encontrado" });
        }
        res.json({ mensaje: "Bloqueo actualizado exitosamente" });
    });
});

// 5. ELIMINAR BLOQUEO (Solo Admin)
router.delete("/bloqueos/:id", verificarAdmin, (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM HORARIOS_BLOQUEADOS WHERE ID = ?', [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar bloqueo:", err);
            return res.status(500).json({ mensaje: "Error al eliminar bloqueo" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Bloqueo no encontrado" });
        }
        res.json({ mensaje: "Bloqueo eliminado exitosamente" });
    });
});

module.exports = router;