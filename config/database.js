const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async() => {

    try{

        //Si no me puedo conectar
        if(!process.env.MONGODB_URI){
            throw new Error('NO se pudo conectar');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        return mongoose.connection;

    }catch(error){
        console.error("Error al conectar",error.message);
        process.exit(1);
    }
}

module.exports = connectDB;