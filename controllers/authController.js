const passport = require("passport");
const Vacante = require('../models/vacantes');
const Usuarios = require("../models/usuarios");
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');



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
        imagen: req.user.imagen,
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

exports.formReestablecerPassword = (req, res) =>{
    res.render('reestablecer-password', {
        nombrePagina: 'Reestablece tu password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, ingresa tu email'
    })
}

//! genera el token en la tabla usuarios
exports.enviarToken = async (req, res) =>{
    console.log(req.body);
    const usuario = await Usuarios.findOne({ email: req.body.email });
    console.log(usuario);
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }
    //! el usuario existe generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;
    //! Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    console.log(resetUrl);

 
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        resetUrl,
        archivo: 'reset'
    })

    req.flash('correcto', 'Revisa tu email para las indicaciones')
    res.redirect('/iniciar-sesion')

}

//! Valida si el token es valido y si el usuario existe
exports.reestablecerPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
         token: req.params.token,
         expira:{
            $gt: Date.now()
         }
    }).lean();
    
    if(!usuario){
        req.flash('error', 'El formulario no es válido');
        return res.redirect('/reestablecer-password');
    }
    res.render('nuevo-password',{
        nombrePagina: 'Ingresa tu nuevo password'
    })
}

//! Almacena el nuevo password en la base de datos
exports.guardarPassword = async (req, res) => {
    const pass = req.body.password;
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira:{
           $gt: Date.now()
        }
    });

   // no existe el usuario o token invalido
    if(!usuario){
        req.flash('error', 'El formulario no es válido');
        return res.redirect('/reestablecer-password');
    }
    console.log(req.body);
    //!Agregar y eliminar valores del objeto
    usuario.password =  pass;
    usuario.token = undefined;
    usuario.expira= undefined;
    //! almacenar los valores nuevos
    await usuario.save()

    req.flash('correcto', 'Password modificado correctamente' );

    res.redirect('/iniciar-sesion');

}