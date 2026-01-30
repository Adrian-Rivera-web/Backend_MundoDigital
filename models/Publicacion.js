const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
