const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', productoController.obtenerTodosLosProductos);
router.get('/best-sellers', productoController.obtenerMasVendidos);
router.get('/:id', productoController.obtenerProductoPorId);
router.post('/', protect, admin, productoController.crearProducto);
router.put('/:id', protect, admin, productoController.actualizarProducto);
router.delete('/:id', protect, admin, productoController.eliminarProducto);

module.exports = router;
