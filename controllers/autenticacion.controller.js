const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper para generar token
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto_super_seguro', {
        expiresIn: '30d',
    });
};

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rut, phone } = req.body;

        // Validar si existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const usuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rut,
            phone
        });

        if (usuario) {
            res.status(201).json({
                success: true,
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role,
                token: generarToken(usuario._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Datos de usuario inválidos' });
        }

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

exports.iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });

        if (usuario && (await bcrypt.compare(password, usuario.password))) {
            res.json({
                success: true,
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role,
                // bits y tier son campos virtuales o directos del modelo
                bits: usuario.bits,
                tier: usuario.tier,
                token: generarToken(usuario._id),
                jwToken: generarToken(usuario._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};
