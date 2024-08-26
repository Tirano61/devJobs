


document.addEventListener('DOMContentLoaded', () =>{
    const skills = document.querySelector('.lista-conocimientos');

    if(skills){
        skills.addEventListener('click', agregarSkils);
        //! Una vez que estamos en editar llamar la funcion
        skillSeleccionados();
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