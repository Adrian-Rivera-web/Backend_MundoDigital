const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.obtenerPerfilUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
};

exports.obtenerInfoFidelizacion = async (req, res) => {
    try {
        // Seleccionamos solo los campos relevantes
        const usuario = await Usuario.findById(req.params.id).select('bits totalBitsDetails tier');
        if (usuario) {
            res.json({
                bits: usuario.bits,
                totalBitsDetails: usuario.totalBitsDetails,
                tier: usuario.tier
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener información de fidelización' });
    }
};

exports.actualizarPerfilUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (usuario) {
            usuario.nombre = req.body.nombre || usuario.nombre;
            usuario.email = req.body.email || usuario.email;
            usuario.rut = req.body.rut || usuario.rut;
            usuario.phone = req.body.phone || usuario.phone;
            usuario.role = req.body.role || usuario.role; // Allow Admin to update role

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(req.body.password, salt);
            }

            const usuarioActualizado = await usuario.save();
            res.json({
                id: usuarioActualizado._id,
                nombre: usuarioActualizado.nombre,
                email: usuarioActualizado.email,
                role: usuarioActualizado.role,
                rut: usuarioActualizado.rut,
                phone: usuarioActualizado.phone
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil' });
    }
};

exports.obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}).select('-password'); // Exclude password
        // Map _id to id for frontend compatibility
        const usuariosMapeados = usuarios.map(u => ({
            id: u._id,
            name: u.nombre,
            email: u.email,
            role: u.role,
            bits: u.bits,
            tier: u.tier,
            rut: u.rut,
            phone: u.phone,
            wishlist: u.wishlist
        }));
        res.json(usuariosMapeados);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (usuario) {
            await usuario.deleteOne();
            res.json({ message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};
