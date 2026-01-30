require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/producto');
const connectDB = require('./config/database');
const fs = require('fs');
const path = require('path');

const importarDatos = async () => {
    try {
        // Conectar a la BD
        await connectDB();

        // Leer el archivo JSON del frontend original
        // Ajusta esta ruta si es necesario, pero debería ser correcta según tu info anterior
        const rutaArchivo = 'C:/Users/adria/Desktop/mundo_digital_2/src/data/products.json';
        const data = fs.readFileSync(rutaArchivo, 'utf-8');
        const productos = JSON.parse(data);

        // Borrar datos anteriores para no duplicar
        await Producto.deleteMany();
        console.log('Datos anteriores eliminados...');

        // Insertar los nuevos
        await Producto.insertMany(productos);
        console.log('¡Productos importados correctamente a MongoDB!');

        // Crear Usuario Admin por defecto
        const Usuario = require('./models/usuario');
        const bcrypt = require('bcrypt');

        // Borrar usuarios anteriores (opcional, cuidado con esto en prod)
        // await Usuario.deleteMany(); 

        const adminExistente = await Usuario.findOne({ email: 'admin@mundodigital.com' });

        if (!adminExistente) {
            const salt = await bcrypt.genSalt(10);
            const passwordEncriptada = await bcrypt.hash('admin123', salt);

            await Usuario.create({
                nombre: 'Admin Demo',
                email: 'admin@mundodigital.com',
                password: passwordEncriptada,
                role: 'ADMIN'
            });
            console.log('¡Usuario Admin creado: admin@mundodigital.com / admin123!');
        } else {
            console.log('El usuario admin ya existe.');
        }

        process.exit();
    } catch (error) {
        console.error('Error al importar datos:', error);
        process.exit(1);
    }
};

importarDatos();
