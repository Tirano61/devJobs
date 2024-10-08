
import axios from 'axios';
import Swal from 'sweetalert2';


document.addEventListener('DOMContentLoaded', () =>{
    const skills = document.querySelector('.lista-conocimientos');

    //! Limpiar las alertas
    let alertas = document.querySelector('.alertas');
    if(alertas){
        limpiarAlertas();
    }

    if(skills){
        skills.addEventListener('click', agregarSkils);
        //! Una vez que estamos en editar llamar la funcion
        skillSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion');
    if(vacantesListado){
        vacantesListado.addEventListener('click', accionesListado);
    }
})
const skillsPrototype = new Set();
const agregarSkils = (e) =>{
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            skillsPrototype.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            skillsPrototype.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    const skillsArray = [...skillsPrototype];
    document.querySelector('#skills').value = skillsArray;
}

const skillSeleccionados = ()=>{
    const selsccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    selsccionadas.forEach(seleccionada =>{
        skillsPrototype.add(seleccionada.textContent);
    });
    //! Inyectarlo en el hidden
    const skillsArray = [...skillsPrototype];
    document.querySelector('#skills').value = skillsArray;
    
}

const limpiarAlertas = () =>{
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if(alertas.children.length > 0){
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length === 0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 1500);
}

//! Eliminar vacante
const accionesListado = e => {
    e.preventDefault();
     
  
   
    
    if(e.target.dataset.eliminar){
        //! Eliminar por axios
        Swal.fire({
            title: "Confirmar eliminación?",
            text: "Una vez eliminada no se puede recuperar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar!",
            cancelButtonText: "No, Cancelar!"
          }).then((result) => {
            if (result.isConfirmed) {
              //! Enviar la peticion  con axios
              const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
              //! Axios para eliminar el registro
              axios.delete(url, {params: {url}})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        Swal.fire({
                            title: "Eliminado!",
                            text: respuesta.data,
                            icon: "success"
                        });
                        //! TODO: Eliminar del DOM
                        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);

                    }
                })
                .catch(() => {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar'
                    })
                })
              
            }
          });
    }else if(e.target.tagName === 'A'){
        window.location.href = e.target.href;
    }
    
}