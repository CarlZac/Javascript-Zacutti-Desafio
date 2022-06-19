//Fetch de JSON Productos
async function traerProductos() {
    const respuesta = await fetch('./js/productos.json');
    const data = await respuesta.json();
    renderProductos(data);
    let cart = localStorage.getItem("cart");
    !cart && crearCarrito(data);
}

traerProductos()

//Funcionamiento del Carrito y Render de Productos
const agregarProducto = (index) =>{
    let cart = JSON.parse(localStorage.getItem('cart'));
    let cartContent = [];
    if(cart){
        for (const element of cart){
            element.id == index && element.cantidad ++;
            cartContent.push(element);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartContent));
}

const cargarEventos = () =>{
    let btnClass = document.getElementsByClassName('btnJs');
    for (let i = 0; i < btnClass.length; i++){
        let item = document.getElementsByClassName('btnJs')[i];
        item.addEventListener('click', ()=>{
            agregarProducto (item.id);
            Toastify({
                text: `Agregaste una botella con éxito a tu carrito!`,
                duration: 2000,
                className: "info",
                style: {
                    background: '#BA9C53',
                    color:'#242323',
                },
            }).showToast();
        });
    }
}

const crearCarrito = (array) =>{
    let cart = [];
    for (const producto of array){
        cart.push({   
            id:producto.id,
            estilo:producto.estilo,
            precio:producto.precio,
            img:producto.img,
            volumen:producto.volumen,
            cantidad:0
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

const renderProductos = (array) => {
    let divId = document.getElementById('productos')
    for (const element of array) {
        let div = document.createElement('div');
        div.className = 'tienda col-md-4 col-lg-3 m-4';
        div.innerHTML = `
		<article class="bgBlack py-4 textCenter">
			<h3>${element.estilo}</h3>
			<img src="${element.img}" alt="Botella de ${element.estilo} Trippelheim" class="rounded img-fluid">
			<p class="textIvory">Botella x ${element.volumen}ml - $${element.precio}</p>
            <button class="btnJs btn btnGold" id="${element.id}" type="button">Agregar al Carrito</button>
        </article>
        `
        divId.append(div)
    }
    cargarEventos();
}

//Vista dentro del Carrito
let toggle = document.querySelectorAll('.toggles');

function mostrarCarrito(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

function resetCartDiv(id){
    document.getElementById(id).innerHTML = '';
}

//Botón para ver el carrito
let btnCarrito = document.getElementById('carrito');
btnCarrito.addEventListener('click', ()=>{
    renderCarrito();
    mostrarCarrito(toggle, 'd-none')
});

//Botón para volver del carrito
let btnCarritoBack = document.getElementById('carritoBack');
btnCarritoBack.addEventListener('click', ()=>{
    mostrarCarrito(toggle, 'd-none');
    resetCartDiv('contenidoCarrito');
});

//Botón Comprar
let btnComprar = document.getElementById('comprar');
btnComprar.addEventListener('click', ()=>{
    let carrito = JSON.parse(localStorage.getItem('cart'));
    let total = '';
    let compra = 0;
    for (const producto of carrito){
        total = compra+= (producto.precio * producto.cantidad);
    }
    Swal.fire({
        title: `El total de su compra es de $${total}.`,
        icon: 'warning',
        iconColor: '#BA9C53',
        text: '¿Desea continuar con la compra?',
        background: '#242323',
        color: '#FFFFF0',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result)=>{
        if(result.isConfirmed){
            Swal.fire({
                title: '¡Muchas Gracias por su Compra!',
                icon: 'success',
                text: 'La compra se ha realizado con éxito!',
                background: '#242323',
                color: '#FFFFF0',
            }).then((result)=>{
                if (result.isConfirmed){
                    localStorage.removeItem('cart');
                    location.reload()
                }
            })
        }
    })
})

const quitarProducto = (index) =>{
    let cart = JSON.parse(localStorage.getItem('cart'));
    let cartContent = [];
    if(cart){
        for (const element of cart){
            element.id == index && element.cantidad --;
            cartContent.push(element);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartContent));
}

const eventoBorrar = () =>{
    let btnClass = document.getElementsByClassName('btnJsDel');
    for (let i = 0; i < btnClass.length; i++){
        let item = document.getElementsByClassName('btnJsDel')[i];
        item.addEventListener('click', ()=>{
            quitarProducto (item.id);
            mostrarCarrito(toggle, 'd-none');
            resetCartDiv('contenidoCarrito');
            Toastify({
                text: `Eliminaste una botella con éxito de tu carrito!`,
                duration: 2000,
                className: "info",
                style: {
                    background: '#BA9C53',
                    color:'#242323',
                },
            }).showToast();
        });
    }
}

const renderCarrito = () => {
    let divCarrito = document.getElementById('contenidoCarrito')
    let cart = JSON.parse(localStorage.getItem('cart'));
    for (const element of cart) {
        let div = document.createElement('div');
        if(element.cantidad > 0){
            div.className = 'tienda col-md-4 col-lg-3 m-4';
            div.innerHTML = `
		    <article class="bgBlack py-4 textCenter">
			    <h3>${element.estilo}</h3>
			    <img src="${element.img}" alt="Botella de ${element.estilo} Trippelheim" class="rounded img-fluid">
			    <p class="textIvory">Botella x ${element.volumen}ml - $${element.precio}</p>
                <p class="textIvory">Cantidad en el Carrito: ${element.cantidad}</p>
                <button class="btnJsDel btn btnGold" id="${element.id}" type="button">Quitar del Carrito</button>
            </article>
            `
            divCarrito.append(div)
        }
    }
    eventoBorrar();
}