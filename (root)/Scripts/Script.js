
//#region Variables

const Nombre = document.querySelector('#Nombre');
const Apellido = document.querySelector('#Apellido')
const player_list = document.querySelector('.player-list'); //Donde se van a mostrar los jugadores
const button = document.querySelector('#button');
const form = document.querySelector('#form');
const playzone = document.querySelector('.playzone');
const HTMLleaderboard = document.querySelector('.leaderboard');
const leaderboard_container = document.querySelector('.leaderboard-container');
const h2 = document.querySelector('registerh2');
let size = 0;
let LineaHecha = false;

let turnos = 25;


const buttonStart = document.querySelector('.button-start');
//Variables
const player = { //Objeto para guardar los datos del jugador
    Numero: 0,
    Nombre: "",
    Apellido: "",
    Puntuacion: 0
}

class Player { //Clase para guardar los jugadores
    constructor() {
        this.player = [];
    }

    agregarJugador(player) {
        this.player = [...this.player, player];
    }
}
//Instancias
const listaJugadores = new Player(); //Instancia de la clase Player
//Event Listeners
eventListeners(); //Llamada a la funcion para los eventos
function eventListeners() { //Funcion para los eventos
    //Cuando el formulario se envia
    Nombre.addEventListener('input', datosJugador);
    Apellido.addEventListener('input', datosJugador);
    form.addEventListener('submit', agregarJugador);

}
//Funciones
function datosJugador(e) { //Funcion para leer los datos del jugador
    player[e.target.name] = e.target.value;


}
//Funcion para agregar un jugador
function agregarJugador(e) { //Funcion para agregar un jugador

    e.preventDefault();

    //Leer los datos del formulario
    const { Nombre, Apellido } = player;
    //Validacion
    if (Nombre === '' || Apellido === '' || Nombre.length > 7 || Apellido.length > 7) {
        //La validacion falla
        mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }
    else {

        //Se pasa la validacion
        if (listaJugadores.player.length < 4) {
            player.id = listaJugadores.player.length + 1;
            player.Victories = 0;

            player.Puntuacion = 0;
            listaJugadores.agregarJugador({ ...player });

            mostrarMensaje('Jugador agregado correctamente', 'success');
            limpiarObjeto();
            form.reset();
            mostrarJugadores(listaJugadores);
            alert('Siguen faltando ' + (4 - listaJugadores.player.length) + ' jugadores para empezar el juego');



            if (listaJugadores.player.length === 4) {
                mostrarMensaje('Sala llena, no se pueden meter mas jugadores', 'play');
                crearBotonInicio();
            }

        }

    }
}


function crearBotonReinicio() {
    const botonReinicio = document.createElement('p');
    botonReinicio.textContent = 'Reiniciar Juego';
    botonReinicio.classList.add('button-reinicio');
    playzone.appendChild(botonReinicio);
}

//Muestra un mensaje 
function mostrarMensaje(mensaje, tipo) {

    const mensajeError = document.createElement('p')
    if (tipo === 'error') {
        mensajeError.classList.add('error');
    }
    else {
        mensajeError.classList.add('success');
    }
    mensajeError.textContent = mensaje;
    const contenido = document.querySelector('#form');
    contenido.appendChild(mensajeError);



    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}
