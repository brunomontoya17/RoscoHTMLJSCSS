const EstadoLetra = {
  NEUTRO: "Neutro",
  PASAPALABRA: "Pasapalabra",
  CORRECTA: "Correcta",
  INCORRECTA: "Incorrecta",
  SELECTED: "Selected",
};

const EstadoJuego = {
  RUN: {
    VALOR: "Corriendo",
    CONTAINER: "timercontainerRun",
  },
  PAUSE: {
    VALOR: "Pausado",
    CONTAINER: "timercontainerPause",
  },
  HALT: {
    VALOR: "Freezado",
    CONTAINER: "timercontainerHalt",
  },
};

class Letra {
  constructor(letra) {
    this._letra = letra;
    this._estado = EstadoLetra.NEUTRO;
  }

  get letra() {
    return this._letra;
  }
  set letra(val) {
    this._letra = val;
  }

  get estado() {
    return this._estado;
  }
  set estado(val) {
    this._estado = val;
  }

  imprimirLetra(leftpos, toppos) {
    let inner = ``;
    inner = `<span class="${this.estado}" 
            style="position:absolute;left:${leftpos};top:${toppos}">
            ${this.letra}</span>`;
    return inner;
  }
}

class Rosco {
  constructor(nombrejugador, tiempo) {
    this._nombrejugador = nombrejugador;
    this._tiempo = tiempo;
    this._rosco = this.defineRosco();
    this._terminado = false;
    this._esCampeon = false;
    this._tiemporestante = tiempo * 10;
    this._currentLetra = 0;
  }

  get nombrejugador() {
    return this._nombrejugador;
  }
  set nombrejugador(val) {
    this._nombrejugador = val;
  }

  get tiempo() {
    return this._tiempo;
  }
  set tiempo(val) {
    this._tiempo = parseInt(val);
  }

  get terminado() {
    return this._terminado;
  }
  set terminado(val) {
    this._terminado = val;
  }

  get esCampeon() {
    return this._esCampeon;
  }
  set esCampeon(val) {
    this._esCampeon = val;
  }

  get tiempoRestante() {
    return this._tiemporestante;
  }
  set tiempoRestante(val) {
    this._tiemporestante = parseInt(val);
  }

  get rosco() {
    return this._rosco;
  }

  defineRosco() {
    return [
      new Letra("A"),
      new Letra("B"),
      new Letra("C"),
      new Letra("D"),
      new Letra("E"),
      new Letra("F"),
      new Letra("G"),
      new Letra("H"),
      new Letra("I"),
      new Letra("J"),
      new Letra("L"),
      new Letra("M"),
      new Letra("N"),
      new Letra("O"),
      new Letra("P"),
      new Letra("Q"),
      new Letra("R"),
      new Letra("S"),
      new Letra("T"),
      new Letra("U"),
      new Letra("V"),
      new Letra("X"),
      new Letra("Y"),
      new Letra("Z"),
    ];
  }

  imprimirRosco() {
    var inner = ``;
    let radius;
    let xpos;
    let ypos;

    // Centerx y Centery capturan el centro del div 
    let centerx = Math.round(
      document.getElementById("tablero").getBoundingClientRect().width / 2.0
    );
    let centery = Math.round(
      document.getElementById("tablero").getBoundingClientRect().height / 2.0
    );

    //Establece el radio minimo para calcular la posicion de las letras
    if (centery >= centerx) {
      radius = Math.round(parseFloat(centerx) * 0.85);
    } else {
      radius = Math.round(parseFloat(centery) * 0.85);
    }
    //El for imprime letra por letra EL coseno se encarga de la posicion en Y y el seno en X
    // El 30 y 45 es para tener en cuenta el ancho de los circulos en los que van las letras
    for (let x = 0; x < this.rosco.length; x++) {
      let cosinus = Math.cos((x / this.rosco.length + 1 / 48) * Math.PI * 2);
      ypos = Math.round(radius * cosinus * -1) + centery + 45;
      let sinus = Math.sin((x / this.rosco.length + 1 / 48) * Math.PI * 2);
      xpos = Math.round(radius * sinus) + centerx - 30;
      inner = inner + this.rosco[x].imprimirLetra(xpos, ypos);
    }
    return inner;
  }

  transcursoTiempo() {
    this.tiempoRestante -= 1;
    if (this.tiempoRestante <= 0) this.terminado = true;
  }

  cambiarEstadoLetra(estadoLetter) {
    this.rosco[this._currentLetra].estado = estadoLetter;
  }

