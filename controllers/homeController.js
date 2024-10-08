
const Vacante = require('../models/vacantes')


exports.mostrarTrabajos = async(req,res, next) => {
    const vacantes = await Vacante.find().lean();

    if(!vacantes) return next();

    res.render('home',{
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Publica Trabajos para Desarrolladores',
        barra: true,
        boton: true,
        vacantes
    })
}

