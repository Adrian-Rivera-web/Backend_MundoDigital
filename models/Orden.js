const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Referencia al modelo en español
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto', // Referencia al modelo en español
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            subtotal: { type: Number, required: true }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    },
    shippingAddress: {
        type: String,
        required: true
    },
    shippingType: {
        type: String
    },
    // Fidelización
    earnedBits: { type: Number, default: 0 },
    redeemedBits: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Orden', ordenSchema);
