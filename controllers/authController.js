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

exports.mostrarPanel = async (req, res, next) =>{
    //! Consultar el usuario autenticado,  
    //! Se le agrego el .lean() para que pase los datos a la vista
    const vacantes = await Vacante.find({autor: req.user._id}).lean();

    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y administra tus vacantes desde aquí',
        cerrarSesion: true,
        nombre: req.user.nombre,
        vacantes

    })
}

exports.cerrarSesion = (req, res) =>{
    req.logout(function(err){
        if(err) {
            return next(err);
        }
        return res.redirect('/iniciar-sesion')
    });
}