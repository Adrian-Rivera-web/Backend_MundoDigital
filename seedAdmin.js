const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('./models/Usuario');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Conectado a MongoDB ---');

        const email = 'admin@mundodigital.com';
        const password = 'admin123'; // Puedes cambiar esto
        const nombre = 'Administrador Sistema';

        // 1. Verificar si ya existe
        let admin = await Usuario.findOne({ email });

        if (admin) {
            console.log(`El usuario ${email} ya existe.`);
            // Actualizar a ADMIN si no lo es
            if (admin.role !== 'ADMIN') {
                admin.role = 'ADMIN';
                await admin.save();
                console.log('¡Actualizado a ROL ADMIN!');
            } else {
                console.log('Ya tiene ROL ADMIN.');
            }
        } else {
            // 2. Crear nuevo admin
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            admin = await Usuario.create({
                nombre,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                rut: '1-9',
                phone: '123456789'
            });
            console.log('--- Usuario Admin Creado ---');
            console.log(`Email: ${email}`);
            console.log(`Pass: ${password}`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