function limpiarObjeto() {
    player.Nombre = '';
    player.Apellido = '';
}
//Funcion para mostrar los jugadores
function mostrarJugadores(listaJugadores) {
    limpiarHtml();
    listaJugadores.player.forEach(jugador => {

        const { id, Nombre, Apellido } = jugador;

        const jugadorHTML = document.createElement('div');
        jugadorHTML.classList.add('player-card');

        const jugadorHTMLNumero = document.createElement('h3');
        jugadorHTMLNumero.textContent = `Jugador: ${id}`;

        const jugadorHTMLNombre = document.createElement('p');
        jugadorHTMLNombre.textContent = `Nombre:${Nombre}`;

        const jugadorHTMLApellido = document.createElement('p');
        jugadorHTMLApellido.textContent = `Apellido:${Apellido}`;


        jugadorHTML.appendChild(jugadorHTMLNumero);
        jugadorHTML.appendChild(jugadorHTMLNombre);
        jugadorHTML.appendChild(jugadorHTMLApellido);

        localStorageGuardar();


        player_list.appendChild(jugadorHTML);
    });
}
function limpiarHtml() {
    while (player_list.firstChild) {
        player_list.removeChild(player_list.firstChild);
    }
}
function localStorageGuardar() {
    localStorage.setItem('jugadores', JSON.stringify(listaJugadores.player));
}
/*  Empezar juego */
playzone.addEventListener('click', (e) => {
    if (e.target.classList.contains('button-start')) {
        empezarJuego();
    }
    if (e.target.classList.contains('button-reinicio')) {
        empezarJuego();
    }

    if (e.target.classList.contains('carton')) {


        e.target.classList.toggle('selected');

        if (e.target.classList.contains('hidden')) {
            e.target.classList.toggle('hidden');
        }

        const cartones = document.querySelectorAll('.carton');
        cartones.forEach(carton => {
            if (carton !== e.target) {
                carton.classList.remove('selected');
                carton.classList.add('hidden');
            }
        });

    }
    if (e.target.classList.contains('button-sorteo')) {
        sorteo(turnos);
    }

});
function crearBotonInicio() {
    const botonInicio = document.createElement('p');
    botonInicio.textContent = 'Empezar Juego';
    botonInicio.classList.add('button-start');
    playzone.appendChild(botonInicio);
}
function empezarJuego() {
    
    const botonInicio = document.querySelector('.button-start');
    if (botonInicio){
    playzone.removeChild(botonInicio);
    }
    const botonReinicio = document.querySelector('.button-reinicio');
    if (botonReinicio){
    playzone.removeChild(botonReinicio);
    }

    let number = parseInt(prompt("Por favor ingrese un numero entre 3 y 5"));
    while (isNaN(number) || number < 3 || number > 5) {
        alert("Entrada invalida, por favor ingrese un numero entre 3 y 5");
        number = parseInt(prompt("Por favor ingrese un numero entre 3 y 5"));

    }

    crearTableros(number);

}
function crearTableros(number) {
    alert('El juego ha comenzado. Seleccione un carton para jugar');

    let tablero = document.createElement('div');
    tablero.classList.add('tablero');
    tablero.style.gridTemplateColumns = `repeat(${listaJugadores.player.length / 2}, 1fr)`; //Por si en algun momento toca meter mas de 


    for (let i = 0; i < listaJugadores.player.length; i++) {
        let carton = document.createElement('div');
        let player = document.createElement('h3');
        player.textContent = `Jugador ${listaJugadores.player[i].id}`;

        carton.appendChild(player);
        carton.classList.add('carton');

        carton.style.gridTemplateColumns = `repeat(${number}, 1fr)`;
        
        //console.log(listaJugadores.player[i].id);
        carton.setAttribute('id', `${listaJugadores.player[i].id}`);

        for (let i = 0; i < number; i++) {
            let fila = document.createElement('div');
            fila.classList.add('fila');

            for (let j = 0; j < number; j++) {

                const celda = document.createElement('div');

                let num = generateUniqueRandomNumbers().pop();

                celda.classList.add('celda');
                celda.textContent = `${num}`;


                fila.appendChild(celda);


            }


            carton.appendChild(fila);
        }
        tablero.appendChild(carton);
    }

    playzone.appendChild(tablero);

    agregarBotonSorteo();

    size = number;
}
function generateUniqueRandomNumbers() {
    let numbers = Array.from({ length: 50 }, (_, i) => i + 1); 
    let result = [];

    while (numbers.length) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const number = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
        result.push(number);
    }

    return result;
}
function agregarBotonSorteo() {
    const botonSorteo = document.createElement('p');
    botonSorteo.textContent = 'Sortear';
    botonSorteo.classList.add('button-sorteo');
    playzone.appendChild(botonSorteo);
}
function sorteo(turnosrestantes) {
    let numeros = generateUniqueRandomNumbers();
    let numero = numeros.pop();

    if (turnosrestantes != 0) {
        mostrarNumeroSorteado(numero, turnos);
        turnos--;

    }
    else {
        alert('No hay mas turnos');
        endgame();
    }



}
function limpiarzone() {
    const tablero = document.querySelector('.tablero');
    while (tablero.firstChild) {
        tablero.removeChild(tablero.firstChild);
    }
    playzone.removeChild(tablero);
    while (playzone.firstChild) {
        playzone.removeChild(playzone.firstChild);
    }

    const formulario = document.querySelector(".form")
    if (formulario){
        formulario.remove();
    }

    const registerh2 = document.querySelector(".registerh2")

    if (registerh2){
    registerh2.remove();
    }
}
function mostrarNumeroSorteado(numero, turnosrestantes) {
    const numeroSorteado = document.createElement('h2');
    const turnosRestantes = document.createElement('h2');
    turnosRestantes.textContent = `Turnos restantes: ${turnosrestantes}`;
    playzone.appendChild(turnosRestantes);

    numeroSorteado.textContent = `El numero sorteado es: ${numero}`;
    playzone.appendChild(numeroSorteado);
    compararNumerosCelda(numero);

    setTimeout(() => {
        numeroSorteado.remove();
        turnosRestantes.remove();
    }, 2000);
}
function compararNumerosCelda(numero) {
    const cartones = document.querySelectorAll('.carton');
    cartones.forEach(carton => {
        const celdas = carton.querySelectorAll('.celda');
        celdas.forEach(celda => {
            if (parseInt(celda.textContent) === numero) {
                celda.classList.add('selected_number');

            }
        });
    });
}
function compararLineaHorizontal(sizeCarton) {
    const cartones = document.querySelectorAll('.carton');
    console.log("Comparando lineas");

    cartones.forEach(carton => {
        const celdas = carton.querySelectorAll('.celda');
        for (let i = 0; i < celdas.length; i += sizeCarton) {

            console.log("Comparando filas[", i, "]");
            let lineaCompleta;

            for (let j = 0; j < sizeCarton; j++) {
                if (!celdas[i + j].classList.contains('selected_number')) {
                    console.log("No hay linea completa con el jugador ", carton.id, "en la fila ", i, "y la columna ", j);
                    lineaCompleta = false;
                    break;
                }
                else {
                    console.log("Hay linea completa con el jugador ", carton.id, "en la fila ", i, "y la columna ", j); 
                    lineaCompleta = true;
                }

            }
            if (lineaCompleta) {    
                // alert(`El jugador ${carton.id} ha completado una linea Horizontal`);
                listaJugadores.player.forEach(jugador => {
                    if (jugador.id === parseInt(carton.id)) {
                        jugador.Puntuacion += 1;
                    }
                });
            }
        }

    });

}
function compararLineaVertical(sizeCarton) {
    const cartones = document.querySelectorAll('.carton');
    console.log("Comparando lineas");

    cartones.forEach(carton => {
        const celdas = carton.querySelectorAll('.celda');
        for (let i = 0; i < sizeCarton; i++) {

            console.log("Comparando columnas[", i, "]");
            let lineaCompleta;

            for (let j = 0; j < sizeCarton; j++) {
                if (!celdas[j * sizeCarton + i].classList.contains('selected_number')) {
                    console.log("No hay linea completa con el jugador ", carton.id, "en la fila ", j, "y la columna ", i);
                    lineaCompleta = false;
                    break;
                }
                else {
                    console.log("Hay linea completa con el jugador ", carton.id, "en la fila ", j, "y la columna ", i);
                    lineaCompleta = true;
                }

            }
            if (lineaCompleta) {
                // alert(`El jugador ${carton.id} ha completado una linea Vertical`);
                listaJugadores.player.forEach(jugador => {
                    if (jugador.id === parseInt(carton.id)) {
                        jugador.Puntuacion += 1;
                    }
                });
            }
        }

    });

}
function compararLineaDiagonal(sizeCarton) {

    
    const cartones = document.querySelectorAll('.carton');
    console.log("Comparando lineas");

    cartones.forEach(carton => {
        const celdas = carton.querySelectorAll('.celda');
        let diagonalCompleta = true;
        for (let i = 0; i < sizeCarton; i++) {
            if (!celdas[i * (sizeCarton + 1)].classList.contains('selected_number')) {
                console.log("No hay linea completa con el jugador ", carton.id, "en la fila ", i, "y la columna ", i);
                diagonalCompleta = false;
                break;
            }
            else {
                console.log("Hay linea completa con el jugador ", carton.id, "en la fila ", i, "y la columna ", i);
                diagonalCompleta = true;
            }
        

            if (diagonalCompleta) {
                // alert(`El jugador ${carton.id} ha completado una linea Diagonal`);
                listaJugadores.player.forEach(jugador => {
                    if (jugador.id === parseInt(carton.id)) {
                        jugador.Puntuacion += 1;
                    }
                });
            
            
            }
        }
});

}
function bingo(sizeCarton) {
    const cartones = document.querySelectorAll('.carton');
    let bingoCompleto = true;
    cartones.forEach(carton => {
        const celdas = carton.querySelectorAll('.celda');
        celdas.forEach(celda => {
            if (!celda.classList.contains('selected_number')) {
                bingoCompleto = false;
            }
        });
    });
    if (bingoCompleto) {
        // alert(`El jugador ${carton.id} ha completado un Bingo`);
        listaJugadores.player.forEach(jugador => {
            if (jugador.id === parseInt(carton.id)) {
                jugador.Puntuacion += 1;
                endgame();
            }
        });
    }
}
function compararLineas(size) {
    compararLineaHorizontal(size);
    compararLineaVertical(size);
    compararLineaDiagonal(size);
}
function endgame() {
    compararLineas(size);
    limpiarzone();
    registrarPuntuacion();
    volverAJugar();
}
function registrarPuntuacion() {
    ordenarPuntuacion();
    victorias();
    localStorageActualizar();
    mostrarLeaderboard();
}
function ordenarPuntuacion() {
    listaJugadores.player.sort((a, b) => {
        return b.Puntuacion - a.Puntuacion;
    });
}
function localStorageActualizar() {
    localStorage.getItem('jugadores');
    for (let i = 0; i < listaJugadores.player.length; i++) {
        localStorage.setItem('jugadores', JSON.stringify(listaJugadores.player));
    }
}

