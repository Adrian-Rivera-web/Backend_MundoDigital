const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacion.controller');

router.get('/posts', publicacionController.obtenerTodasLasPublicaciones);
router.post('/posts', publicacionController.crearPublicacion);

module.exports = router;
