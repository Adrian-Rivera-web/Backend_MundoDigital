const Publicacion = require('../models/Publicacion');

exports.obtenerTodasLasPublicaciones = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find({}).sort({ date: -1 });
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener publicaciones' });
    }
};

exports.crearPublicacion = async (req, res) => {
    try {
        const publicacion = new Publicacion(req.body);
        const publicacionGuardada = await publicacion.save();
        res.status(201).json(publicacionGuardada);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear publicación' });
    }
};
