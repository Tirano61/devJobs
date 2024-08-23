

exports.mostrarTrabajos = (req,res) => {
    res.render('home',{
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Publica Trabajos para Desarrolladores',
        barra: true,
        boton: true
    })
}

