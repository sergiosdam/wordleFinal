console.log("Hola!");

const boton = document.getElementById("miBoton");

boton.addEventListener('click', function(){
    alert('Boton clickeado');
});

// Obtener el menú
const contextMenu = document.getElementById("contextMenu");
document.getElementById("tablero").addEventListener("contextmenu", function(e) {
    e.preventDefault();
    contextMenu.style.display = "block";
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
});

// Click para cualquier parte de la página
window.addEventListener("click", function(e){
    if(!contextMenu.contains(e.target))
        contextMenu.style.display = "none";
});

// Alert reiniciar
document.getElementById("reiniciar").addEventListener("click", function(){
    alert("El juego ha sido reiniciado");
});

// Alert instrucciones
document.getElementById("instrucciones").addEventListener("click", function(){
    alert("Instrucciones del juego");
});

// Seleccionar todas las cajas
const cajas = document.querySelectorAll(".caja");
let filaActual = 0; // Cambiado de cajaActual a filaActual

// Función para saber si el usuario presiona una tecla
function ingresarLetra(letra) {
    const caja = cajas[filaActual * 5 + cajaActual]; // Cambiado para calcular la caja correcta por fila
    if (caja && cajaActual < 5) { // Asegúrate de que la caja existe y no se pase de 5
        caja.textContent = letra.toUpperCase();
        cajaActual++;
    }
}

// Cuando el usuario presiona la tecla
window.addEventListener("keydown", function(event) {
    if (event.key.match(/^[a-z]$/i)) {
        ingresarLetra(event.key);
    }
});

// Seleccionamos los botones del teclado para el click
const botonesTeclado = document.querySelectorAll("#teclado button");
botonesTeclado.forEach(function(boton) { // Cada botón del teclado virtual se agrega un evento
    boton.addEventListener("click", function() { // El botón con la letra que se ve es lo que queremos ingresar
        ingresarLetra(boton.textContent);
    });
});

// Reiniciar juego
function reiniciarJuego() {
    cajaActual = 0;
    filas.forEach(function(fila) { // Cambiado para limpiar las filas
        fila.querySelectorAll(".caja").forEach(function(caja) {
            caja.textContent = "";
            caja.style.backgroundColor = "";
        });
    });
}

// Si el usuario reinicia, llamamos desde acá
document.getElementById("reiniciar").addEventListener("click", reiniciarJuego);

// Fetch para obtener palabras
async function obtenerPalabras() {
    const response = await fetch("https://raw.githubusercontent.com/xavier-hernandez/spanish-wordlist/main/spanish.txt");
    const data = await response.text();
    const palabras = data.split("\n");
    return palabras;
}

// Seleccionar palabra al azar
async function seleccionarPalabra() {
    const palabras = await obtenerPalabras();
    const indiceAleatorio = Math.floor(Math.random() * palabras.length);
    const palabraSecreta = palabras[indiceAleatorio].trim();
    console.log("Palabra secreta: ", palabraSecreta); 
    return palabraSecreta;
}

// Para guardar la palabra secreta
let palabraSecreta = "";

// Function para iniciar el juego
async function iniciarJuego() {
    palabraSecreta = await seleccionarPalabra();
    reiniciarJuego();
}

// Validación de palabra ingresada por el usuario letra por letra
function validarPalabra(palabraUsuario) {
    const resultado = [];
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraUsuario[i] === palabraSecreta[i]) {
            resultado.push("correcta");
        } else if (palabraSecreta.includes(palabraUsuario[i])) {
            resultado.push("existe");
        } else {
            resultado.push("incorrecta");
        }
    }
    return resultado;
}

// Colores de letras
function pintarPalabra(palabraUsuario, resultado) {
    const cajasFila = document.querySelectorAll(`.fila:nth-child(${filaActual + 1}) .caja`); // Cambiado para pintar en la fila actual
    for (let i = 0; i < palabraUsuario.length; i++) {
        const caja = cajasFila[i]; // Utiliza las cajas de la fila actual
        caja.textContent = palabraUsuario[i].toUpperCase();
        if (resultado[i] === "correcta") {
            caja.style.backgroundColor = "green";
        } else if (resultado[i] === "existe") {
            caja.style.backgroundColor = "yellow";
        } else {
            caja.style.backgroundColor = "gray";
        }
    }
}

// Presionar botón para validar la palabra
boton.addEventListener("click", () => {
    const palabraUsuario = obtenerPalabraUsuario();
    if (palabraUsuario.length === 5) {
        const resultado = validarPalabra(palabraUsuario);
        pintarPalabra(palabraUsuario, resultado);
        // Comprobar si el usuario ha adivinado la palabra
        if (palabraUsuario === palabraSecreta) {
            alert("¡Felicidades! Has adivinado la palabra.");
            return; // Finalizar el juego
        }
        // Avanzar a la siguiente fila
        filaActual++; // Incrementa la fila actual
        cajaActual = 0; // Reinicia la caja actual
        // Verificar si se han agotado los intentos
        if (filaActual >= filas.length) {
            alert(`Has perdido. La palabra era: ${palabraSecreta}`);
            reiniciarJuego(); 
        }
    } else {
        alert("La palabra debe contener 5 letras");
    }
});

// Function para obtener palabra
function obtenerPalabraUsuario() {
    const cajasFila = document.querySelectorAll(`.fila:nth-child(${filaActual + 1}) .caja`); // Selecciona las cajas de la fila actual
    let palabraUsuario = "";
    cajasFila.forEach(caja => {
        palabraUsuario += caja.textContent.trim();
    });
    return palabraUsuario.toLowerCase();
}

// Iniciar juego
iniciarJuego();