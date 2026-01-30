const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/orden.controller');

router.post('/', ordenController.crearOrden);
router.get('/user/:userId', ordenController.obtenerOrdenesPorUsuario);

module.exports = router;
