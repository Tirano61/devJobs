const passport = require("passport");
const Vacante = require('../models/vacantes');



exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});
//! Revisar si el usuario está autenticado
exports.verificarUsuario = (req, res, next) =>{
    //! revisar el usuario
    if(req.isAuthenticated()){
        return next();
    }
    //! redireccionar
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async(req, res, next) =>{
    //! Consultar el usuario autenticado
    const vacantes = await Vacante.find({autor: req.user._id});

    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y administra tus vacantes desde aquí',
        vacantes
    })
};
