const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

exports.crearOrden = async (req, res) => {
    try {
        const { userId, items, total, shippingAddress, shippingType } = req.body;

        // Validar Stock
        for (const item of items) {
            const producto = await Producto.findById(item.product || item.id);
            if (!producto) {
                return res.status(404).json({ message: `Producto ${item.name} no encontrado` });
            }
            if (producto.stock < item.quantity) {
                return res.status(400).json({ message: `Stock insuficiente para ${item.name}` });
            }
        }

        // Crear Orden
        const orden = new Orden({
            userId,
            items: items.map(item => ({ ...item, product: item.product || item.id })),
            total,
            shippingAddress,
            shippingType,
            earnedBits: Math.floor(total / 100),
            redeemedBits: 0
        });

        const ordenGuardada = await orden.save();

        // Actualizar Stock
        for (const item of items) {
            await Producto.findByIdAndUpdate(item.product || item.id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Actualizar Puntos Usuario
        await Usuario.findByIdAndUpdate(userId, {
            $inc: {
                bits: ordenGuardada.earnedBits,
                totalBitsDetails: ordenGuardada.earnedBits
            }
        });

        res.status(201).json(ordenGuardada);

    } catch (error) {
        console.error("Error creando orden", error);
        res.status(500).json({ message: 'Error al crear orden', error: error.message });
    }
};

exports.obtenerOrdenesPorUsuario = async (req, res) => {
    try {
        const ordenes = await Orden.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
};
