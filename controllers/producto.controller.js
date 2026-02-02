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

exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Busca por _id o id personalizado string, priorizando _id si es un ObjectId válido
        const producto = await Producto.findOne({
            $or: [{ id: id }, { _id: id }]
        });

        if (producto) {
            producto.name = req.body.name || producto.name;
            producto.description = req.body.description || producto.description;
            producto.price = req.body.price || producto.price;
            producto.image = req.body.image || producto.image;
            producto.category = req.body.category || producto.category;
            producto.countInStock = req.body.countInStock || producto.countInStock;
            // Actualizar otros campos que sean necesarios según el modelo

            const productoActualizado = await producto.save();
            res.json(productoActualizado);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualización producto', error: error.message });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        // Busca y borra
        const producto = await Producto.findOneAndDelete({
            $or: [{ id: id }, { _id: id }]
        });

        if (producto) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};