  nextLetra() {
    let encontrado = false;
    let expr1 = () => {
      this._currentLetra++;
    };
    let expr2 = () => {
      let flag = true;
      for (let letter of this.rosco) {
        if (letter.estado == EstadoLetra.PASAPALABRA) {
          letter.estado = EstadoLetra.NEUTRO;
          flag = false;
        }
      }
      if (flag) this._terminado = true;
      this._currentLetra = 0;
    };
    while (!encontrado && !this.terminado) {
      this._currentLetra < this.rosco.length - 1 ? expr1() : expr2();
      if (!this.terminado) {
        let letraRosco = this.rosco[this._currentLetra];
        if (letraRosco.estado == EstadoLetra.NEUTRO) {
          encontrado = true;
          letraRosco.estado = EstadoLetra.SELECTED;
        }
      }
    }
    return !this.terminado;
  }

  verificarCampeon() {
    let campeon = true;
    let recorrido = 0;
    while (recorrido < this.rosco.length && campeon) {
      let letter = this.rosco[recorrido];
      if (letter.estado != EstadoLetra.CORRECTA) {
        campeon = false;
      }
      recorrido++;
    }
    return campeon;
  }
}

var rosco1 = null;
var rosco2 = null;
var currentRosco = null;
var isPaused = EstadoJuego.HALT;
var interval;
var clocktime;

function main() {
  /* alert(document.getElementById('nombre1').value);
    alert(document.getElementById('nombre2').value);
    alert(document.getElementById('tiempo1').value);
    alert(document.getElementById('tiempo2').value); */
  if (rosco1 === null) {
    if (
      document.getElementById("nombre1").value != "" &&
      document.getElementById("nombre2").value != "" &&
      document.getElementById("tiempo1").value != "" &&
      document.getElementById("tiempo2").value != ""
    ) {
      rosco1 = new Rosco(
        document.getElementById("nombre1").value,
        parseInt(document.getElementById("tiempo1").value)
      );
      rosco2 = new Rosco(
        document.getElementById("nombre2").value,
        parseInt(document.getElementById("tiempo2").value)
      );
      currentRosco = rosco1;
      imprimirDatos();
    } else {
      alert("No ingresaste todos los datos requeridos!!");
    }
  } else {
    if (document.getElementById("nombre1").value != "")
      rosco1.nombrejugador = document.getElementById("nombre1").value;
    if (document.getElementById("tiempo1").value != "") {
      rosco1.tiempo = parseInt(document.getElementById("tiempo1").value);
      rosco1.tiempoRestante = parseInt(
        document.getElementById("tiempo1").value * 10
      );
    }

    if (document.getElementById("nombre2").value != "")
      rosco2.nombrejugador = document.getElementById("nombre2").value;
    if (document.getElementById("tiempo2").value != "") {
      rosco2.tiempo = parseInt(document.getElementById("tiempo2").value);
      rosco2.tiempoRestante = parseInt(
        document.getElementById("tiempo2").value * 10
      );
    }

    /* alert('Se modificaron los datos'); */
    imprimirDatos();
  }
  clocktime = document.getElementById("timercontainer").outerHTML;
  printRosco();
}

function imprimirDatos() {
  document.getElementById("datos").innerHTML =
    "Rosco 1: <br>" +
    "Nombre: " +
    rosco1.nombrejugador +
    " Tiempo: " +
    rosco1.tiempo +
    "<br>" +
    "Rosco 2: <br>" +
    "Nombre: " +
    rosco2.nombrejugador +
    " Tiempo: " +
    rosco2.tiempo;
  document.getElementById("timercontainer").innerHTML =
    rosco1.tiempoRestante / 10;
  document.getElementById("playername").innerHTML = currentRosco.nombrejugador;
  document.getElementById("nombre1").value = "";
  document.getElementById("tiempo1").value = "";
  document.getElementById("nombre2").value = "";
  document.getElementById("tiempo2").value = "";
  document.getElementById("botonInicio").hidden = false;
}

