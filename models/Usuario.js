const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    rut: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: 'CLIENT',
        enum: ['CLIENT', 'ADMIN']
    },
    // Sistema de Fidelización
    bits: {
        type: Number,
        default: 0
    },
    totalBitsDetails: { // Acumulado histórico para calcular Tier
        type: Number,
        default: 0
    },
    tier: {
        type: String,
        default: 'BIT',
        enum: ['BIT', 'BYTE', 'GIGA'] // Niveles de ejemplo
    }
}, {
    timestamps: true // Crea createdAt y updatedAt
});

// Método para limpiar el objeto antes de devolverlo (sin password)
usuarioSchema.methods.toJSON = function () {
    const usuario = this.toObject();
    delete usuario.password;
    usuario.id = usuario._id; // Frontend espera 'id'
    return usuario;
};

module.exports = mongoose.model('Usuario', usuarioSchema);
