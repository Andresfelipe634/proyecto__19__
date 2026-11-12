const btnAdd = document.getElementById("btn-add");
const board = document.getElementById("board");
let carrilesGuardados = JSON.parse(localStorage.getItem("carriles")) || [];

btnAdd.addEventListener("click", () => {

    

    //el resultado del prompt se guarda en la variable 
    const subredditName = prompt("ingrese un numero del 1 al 10:");

    if (!subredditName || subredditName.trim() === "") {
        return; // Si el usuario cancela o ingresa un valor vacío, no hacemos nada


    }
    const cleanName = subredditName.trim();

if (carrilesGuardados.includes(cleanName)) {
    alert("Ese carril ya existe en el tablero.");
    return;
}

crearCarril(cleanName);


});
function crearCarril(nombre, guardar = true) {
    if (guardar) {
        carrilesGuardados.push(nombre);
        localStorage.setItem("carriles", JSON.stringify(carrilesGuardados));
    }

    const carril = document.createElement("div");
    carril.classList.add("lane");

    carril.innerHTML = `
        <div class="lane-header">
            <h2>/r/${nombre}</h2>
            <button class="btn-refresh">Actualizar</button>
            <button class="btn-delete">Eliminar</button>
        </div>
        <div class="lane-content">
            <p>Cargando publicaciones...</p>
        </div>
    `;

    board.appendChild(carril);

    const laneContent = carril.querySelector(".lane-content");
    const btnRefresh = carril.querySelector(".btn-refresh");
    const btnDelete = carril.querySelector(".btn-delete");

    btnRefresh.addEventListener("click", () => {
        laneContent.innerHTML = "<p>Cargando publicaciones...</p>";
        cargarPublicaciones(nombre, laneContent);
    });

    btnDelete.addEventListener("click", () => {
        carril.remove();
        carrilesGuardados = carrilesGuardados.filter(item => item !== nombre);
        localStorage.setItem("carriles", JSON.stringify(carrilesGuardados));
    });

    cargarPublicaciones(nombre, laneContent);
}

async function cargarPublicaciones(nombre, contenedorContenido) {
    try {
        const url = `https://jsonplaceholder.typicode.com/users/${nombre}`;
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error("Registro no encontrado (ingresa un ID del 1 al 10)");
        }
        
        const datos = await respuesta.json();
        
        contenedorContenido.innerHTML = `
            <div class="post-card">
                <h3>${datos.name} (@${datos.username})</h3>
                <p>📧 ${datos.email}</p>
                <p>🌐 ${datos.website}</p>
            </div>
        `;
    } catch (error) {
        console.error("Error en carril:", error);
        contenedorContenido.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

carrilesGuardados.forEach(nombre => crearCarril(nombre, false));