
const mongoose = require('mongoose');
const shortid = require('shortid');
const slug = require('slug');


const vacantesSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: 'El nombre de la vacante es requerido',
        trim: true,
    },
    empresa:{
        type: String,
        trim: true,
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'La ubicación es obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true,
    },
    contrato: {
        type: String,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        lowercase: true,
    },
    skills: {
        type: [String],
    },
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El autor es obligatorio'
    }
});


vacantesSchema.pre('save', function(next){
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`;
    next();
})

//! Crear un indice para la busqueda
vacantesSchema.index({titulo: 'text'});


module.exports = mongoose.model( 'Vacante', vacantesSchema );