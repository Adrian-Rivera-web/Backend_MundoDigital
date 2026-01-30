const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

router.get('/', productoController.obtenerTodosLosProductos);
router.get('/best-sellers', productoController.obtenerMasVendidos);
router.get('/:id', productoController.obtenerProductoPorId);
router.post('/', productoController.crearProducto);

module.exports = router;