function iniciar() {
  window.addEventListener("keypress", presionTeclado, false);
  isPaused = EstadoJuego.RUN;
  document.getElementById("timercontainer").className = isPaused.CONTAINER;
  document.getElementById("iniciar").hidden = true;
  document.getElementById("inputtable").hidden = true;
  interval = setInterval(runTiempo, 100);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printRosco() {
  document.getElementById(
    "innerTablero"
  ).innerHTML = currentRosco.imprimirRosco();
}

function presionTeclado(event) {
  if (event.key == "Q" || event.key == "q") {
    //alert(`Presionaste: ${EstadoLetra.PASAPALABRA}`);
    if (isPaused == EstadoJuego.RUN) {
      clearInterval(interval);
      isPaused = EstadoJuego.HALT;
      document.getElementById("timercontainer").className = isPaused.CONTAINER;
      currentRosco.cambiarEstadoLetra(EstadoLetra.PASAPALABRA);
      printRosco();
      currentRosco.nextLetra();

      sleep(5000).then(intercambiarRosco);
      //setTimeout(intercambiarRosco, 5000);
    }
  }
  if (event.key == "W" || event.key == "w") {
    //alert(`Presionaste: ${EstadoLetra.CORRECTA}`);
    if (isPaused == EstadoJuego.RUN) {
      currentRosco.cambiarEstadoLetra(EstadoLetra.CORRECTA);
      currentRosco.nextLetra();
      printRosco();
      //currentRosco.imprimirRosco();
    }
  }
  if (event.key == "E" || event.key == "e") {
    //alert(`Presionaste: ${EstadoLetra.INCORRECTA}`);
    if (isPaused == EstadoJuego.RUN) {
      clearInterval(interval);
      isPaused = EstadoJuego.HALT;
      document.getElementById("timercontainer").className = isPaused.CONTAINER;
      currentRosco.cambiarEstadoLetra(EstadoLetra.INCORRECTA);
      printRosco();
      if (!currentRosco.nextLetra()) {
        preConclude(currentRosco);
      } else {
        //setTimeout(intercambiarRosco, 5000);
        sleep(5000).then(intercambiarRosco);
      }
    }
  }
  if (event.key == "R" || event.key == "r" || event.key == " ") {
    //alert(`Presionaste reanudar!`);
    if (isPaused == EstadoJuego.PAUSE) {
      isPaused = EstadoJuego.RUN;
      document.getElementById("timercontainer").className = isPaused.CONTAINER;
      interval = setInterval(runTiempo, 100);
    }
  }
}

function intercambiarRosco() {
  if (currentRosco == rosco1) {
    if (!rosco2.terminado) currentRosco = rosco2;
  } else {
    if (!rosco1.terminado) currentRosco = rosco1;
  }
  printRosco();
  isPaused = EstadoJuego.PAUSE;
  document.getElementById("timercontainer").className = isPaused.CONTAINER;
  document.getElementById("timercontainer").innerHTML = Math.ceil(
    currentRosco.tiempoRestante / 10
  );
  document.getElementById("playername").innerHTML = currentRosco.nombrejugador;
}

function runTiempo() {
  if (!currentRosco.terminado) {
    currentRosco.transcursoTiempo();
    document.getElementById("timercontainer").innerHTML = Math.ceil(
      currentRosco.tiempoRestante / 10
    );
  } else {
    isPaused = EstadoJuego.HALT;
    clearInterval(interval);
    if (currentRosco.verificarCampeon()) {
      if (currentRosco == rosco1) {
        rosco2.terminado = true;
      } else {
        rosco1.terminado = true;
      }
      alertCampeon();
    } else {
      preConclude(currentRosco);
    }
  }
}

function alertResultado(roscof) {
  let right = 0,
    wrong = 0,
    unanswered = 0;
  for (let letter of roscof.rosco) {
    if (letter.estado == EstadoLetra.CORRECTA) {
      right++;
    } else if (letter.estado == EstadoLetra.INCORRECTA) {
      wrong++;
    } else {
      unanswered++;
    }
  }
  let w = window.open("", "", "width=400,height=225");

  w.document.write(`<html lang="es">
                        <head>
                        <meta charset="UTF-8">
                        </head>
                        <body style="background-color:darkkhaki">
                        <p style="font-size:28">El resultado del jugador ${roscof.nombrejugador} es: <br>
                        Correctas: ${right}<br>
                        Incorrectas: ${wrong}<br>
                        Sin contestar: ${unanswered}</p>
                        </body>
                      </html>
                      `);
  w.focus();
  setTimeout(function () {
    w.close();
  }, 5000);
  //sleep(5000).then(function () { w.close(); })
}

function alertCampeon() {
  window.removeEventListener("keypress", presionTeclado);
  document.getElementById(
    "timercontainer"
  ).innerHTML = `<input type="button" value="${rosco1.nombrejugador}" onclick="printRosco1()" /><br>
                                                           <input type="button" value="${rosco2.nombrejugador}" onclick="printRosco2()" /><br>
                                                           <input type="button" value="Resultado" onclick="alertCampeon()" /> `;
  let w = window.open("", "", "width=400,height=225");
  w.document.write(`<html lang="es">
                        <head>
                            <meta charset="UTF-8">
                        </head>
                        <body style="background-color: LimeGreen">
                            <h1>Felicidades!! El jugador ${currentRosco.nombrejugador} <br>
                            ha completado el rosco y se consagra campeón</h1>
                        </body>
                      </html>
                        `);
  w.focus();
}

async function preConclude(roscof) {
  alertResultado(roscof);
  await sleep(5000);
  if (rosco1.terminado && rosco2.terminado) conclusion();
  else intercambiarRosco();
}

function printRosco1() {
  document.getElementById("innerTablero").innerHTML = rosco1.imprimirRosco();
  document.getElementById("playername").innerHTML = rosco1.nombrejugador;
}

function printRosco2() {
  document.getElementById("innerTablero").innerHTML = rosco2.imprimirRosco();
  document.getElementById("playername").innerHTML = rosco2.nombrejugador;
}

function conclusion() {
  window.removeEventListener("keypress", presionTeclado);
  document.getElementById(
    "timercontainer"
  ).innerHTML = `<input type="button" value="${rosco1.nombrejugador}" onclick="printRosco1()" /><br>
                                                           <input type="button" value="${rosco2.nombrejugador}" onclick="printRosco2()" /><br>
                                                           <input type="button" value="Resultado" onclick="conclusion()" /> `;
  let resultrosco1 = { right: 0, wrong: 0, unanswered: 0 };
  let resultrosco2 = { right: 0, wrong: 0, unanswered: 0 };
  for (let letter of rosco1.rosco) {
    if (letter.estado == EstadoLetra.CORRECTA) {
      resultrosco1.right++;
    } else if (letter.estado == EstadoLetra.INCORRECTA) {
      resultrosco1.wrong++;
    } else {
      resultrosco1.unanswered++;
    }
  }
  for (let letter of rosco2.rosco) {
    if (letter.estado == EstadoLetra.CORRECTA) {
      resultrosco2.right++;
    } else if (letter.estado == EstadoLetra.INCORRECTA) {
      resultrosco2.wrong++;
    } else {
      resultrosco2.unanswered++;
    }
  }
  let roscoganador;
  if (resultrosco1.right > resultrosco2.right) {
    roscoganador = rosco1;
  } else if (resultrosco2.right > resultrosco1.right) {
    roscoganador = rosco2;
  } else if (resultrosco2.wrong > resultrosco1.wrong) {
    roscoganador = rosco1;
  } else if (resultrosco1.wrong > resultrosco2.wrong) {
    roscoganador = rosco2;
  } else {
    roscoganador = null;
  }

  if (roscoganador !== null) {
    let w = window.open("", "", "width=400,height=300");
    w.document.write(`
                            <html lang="es">
                            <head>
                            <meta charset="UTF-8">
                            <style>
                                table, td {
                                    border:2px solid black;
                                    border-collapse:collapse;
                                    font-size:20
                                }
                            </style>
                            </head>
                            <body style="background-color:cadetblue">
                            <h1>Resultados</h1>
                         <table>
                            <tr>
                                <td></td>
                                <td>${rosco1.nombrejugador}</td>
                                <td>${rosco2.nombrejugador}</td>
                            </tr>
                            <tr>
                                <td>Correctas:</td>
                                <td>${resultrosco1.right}</td>
                                <td>${resultrosco2.right}</td>
                            </tr>
                            <tr>
                                <td>Incorrectas:</td>
                                <td>${resultrosco1.wrong}</td>
                                <td>${resultrosco2.wrong}</td>
                            </tr>
                         </table><br>
                         <p style='font-size: 36'>Ganador: ${roscoganador.nombrejugador}</p>
                            </body>
                            </html>
                            `);
    w.focus();
  } else {
    let w = window.open("", "", "width=400,height=300");
    w.document.write(`<html lang="es">
        <head>
        <meta charset="UTF-8">
        <style>
            table, td {
            border: 2px solid black;
            border-collapse: collapse;
            font-size: 20
            }
        </style>
        </head>
        <body style="background-color:cadetblue">
        <h1>Resultados</h1>
        <table>
        <tr>
            <td></td>
            <td>${rosco1.nombrejugador}</td>
            <td>${rosco2.nombrejugador}</td>
        </tr>
        <tr>
            <td>Correctas:</td>
            <td>${resultrosco1.right}</td>
            <td>${resultrosco2.right}</td>
        </tr>
        <tr>
            <td>Incorrectas:</td>
            <td>${resultrosco1.wrong}</td>
            <td>${resultrosco2.wrong}</td>
        </tr>
     </table><br>
     <p style='font-size: 36'>EMPATE!!!</p>
        </body>
        </html>
                         `);
    w.focus();
  }
}
