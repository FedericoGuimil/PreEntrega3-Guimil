let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");

fetch("./JS/productos.json")
    .then(response => response.json())
    .then(data => {
        data.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="producto-img" src=${producto.img}>
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
            `;
        
            let button = document.createElement("button");
            button.classList.add("producto-btn");
            button.innerText = "Agregar al carrito";
            button.addEventListener("click", () => {
                agregarAlCarrito(producto);
            })
        
            div.append(button);
        
            contenedorProductos.append(div);
        });

    })

actualizarCarrito();

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>Cant: ${producto.cantidad}</p>
                <p>Subt: $${producto.precio * producto.cantidad}</p>
            `;

            let buttonAumentar = document.createElement("button");
            buttonAumentar.classList.add("carrito-producto-btn");
            buttonAumentar.innerText = "➕";
            buttonAumentar.addEventListener("click", () => {
                aumentarCantidad(producto);
            })
            div.append(buttonAumentar);

            let buttonReducir = document.createElement("button");
            buttonReducir.classList.add("carrito-producto-btn");
            buttonReducir.innerText = "➖";
            buttonReducir.addEventListener("click", () => {
                reducirCantidad(producto);
            })
            div.append(buttonReducir);

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "✖️";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(button);
            carritoProductos.append(div);
        });
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    let itemEncontrado = carrito.find((item) => item.id === producto.id);

    if (itemEncontrado) {
        itemEncontrado.cantidad++;  
    } else {
        carrito.push({...producto, cantidad: 1});
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Se ha agregado el producto a su carrito",
            showConfirmButton: false,
            timer: 1600
          });
    }

    actualizarCarrito();
}

function borrarDelCarrito(producto) {
    let indice = carrito.findIndex((item) => item.id === producto.id);
    carrito.splice(indice, 1);

    actualizarCarrito();
}


function actualizarTotal() {
    let total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = `$${total}`;
}

function aumentarCantidad(producto) {
    let itemEncontrado = carrito.find((item) => item.id === producto.id);
    itemEncontrado.cantidad++;

    actualizarCarrito();
}

function reducirCantidad(producto) {
    let itemEncontrado = carrito.find((item) => item.id === producto.id);

    if (itemEncontrado.cantidad >= 2) {
        itemEncontrado.cantidad--;
        actualizarCarrito();
    } else {
        borrarDelCarrito(itemEncontrado);
    }
}

function vaciarCarrito() {
    Swal.fire({
        position: "center",
        icon: "warning",
        title: "Ha vaciado su carrito",
        showConfirmButton: false,
        timer: 1600
      });
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}