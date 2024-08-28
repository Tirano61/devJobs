

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const usuarioSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
});

//! Metodo para hashear los passwords
usuarioSchema.pre('save', async function(next){
    //! si el password ya esta hasheado 
    if(!this.isModified('password')){
        return next();
    }
    //! Si no esta hasheado
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
//! Envia alerta cuando un usuario ya está registrado
usuarioSchema.post('save', function(error, doc, next){
    if(error.name === 'MongoServerError' && error.code === 11000){
        next('Ese correo ya está registrado');
    }else{
        next(error);
    }
});
//!Autenticar usuarios
usuarioSchema.methods = {
    compararPassword: function (password){
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuarioSchema);