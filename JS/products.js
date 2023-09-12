const remediesContainer = document.getElementById('remediesContainer')
const toysContainer = document.getElementById('toysContainer')
const rangeContainer = document.getElementById('rangeContainer')
let storage = localStorage.getItem('cart')
let cart = JSON.parse(storage) || []
let filterProducts
let applied = {}
let rangeValue
getProducts(remediesContainer, toysContainer, cart)
async function getProducts(container1, container2, array){
    try{
        const res = await fetch('../data/data.json')
        const {response} = await res.json()
        let filteredData
        if(remediesContainer){
            filteredData = response.filter(prod => prod.tipo.toLowerCase() === 'medicamento')
        } else if(toysContainer){
            filteredData = response.filter(prod => prod.tipo.toLowerCase() === 'juguete')
        }
        renderRange(filteredData, rangeContainer)
        buildGallery(filteredData, container1 || container2)
        buildFilters(filteredData, container1 || container2)
        toCart(filteredData)

    } catch(err){
        console.log(`Error. ${err.message}`)
    }
}
function renderRange(array, container){
    const maxPrice = array.sort((el1, el2) => el2.precio - el1.precio)[0]
    const minPrice = array[array.length - 1]
    container.innerHTML = 
    `<h6 class=" text-center mt-1">Rango de precio</h6>
    <label for="customRange1" class="form-label align-self-center"></label>
    <input type="range" class="form-range w-75 align-self-center" min="${Math.round((minPrice.precio + 100) / 100) * 100}" max="${maxPrice.precio + 200}" step="100"
      id="customRange1" oninput="this.nextElementSibling.value = this.value">
    <output id="amount" name="amount" for="rangeInput"
      class="align-self-center m-1 fw-bold">${(Math.round((maxPrice.precio + 200) / 100) / 2) * 100}</output>`
}
function buildGallery(array, container){
    container.innerHTML = ''
    array.forEach(el => {
        let reference = cart.find(prod => prod._id === el._id)
        container.innerHTML += 
        `<div class="card" style="width: 24rem;">             
        <img src="${el.imagen}" class="card-img-top" alt="${el.nombre}">             
        <div class="card-body d-flex flex-column">               
          <h5 class="card-title">${el.nombre}</h5>               
          <p class="card-text">${el.descripcion}</p>               
          <p class="card-text">precio: $ ${el.precio}</p>           
          <p class="card-text" ${el.stock < 3 ? 'style="color: red;"' : ''} >stock: ${el.stock} ${el.stock < 3 ? '¡últimas unidades!' : ''}</p>               
          </div>         
          <div class="d-flex justify-content-center">
            <button id="${el._id}" class="btn btn-card align-self-center mb-2" style="background-color: ${reference ? '#e8472b' : '#4e6c50'};">${reference ? 'Quitar del carrito' : 'Agregar al carrito'}</button>              
          </div>               
        </div>`
    });
}
function buildFilters(array, container){
    const searchInput = document.getElementById('searchLocation')
    const rangeInput = document.getElementById('customRange1')
    searchInput.addEventListener('keyup', ev =>{
        const search = ev.target.value
        filterProducts = filterManager(array, 'isSearched', search)
        filterProducts.length === 0 ? container.innerHTML = `<h4 class="text-center text-danger">NO HAY PRODUCTOS QUE COINCIDAN CON SU BUSQUEDA</h4>` : buildGallery(filterProducts, container)
        toCart(filterProducts)
    })
    rangeInput.addEventListener('change', ev => {
        const maxInput = ev.target.value
        filterProducts = filterManager(array, 'isRanged', maxInput)
        filterProducts.length === 0 ? container.innerHTML = `<h4 class="text-center text-danger">NO HAY PRODUCTOS QUE COINCIDAN CON SU BUSQUEDA</h4>` : buildGallery(filterProducts, container)
        toCart(filterProducts)
    })
}
function filterManager(array, action, value){
    filterProducts = array.slice()
    applied[action] = value.toLowerCase()
    action === 'isRanged' ? rangeValue = value : ''
    for(let name in applied){
        if(name === 'isRanged'){
            filterProducts = filterProducts.filter(product => product.precio <= rangeValue)
        }
        if(name === 'isSearched')
        filterProducts = filterProducts.filter(product => product.nombre.toLowerCase().includes(applied[name].toLowerCase()))
    }
    return filterProducts
}
function toCart(array){
    let cartButton = document.querySelectorAll('.btn-card')
    cartButton.forEach(el => el.addEventListener('click', ev => {
        let product = array.find(prod => prod._id === ev.target.id)
        let reference = cart.find(prod => prod._id === product._id)
        if(reference){
            cart = cart.filter(prod => prod._id !== ev.target.id)
            ev.target.style.backgroundColor = '#4e6c50'
            ev.target.innerHTML = 'Agregar al carrito'
            localStorage.setItem('cart', JSON.stringify(cart))
            Toastify({
                text: "Producto eliminado",
                className: "danger",
                style: {
                  background: "linear-gradient(90deg, rgba(4,1,0,1) 27%, rgba(237,11,11,1) 54%)",
                }
              }).showToast();
        }else{
            ev.target.style.backgroundColor = '#e8472b'
            ev.target.innerHTML = 'Quitar del carrito'
            cart.push(product)
            localStorage.setItem('cart', JSON.stringify(cart))
            Toastify({
                text: "Producto agregado",
                className: "success",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
              }).showToast();
        }
    }))
}