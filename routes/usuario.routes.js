const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.get('/', usuarioController.obtenerTodosLosUsuarios);
router.get('/:id', usuarioController.obtenerPerfilUsuario);
router.get('/:id/loyalty', usuarioController.obtenerInfoFidelizacion);
router.put('/:id', usuarioController.actualizarPerfilUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
