const Orden = require('../models/Orden');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

exports.crearOrden = async (req, res) => {
    try {
        const { userId, items, total, shippingAddress, shippingType, redeemedBits, earnedBits } = req.body;

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
            earnedBits: earnedBits || Math.floor(total / 100),
            redeemedBits: redeemedBits || 0
        });

        const ordenGuardada = await orden.save();

        // Actualizar Stock
        for (const item of items) {
            await Producto.findByIdAndUpdate(item.product || item.id, {
                $inc: { stock: -item.quantity }
            });
        }

        // Actualizar Puntos Usuario
        // Sumar ganados y restar usados
        const bitsChange = (ordenGuardada.earnedBits || 0) - (ordenGuardada.redeemedBits || 0);

        // Calcular nuevo total de bits acumulados (histórico)
        const newTotalBitsDetails = (req.usuario?.totalBitsDetails || 0) + (ordenGuardada.earnedBits || 0);
        // Nota: para simplificar, usaremos los bits actuales del usuario + ganados, aunque lo ideal es leer del usuario actualizado.

        // Mejor: Hacerlo en dos pasos para asegurar consistencia
        const usuarioActualizado = await Usuario.findByIdAndUpdate(userId, {
            $inc: {
                bits: bitsChange,
                totalBitsDetails: ordenGuardada.earnedBits
            }
        }, { new: true });

        // Recalcular Tier basado en el nuevo total
        let newTier = usuarioActualizado.tier;
        const totalBits = usuarioActualizado.totalBitsDetails; // Usamos el histórico para subir de nivel

        if (totalBits > 15000) {
            newTier = 'GIGA';
        } else if (totalBits > 5000) {
            newTier = 'BYTE';
        } else {
            newTier = 'BIT';
        }

        if (newTier !== usuarioActualizado.tier) {
            usuarioActualizado.tier = newTier;
            await usuarioActualizado.save();
        }

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

exports.obtenerOrdenPorId = async (req, res) => {
    try {
        const orden = await Orden.findById(req.params.id);
        if (orden) {
            res.json(orden);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden' });
    }
};

exports.obtenerResumenDashboard = async (req, res) => {
    try {
        const totalOrdenes = await Orden.countDocuments();
        const ordenes = await Orden.find().sort({ createdAt: -1 });

        const totalIngresos = ordenes.reduce((acc, orden) => acc + orden.total, 0);
        const pedidosPendientes = ordenes.filter(o => o.status === 'PENDING').length;
        const productosVendidos = ordenes.reduce((acc, orden) => {
            return acc + orden.items.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);

        // Recent orders (last 5)
        const recentOrders = ordenes.slice(0, 5).map(o => ({
            id: o._id,
            total: o.total,
            status: o.status || 'PENDING',
            createdAt: o.createdAt
        }));

        res.json({
            totalRevenue: totalIngresos,
            totalOrders: totalOrdenes,
            pendingOrders: pedidosPendientes,
            productsSold: productosVendidos,
            recentOrders
        });
    } catch (error) {
        console.error("Error dashboard stats:", error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};
