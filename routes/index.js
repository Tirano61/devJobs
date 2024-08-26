

const express = require('express');
const homeController = require('../controllers/homeController')
const vacantesController = require('../controllers/vacanteController')

const router = express.Router();

module.exports = ()=> {
    router.get('/',  homeController.mostrarTrabajos);

    //! Crear vacantes
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);

    //! Mostrar Vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);
    //!Editar Vacante
    router.get('/vacantes/editar/:url', vacantesController.editarVacante);
    router.post('/vacantes/editar/:url', vacantesController.editarVacanteGuardar);

    
    return router;
}

