
const Vacante = require('../models/vacantes');
const { body, validationResult } = require("express-validator"); 

exports.formularioNuevaVacante = (req, res) =>{
    res.render('nueva-vacante', {
        pagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
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

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre
    });
}

exports.editarVacanteGuardar = async (req, res) => {
    const vacanteactualizada = req.body;
    vacanteactualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteactualizada, {
        new: true,
        runValidators: true
    });
    res.redirect(`/vacantes/${vacante.url}`);
}

//! Validar y sanitizar las nuevas vacantes
exports.validarVacante = async (req, res, next) => {
    const rules = [
        body("titulo").not().isEmpty().withMessage("Agrege un titulo a la publicación").escape(),
        body("empresa").isEmail().withMessage("Agrege la compania").escape(),
        body("ubicacion").not().isEmpty().withMessage("Agrege la ubicación").escape(),
        body("contrato").not().isEmpty().withMessage("Seleccione tipo de contrato").escape(),
        body("skills").not().isEmpty().withMessage("Agrege skills").escape(),
      ];
      await Promise.all(rules.map((validation) => validation.run(req)));
      const errors = validationResult(req);
  
 
  if (errors) {
    // Recargar pagina con errores
    req.flash(
      "error",
      errors.array().map((error) => error.msg)
    );
    res.render("nueva-vacante", {
      nombrePagina: "Nueva Vacante",
      tagline: "Llena el formulario y publica tu vacante",
      cerrarSesion: true,
      usuario: req.user.name,
      mensajes: req.flash()
    });
    return;
  }
  next();
};

exports.eliminarVacante = async (req,res) =>{
    const { id } = req.params;
    console.log(`No llego una bosta de id : ${id}`);
}
