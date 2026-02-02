require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const connectDB = require('./config/database');
const fs = require('fs');
const path = require('path');

const importarDatos = async () => {
    try {
        // Conectar a la BD
        await connectDB();

        // Leer el archivo JSON del frontend original
        // Ajusta esta ruta si es necesario, pero debería ser correcta según tu info anterior
        const rutaArchivo = path.join(__dirname, '../mundo_digital_2/src/data/products.json');
        const data = fs.readFileSync(rutaArchivo, 'utf-8');
        const productos = JSON.parse(data);

        // Borrar datos anteriores para no duplicar
        await Producto.deleteMany();
        console.log('Datos anteriores eliminados...');

        // Insertar los nuevos
        await Producto.insertMany(productos);
        console.log('¡Productos importados correctamente a MongoDB!');

        // Importar Publicaciones (Blog)
        const Publicacion = require('./models/Publicacion');
        // await Publicacion.deleteMany(); // Opcional

        const publicacionesCheck = await Publicacion.find();
        if (publicacionesCheck.length === 0) {
            const samplePosts = [
                {
                    title: "El Futuro del Gaming: RTX 5000 Series",
                    excerpt: "Todo lo que necesitas saber sobre la próxima generación de tarjetas gráficas NVIDIA.",
                    content: "Lorem ipsum content full text about RTX 5000...",
                    author: "Mundo Digital Team",
                    image: "https://images.unsplash.com/photo-1593305841991-05c2973656ee?auto=format&fit=crop&q=80&w=1000",
                    date: new Date()
                },
                {
                    title: "Top 5 Laptops para Programar en 2024",
                    excerpt: "Una guía detallada para elegir tu próxima herramienta de trabajo.",
                    content: "Full guide about laptops...",
                    author: "Code Master",
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000",
                    date: new Date()
                },
                {
                    title: "Inteligencia Artificial en tu Bolsillo",
                    excerpt: "Cómo los nuevos procesadores móviles están cambiando el juego.",
                    content: "AI mobile content...",
                    author: "Tech Insider",
                    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
                    date: new Date()
                }
            ];
            await Publicacion.insertMany(samplePosts);
            console.log('¡Publicaciones de Blog creadas!');
        } else {
            console.log('Publicaciones ya existen, saltando carga inicial de blog.');
        }

        // Crear Usuario Admin por defecto
        const Usuario = require('./models/Usuario');
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
