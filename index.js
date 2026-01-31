const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/database');
const cors = require('cors');

connectDB();

app.use(cors());
app.use(express.json());

// Log simple para desarrollo
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// Rutas Modulares (importando las versiones en español)
const autenticacionRoutes = require('./routes/autenticacion.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const productoRoutes = require('./routes/producto.routes');
const ordenRoutes = require('./routes/orden.routes');
const publicacionRoutes = require('./routes/publicacion.routes');

// Definición de Endpoints
app.use('/api/auth', autenticacionRoutes);
app.use('/api/users', usuarioRoutes);
app.use('/api/products', productoRoutes);
app.use('/api/orders', ordenRoutes);
app.use('/api/blog', publicacionRoutes);


const port = process.env.PORT || 5001;

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto: ${port}`);
});
