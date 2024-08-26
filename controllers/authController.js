const passport = require("passport")


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

exports.mostrarPanel = (req, res, next) =>{
    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        tagline: 'Crea y administra tus vacantes desde aquí'
    })
}
