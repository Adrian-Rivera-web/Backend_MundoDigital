const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    id: { // Mantener id string si el frontend lo usa explícitamente
        type: String,
        unique: true,
        // required: true // Si lo generamos nosotros, no obligamos
    },
    name: { // Mantenemos keys en inglés para compatibilidad Frontend
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    brand: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware pre-save para generar ID si no existe
productoSchema.pre('save', function (next) {
    if (!this.id) {
        this.id = this._id.toString();
    }
    next();
});

productoSchema.methods.toJSON = function () {
    const producto = this.toObject();
    producto.id = producto.id || producto._id;
    return producto;
};

module.exports = mongoose.model('Producto', productoSchema);
