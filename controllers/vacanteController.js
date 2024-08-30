
const multer = require('multer');
const Vacante = require('../models/vacantes');
const { body, validationResult } = require("express-validator");
const shortid = require('shortid');
const { cerrarSesion } = require('./authController');



exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        pagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
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
exports.mostrarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url}).populate('autor').lean();
    //! si no hay resultados
    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true,
        
    });
}

exports.editarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({url: req.params.url}).lean();

    if(!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
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

exports.eliminarVacante = async (req,res) => {
    const { id } = req.params;
    const vacante = await Vacante.findById(id);
    if(verificarAutor(vacante, req.user)){
        //! Todo bien eliminar
        await vacante.deleteOne();
        res.status(200).send('Vacante eliminada correctamente!!!');
    }else{
        //! No es el autor
        res.status(403).send('Error');
    }
}    

const verificarAutor = (vacante = {}, usuario = {}) => { 
    if(!vacante.autor.equals(usuario._id)){
        return false;
    }
    return true;
}

exports.subirCV = (req, res, next) => {
    upload(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande, max: 100kb');
                }else {
                    req.flash('error', error.message);
                }
                return next();
            }else{
                req.flash('error', error.message);
            }
            res.redirect('back')
            return;
        }else{
            return next();
        }
        
    });
}

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        limits: { fileSize: 100000 },
        destination: (req, file, cb) =>{
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename: (req, file, cb) =>{
            const extencion = file.mimetype.split('/')[1];
            const nombre = `${shortid.generate()}.${extencion}`;
            
            cb(null, nombre);
        },
        
    }),
    fileFilter(req, file, cb){
        if(file.mimetype === 'application/pdf'){
            cb(null, true);
        }else{
            cb(new Error('Formato no válido'), false);
        }
    },
    
}

const upload = multer(configuracionMulter).single('cv');

//! Almacenar los candidatos en la base de datos
exports.contactar = async (req, res, next) => {
    
    const vacante = await Vacante.findOne({ url: req.params.url });

    //! Si ni existe la vacante nos salimos
    if(!vacante) return next();
    
    //! Si esta bien construir el nuevo objeto
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }

    //! Almacenar la vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();
    
    //! Mensaje flash y redireccion
    req.flash( 'correcto', 'Se envio tu curriculum correctamente' );

    res.redirect('/');

}

exports.mostrarCandidatos = async (req,res) =>{
    const vacante = await Vacante.findById( req.params.id).lean();

    if(vacante.autor != req.user._id.toString()){
        return next();
    }

    if(!vacante) return next();
    res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        imagen: req.user.imagen,
        nombre: req.user.nombre,
        candidatos: vacante.candidatos
    })

    
}