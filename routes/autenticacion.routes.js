const express = require('express');
const router = express.Router();
const autenticacionController = require('../controllers/autenticacion.controller');

router.post('/register', autenticacionController.registrar); // Mantenemos URL en inglés por convención API REST
router.post('/login', autenticacionController.iniciarSesion);

module.exports = router;