function victorias() {
    listaJugadores.player[0].Victories += 1;
}


function limpiarLeaderboard() {
    while (HTMLleaderboard.firstChild) {
        HTMLleaderboard.removeChild(HTMLleaderboard.firstChild);

    }
}

function mostrarLeaderboard() {
    const lista = document.createElement('ul');
    limpiarLeaderboard();
    lista.classList.add('leaderboard-list');
    listaJugadores.player.forEach(jugador => {

        const li = document.createElement('li');

        li.textContent = `Jugador ${jugador.Nombre}, ${jugador.id}: ${jugador.Puntuacion} puntos, ${jugador.Victories} victorias.`;
        li.classList.add('leaderboard-item');
        lista.appendChild(li);

        
    });
    HTMLleaderboard.appendChild(lista);
    leaderboard_container.appendChild(HTMLleaderboard);
}

function volverAJugar() {
    turnos = 25;
    cargarLocalStorage();
    crearBotonReinicio();
}


function limpiarListaJugadores() {
    listaJugadores.player = [];
}

function cargarLocalStorage() {
    if (localStorage.getItem('jugadores')) {
        listaJugadores.player = JSON.parse(localStorage.getItem('jugadores'));
        mostrarJugadores(listaJugadores);
    }
}


/*

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠴⠒⠒⠲⠤⠤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠋⠀⠀⠀⠀⠠⢚⣂⡀⠈⠲⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡎⡴⠆⠀⠀⠀⠀⠀⢎⠐⢟⡇⠀⠈⢣⣠⠞⠉⠉⠑⢄⠀⠀⣰⠋⡯⠗⣚⣉⣓⡄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⢠⢞⠉⡆⠀⠀⠀⠀⠀⠓⠋⠀⠀⠀⠀⢿⠀⠀⠀⠀⠈⢧⠀⢹⣠⠕⠘⢧⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠘⠮⠔⠁⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠸⡀⠀⠀⠀⠀⠈⣇⠀⢳⠀⠀⠘⡆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠋⠉⠓⠦⣧⠀⠀⠀⠀⢦⠤⠤⠖⠋⠇⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠸⡄⠈⡇⠀⠀⢹⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⠀⠙⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠈⣆⠀⠀⠀⢱⠀⡇⠀⠀⠀⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀⠀⠀⠀⠀⠀⠘⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠁⠀⠀⠸⡄⠀⠀⠀⠳⠃⠀⠀⠀⡇⠀
⠀⠀⠀⠀⠀⢠⢏⠉⢳⡀⠀⠀⢹⠀⠀⠀⠀⢠⠀⠀⠀⠑⠤⣄⣀⡀⠀⠀⠀⠀⠀⣀⡤⠚⠀⠀⠀⠀⠀⢸⢢⡀⠀⠀⠀⠀⠀⢰⠁⠀
⠀⠀⣀⣤⡞⠓⠉⠁⠀⢳⠀⠀⢸⠀⠀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⢸⠀⠙⠦⣤⣀⣀⡤⠃⠀⠀
⠀⣰⠗⠒⣚⠀⢀⡤⠚⠉⢳⠀⠈⡇⠀⠀⠀⢸⡧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠸⠵⡾⠋⠉⠉⡏⠀⠀⠀⠈⠣⣀⣳⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠳⡄⠀⠀⠀⠀⠀⠀⠀⡰⠁⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⠲⠤⠤⠤⠴⠚⠁⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 


⠄⠄⠄⠄⠄⠄⣠⣤⣶⣶⣿⣶⣶⣤⣀⠄⣀⣤⣴⣶⣶⣶⣦⣀⠄⠄⠄⠄⠄⠄
⠄⠄⠄⢀⣤⣿⠡⢟⡿⠿⣛⣛⣛⠿⢿⡆⢻⣿⣿⣿⣿⣯⣃⣸⣧⡀⠄⠄⠄⠄
⠄⠄⢀⣾⣿⣿⣋⣵⣾⣿⣿⣿⣿⣿⣷⣶⡄⣩⣴⣶⣶⣶⣶⣶⣭⣉⣀⠄⠄⠄
⠄⢀⣿⡟⣻⣿⣿⣿⣿⠟⢋⣭⣴⣶⣶⣶⣦⣮⡙⠟⢛⣭⣭⣶⣶⣶⣮⣭⣄⠄
⣴⣸⣿⠑⣛⣿⠟⢩⣶⣿⣿⣿⣿⣿⡏⡋⠉⣿⣿⡌⣿⣿⣿⣿⣿⠋⡋⠛⣿⣧
⢿⣿⣿⣿⣿⣿⣶⣶⣭⣝⡻⠿⣿⣿⣷⣧⣵⠿⢟⡑⠿⠿⠿⠿⠿⠶⠭⠶⠟⠃
⣬⣿⣿⣿⣿⣿⣿⣿⣷⣬⣙⣛⣒⠠⢤⣤⡔⢚⣛⣴⣿⣿⣿⣿⣿⣿⣿⡿⠛⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⣋⣱⣾⣿⣿⣿⣎⡙⢛⣋⣉⣉⣅⠄⠄⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢏⣭⡝⢿⣿⣿⣿⣦⠄⠄
⣿⣿⣿⣿⣿⣿⠿⣛⣩⣭⣭⣭⣛⣛⠿⠿⢿⣿⣿⡏⣾⣿⡇⢸⣿⡿⠿⢛⣃⠄
⣿⣿⣿⣿⣿⡏⢾⣿⣯⣭⣍⣛⣛⣛⡻⠶⠶⣮⣭⢡⣿⣿⢇⣭⣵⣶⠾⠿⠋⠄
⣿⣿⣿⣿⣟⢿⣦⣤⣭⣭⣭⣝⣛⡻⠿⠿⠿⠶⠶⢸⣿⣿⢠⣤⣤⣶⠾⠛⠄⠄
⠿⢿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣾⣿⡿⠰⠖⠄⠄⠄⠄⠄⠄
⣭⣕⠒⠲⣭⣭⣝⣛⠛⠛⠛⠛⠛⠛⠛⢛⣛⣭⠄⣿⡟⢣⣴⣾⠟⢂⣤⡀⠄⠄
⣿⣿⣿⣿⣶⣶⣮⣭⣭⣭⣍⣛⣛⣉⣭⣭⣭⣶⢸⣿⣿⣿⣯⣴⠞⣛⣭⣶⣷⠄

*/