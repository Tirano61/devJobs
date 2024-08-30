

const express = require('express');
const homeController = require('../controllers/homeController')
const vacantesController = require('../controllers/vacanteController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')

const router = express.Router();

module.exports = ()=> {
    router.get('/',  homeController.mostrarTrabajos);

    //! Crear vacantes
    router.get('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.agregarVacante
    );
    //! Mostrar Vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //!Editar Vacante
    router.get('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.editarVacante
    );
    router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.editarVacanteGuardar
    );
    //! Eliminar vacante
    router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante);


    //! crear Cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
        usuariosController.validarRegistro,
        usuariosController.crearUsuario
    );
    //! Autentuicar usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario); 

    //! Resetear password (email)
    router.get('/reestablecer-password',authController.formReestablecerPassword);
    router.post('/reestablecer-password', authController.enviarToken);

    //! Resetear password almacnar en la base de datos
     router.get('/reestablecer-password/:token', authController.reestablecerPassword);
     router.post('/reestablecer-password/:token', authController.guardarPassword);
    
    //! Cerrar Sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)

    //! Panel de Administracion
    router.get('/administracion', 
        authController.verificarUsuario,
        authController.mostrarPanel
    );
    //! Editar Perfil
    router.get('/editar-perfil', 
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    )
    //! Update del perfil de usuario
    router.post('/editar-perfil',
        authController.verificarUsuario,
        //usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    )

    //! Recibir mensajes de candidatos
    router.post('/vacantes/:url',
        vacantesController.subirCV,
        vacantesController.contactar
    );

    //! Candidatos
    router.get('/candidatos/:id',
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos
    )


    
    return router;
}

