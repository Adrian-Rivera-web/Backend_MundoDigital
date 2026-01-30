const Producto = require('../models/Producto');

exports.obtenerTodosLosProductos = async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.obtenerProductoPorId = async (req, res) => {
    try {
        // Buscar por 'id' string o '_id' ObjectId
        const producto = await Producto.findOne({
            $or: [{ id: req.params.id }, { _id: req.params.id }]
        });

        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

exports.obtenerMasVendidos = async (req, res) => {
    try {
        // Lógica simple: devolver los primeros 4 o los que tengan más reviews/rating
        const productos = await Producto.find({}).sort({ rating: -1 }).limit(4);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener más vendidos' });
    }
};

exports.crearProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        const productoCreado = await producto.save();
        res.status(201).json(productoCreado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};
