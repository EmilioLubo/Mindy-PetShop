const tableContainer = document.getElementById('tBody')
const totalContainer = document.getElementById('total')
const cartContainer = document.getElementById('cartContainer')
const cart = JSON.parse(localStorage.getItem('cart'))
let counted = cart.map(el =>{
    return {...el, cant: 1, subtotal: el.precio}
})
const clearCart = document.getElementById('clearCart')
clearCart.addEventListener('click', ev => {
    let array = JSON.parse(localStorage.getItem('cart'))
    if(array.length > 0){
    counted = []
    localStorage.setItem('cart', JSON.stringify(counted))
    pirntTable(counted, tableContainer)
    Toastify({
        text: "Productos eliminados",
        className: "danger",
        style: {
            background: "linear-gradient(90deg, rgba(4,1,0,1) 27%, rgba(237,11,11,1) 54%)",
        }
    }).showToast();
} else{
    Toastify({
        text: "Aún no tienes productos en el carrito",
        className: "danger",
        style: {
            background: "linear-gradient(90deg, rgba(4,1,0,1) 27%, rgba(237,11,11,1) 54%)",
        }
    }).showToast();
}
})
pirntTable(counted, tableContainer)
function pirntTable(array, container){
    if(array.length > 0){
    container.innerHTML = ''
    array.forEach(product => {
        container.innerHTML += 
        `<tr class="align-middle">
        <td>
        <p>${product.nombre}</p>
        </td>
        <td>
        <input type="number" id="${product._id}" class="input-table" min="1" max="${product.stock}" placeholder="1" value="${product.cant}">
            </td>
            <td>$ ${product.precio}</td>
            <td>$ ${product.subtotal}</td>
            <td>
            <button id=${product._id} type="button" class="btn-close btn-danger" aria-label="Close"></button>
            </td>
            </tr>`
        let totalCount = array.reduce((el1, el2) => el1 + el2.subtotal, 0)
        totalContainer.innerHTML = `$ ${totalCount}`
         
    })
    countEvent(array)
    closeEvent(array)
} else{
    container.innerHTML = `<td colspan="5"><h4 class="text-center">NO HAY PRODUCTOS EN EL CARRITO</h4></td>`
    totalContainer.innerHTML = ''
}
}
let buyCart = document.getElementById('buyCart')
buyCart.addEventListener('click', ev => {
    let array = JSON.parse(localStorage.getItem('cart'))
    if(array.length > 0){
    const ul = document.createElement('ul')
    ul.className = ''
    ul.innerHTML += `<h4>COMPRA REALIZADA</h4>`
    array.forEach(el => {
        ul.innerHTML += `<li>${el.nombre} x ${el.cant}</li>`
    })
    ul.innerHTML += `<li>TOTAL: $ ${array.reduce((el1, el2) => el1 + el2.subtotal, 0)}</li>
    <a href="../index.html" class=" mt-3 btn btn-buy-cart">Volver al Inicio</a>`
    cartContainer.innerHTML = ''
    cartContainer.appendChild(ul)
    localStorage.setItem('boughtCart', JSON.stringify(array))
    array = []
    localStorage.setItem('cart', JSON.stringify(array))
    Toastify({
        text: "¡Compra realizada!",
        className: "success",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
    } else{
        Toastify({
            text: "Aún no tienes productos en el carrito",
            className: "danger",
            style: {
                background: "linear-gradient(90deg, rgba(4,1,0,1) 27%, rgba(237,11,11,1) 54%)",
            }
        }).showToast();
    }
})
function countEvent(array){
    let counter = document.querySelectorAll('.input-table')
    counter.forEach(el => el.addEventListener('change', ev => {
    let i = array.findIndex(el => el._id === ev.target.id)
    if(ev.target.value <= array[i].stock && ev.target.value > 0){
    array[i].cant = ev.target.value
    array[i].subtotal = array[i].precio * array[i].cant
    console.log(array)
    localStorage.setItem('cart', JSON.stringify(array))
    pirntTable(array, tableContainer)
    }}))
}
function closeEvent(array){
    let closeBtn = document.querySelectorAll('.btn-close')
    closeBtn.forEach(el => el.addEventListener('click', ev => {
        array = array.filter(el => el._id != ev.target.id)
        localStorage.setItem('cart', JSON.stringify(array))
        pirntTable(array, tableContainer)
        Toastify({
            text: "Producto eliminado",
            className: "danger",
            style: {
                background: "linear-gradient(90deg, rgba(4,1,0,1) 27%, rgba(237,11,11,1) 54%)",
            }
        }).showToast();
    }))
}