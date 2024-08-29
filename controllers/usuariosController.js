
const multer = require("multer");
const Usuarios = require("../models/usuarios")
const { body, validationResult } = require('express-validator');
const shortid = require('shortid');


exports.formCrearCuenta = (req, res) =>{
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagline: 'Comienza a publicaar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.crearUsuario = async(req, res, next) =>{
    //! Crear Usuario
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();

        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta')
    }

}

exports.validarRegistro = async (req, res, next) =>{

    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),
        body('password').not().isEmpty().withMessage('El password es obligatorio').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar password es obligatorio').escape(),
        body('confirmar').equals(req.body.password).withMessage('Los passwords no son iguales').escape(),
    ]

    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea una cuenta en Devjobs errores',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        })
        return;
    }
    
    //si toda la validacion es correcta
    next();
}

exports.formIniciarSesion = async (req, res, next) =>{
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs',

    });
}

//! Formulario editar perfil
exports.formEditarPerfil = (req, res, next) =>{
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en DevJobs',
        cerrarSesion: true,
        nombre: req.user.nombre,
        usuario: req.user.toObject()
    })
}

//! Guardar cambios editar perfil
exports.editarPerfil = async(req, res) =>{
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    console.log(req.file);
    return;
    if(req.body.password){
        usuario.password = req.body.password;
    }
    await usuario.save();
    req.flash('correcto', 'Cambios guardados correctamente')
    res.redirect('/administracion');
}

//! Sanitizar y Validar Formulario de Editar Perfiles
exports.validarPerfil = async(req, res) =>{
    console.log(`${req.body.nombre}; ${req.body.email}`);
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),
    ]

    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (errores) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('editar-perfil', {
            nombrePagina: 'Editar Perfil',
            tagline: 'Edita tu perfil en DevJobs',
            mensajes: req.flash(),
            cerrarSesion: true,
            nombre: req.user.nombre
        })
        return;
    }
    
    //si toda la validacion es correcta
    next();
}

//! Subir imagen de perfil
exports.subirImagen = (req, res, next) =>{
    upload(req, res, function(error){
        if(error instanceof multer.MulterError){
            return next();
        }
    });
    next();
}

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename: (req, file, cb) =>{
            const extencion = file.mimetype.split('/')[1];
            const nombre = `${shortid.generate()}.${extencion}`;
            
            cb(null, nombre);
        }
    }),
    fileFilter(req, file, cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            console.log('Entro al filter true');
            cb(null, true);
        }else{
            console.log('Entro al filter false');
            cb(null, false);
        }
    }
}
const upload = multer(configuracionMulter).single('image');
