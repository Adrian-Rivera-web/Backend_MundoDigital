const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/orden.controller');

router.post('/', ordenController.crearOrden);
router.get('/dashboard', ordenController.obtenerResumenDashboard);
router.get('/:id', ordenController.obtenerOrdenPorId); // Order by ID
router.get('/user/:userId', ordenController.obtenerOrdenesPorUsuario);

module.exports = router;
