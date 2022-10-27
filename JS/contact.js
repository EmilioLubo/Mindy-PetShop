const formButtonSend = document.getElementById("form")
let users = JSON.parse(localStorage.getItem("users")) || [ ]

formButtonSend.addEventListener ("submit",(ev) => {
  ev.preventDefault()
    let user = { 
        nombre: ev.target.nombre.value ,
        apellido: ev.target.apellido.value ,
        email: ev.target.email.value,
        tel: ev.target.tel.value,
        nombreMasc: ev.target.nombreMascota.value,
        tipoMasc: ev.target.tipoMascota.value,
        mensaje: ev.target.mensaje.value,
    }
    users.push(user)
    localStorage.setItem("users",JSON.stringify(users) )
    Toastify({
        text: "Info enviada",
        className: "success",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
      
      ev.target.reset()


} )