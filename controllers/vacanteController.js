
const Vacante = require('../models/vacantes');

exports.formularioNuevaVacante = (req, res) =>{
    res.render('nueva-vacante', {
        pagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    });
} 

//! Agrega las vacantes a la base de datos
exports.agregarVacante = async (req, res) =>{
    const vacante = new Vacante(req.body);
    //! Usuario autor de la vacante
    vacante.autor = req.user._id;
    //!Crear arreglo de skills
    vacante.skills = req.body.skills.split(',');
    //! Almacenarlo en la base de datos
    console.log(vacante);
    const nuevaVacante = await vacante.save();
    //! redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}
//! Mostrar Vacante
exports.mostrarVacante = async(req, res, next) =>{
    const vacante = await Vacante.findOne({url: req.params.url}).lean();
    //! si no hay resultados
    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    });
}

exports.editarVacante = async(req, res, next) =>{
    const vacante = await Vacante.findOne({url: req.params.url}).lean();

    if(!vacante) return next();

    res.render('editar-vacante',{
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
    });
}

exports.editarVacanteGuardar = async (req, res) =>{
    const vacanteactualizada = req.body;
    vacanteactualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteactualizada, {
        new: true,
        runValidators: true
    });

    res.redirect(`/vacantes/${vacante.url}`);


}
