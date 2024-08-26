


const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

mongoose.connect(process.env.DATABASE, {});

mongoose.connection.on('error', (error)=>{
    console.log(error);
});

//! importar los modelos 
require('../models/vacantes');
require('../models/usuarios');
