const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/:id', usuarioController.obtenerPerfilUsuario);
router.get('/:id/loyalty', usuarioController.obtenerInfoFidelizacion);
router.put('/:id', usuarioController.actualizarPerfilUsuario);

module.exports = router;
