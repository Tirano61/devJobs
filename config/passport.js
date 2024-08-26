

const mongoose = require('mongoose');
const passport = require('passport');
const Usuarios = mongoose.model('Usuarios');
const LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done) =>{
    const usuario = await Usuarios.findOne({email});
    if(!usuario) return done(null, false, {
        message: 'Credenciales incorrectas',
    });
    //! Si el usuario existe vamos a verificarlo
    const verificarPassword = usuario.compararPassword(password);
    if(!verificarPassword) return done(null, false, {
        message: 'Credenciales incorrectas',
    });
    //! El usuario existe y password correcto
    return done(null, usuario);
}));

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async(id, done) =>{
    const usuario  = Usuarios.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;