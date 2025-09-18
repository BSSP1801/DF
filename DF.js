

startButton=document.createElement("button");
startButton.innerHTML="Iniciar";
document.body.appendChild(startButton);


sincButton=document.createElement("button");
sincButton.innerHTML="Sincronizar";
document.body.appendChild(sincButton);
sincButton.disabled=true;
function createDungeon(){
let Dungeon = document.getElementById("Dungeon");
    Dungeon.innerHTML=""; // Limpiar contenido previo
for (let i = 0; i < 5; i++) {
    genRow = Dungeon.insertRow();
            for(let j=0;j<5;j++){
                let genCell = genRow.insertCell  ();

            }
        }

}

sincButton.onclick=function(){
const updateMsg = {
  tipo: "updateDungeon",
  dungeon: dungeonObjects
};
socket.send(JSON.stringify(updateMsg));
}



startButton.onclick=function(){
  createDungeon();
generateDungeon();
const updateMsg = {
  tipo: "updateDungeon",
  dungeon: dungeonObjects
};
socket.send(JSON.stringify(updateMsg));
};

function endGame() {
    // Deshabilitar todas las celdas del dungeon
  document.getElementById("startButton").disabled = true;
  document.getElementById("sincButton").disabled = true;
    document.getElementById("actionMenu").innerHTML = "";
    document.getElementById("PJInfo").innerHTML = "";
    document.getElementById("TextBox").innerHTML = "";
    document.getElementById("Dungeon").innerHTML = "";
    alert("Nigga you dead");
}

function startGame(){
     let pjInfo = document.getElementById("PJInfo");
        let genRow = pjInfo.insertRow();
    for (let i = 0; i < 5; i++) {
            let genCell = genRow.insertCell();
        }
        
HP=100;
Mana=100;
Gold=0;
document.getElementById("PJInfo").rows[0].cells[0].innerHTML="HP:"+HP;
document.getElementById("PJInfo").rows[0].cells[1].innerHTML="Mana:"+Mana;
document.getElementById("PJInfo").rows[0].cells[2].innerHTML="Gold:"+Gold;



        

let textBox = document.getElementById("TextBox");
       genRow = textBox.insertRow();
    
            let genCell = genRow.insertCell();
        



}
startGame();

class Enemigo {
    constructor(hp, ataque) {
        this.type = "enemy";
        this.hp = hp;
        this.ataque = ataque;
    }
}
class Cofre {
    constructor(type, gold) {
        this.type = "chest";
        this.gold = gold;
        this.chestType = type; // para diferenciar small o large, opcional
    }
}
class Fuente {
    constructor(type) {
        this.type = type;
     
    }
}

textBox = document.getElementById("TextBox").rows[0].cells[0];
textBox.innerHTML="Welcome to the Dungeon!";


function updateText(newText){
    textBox.innerHTML=newText;
}

function changeHP(amount){
    HP+=amount;
    if(HP<0) HP=0;
    document.getElementById("PJInfo").rows[0].cells[0].innerHTML="HP:"+HP;
    if (HP<=0) {
        updateText("You have been defeated! Game Over.");
       endGame();
    
    }
}

function changeMana(amount){
    Mana+=amount;
    if(Mana<0) Mana=0;
    document.getElementById("PJInfo").rows[0].cells[1].innerHTML="Mana:"+Mana;

}
function changeGold(amount){
    Gold+=amount;
    if(Gold<0) Gold=0;
    document.getElementById("PJInfo").rows[0].cells[2].innerHTML="Gold:"+Gold;
}


function generateEnemy(){
    let enemyHP = Math.floor(Math.random() * 100) + 51; 
    let enemyAttack = Math.floor(Math.random() * 20) + 6; 
    return new Enemigo(enemyHP, enemyAttack);
}
function locateEnemy(i, j, enemy) {
    document.getElementById("Dungeon").rows[i].cells[j].innerHTML = "Enemy<br>HP:" + enemy.hp + "<br>ATK:" + enemy.ataque;
}
function generateChest(){
    let chestType = Math.random() < 0.7 ? "Small" : "Large"; 
    let chestGold = chestType === "Small" ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 100) ;
    return new Cofre(chestType, chestGold);
}
function locateChest(i, j, chest) {
    document.getElementById("Dungeon").rows[i].cells[j].innerHTML = chest.type + " Chest<br>Gold:" + chest.gold;
}

function generateShrine(){
    tipo="Shrine";
    return new Fuente(tipo);
}
function locateShrine(i, j) {
    document.getElementById("Dungeon").rows[i].cells[j].innerHTML = "Shrine";
}


function generateDungeon() {
    let dungeon = document.getElementById("Dungeon");
    dungeonObjects = []; // Reinicia el arreglo

    for (let i = 0; i < dungeon.rows.length; i++) {
        dungeonObjects[i] = [];
        for (let j = 0; j < dungeon.rows[i].cells.length; j++) {
            let obj;
            if (Math.random() < 0.2) {
                obj = generateChest();
                locateChest(i, j, obj);
            } else if (Math.random() < 0.7) {
                obj = generateEnemy();
                locateEnemy(i, j, obj);
            }else{

                obj = generateShrine();
                locateShrine(i, j, obj);
            }

            dungeonObjects[i][j] = obj;

           dungeon.rows[i].cells[j].onclick = function() {
                for (let x = 0; x < dungeon.rows.length; x++) {
                    for (let y = 0; y < dungeon.rows[x].cells.length; y++) {
                        dungeon.rows[x].cells[y].style.backgroundColor = "#e0f7fa";
                    }
                }

                
                clearActions();
                generateActions(i, j);
                updateText(`¡Has hecho clic en la celda [${i}][${j}]!`);
                this.style.backgroundColor = "#ffd700";
            };
        }
    }
}

// Convertir dungeonObjects a JSON para enviar
function getDungeonJSON() {
  return JSON.stringify(dungeonObjects);
}

// Recibir dungeonJSON y actualizar localmente
function updateDungeonFromJSON(json) {
  dungeonObjects = JSON.parse(json);
  // Re-renderiza la tabla con el nuevo estado
  renderDungeon();
}

function renderDungeon() {
  const dungeon = document.getElementById("Dungeon");
  for (let i = 0; i < dungeonObjects.length; i++) {
    for (let j = 0; j < dungeonObjects[i].length; j++) {
      let obj = dungeonObjects[i][j];
      if (!obj) {
  dungeon.rows[i].cells[j].innerHTML = "";
} else if (obj.type === "enemy") {
  dungeon.rows[i].cells[j].innerHTML = `Enemy<br>HP:${obj.hp}<br>ATK:${obj.ataque}`;
} else if (obj.type === "chest") {
  dungeon.rows[i].cells[j].innerHTML = `${obj.chestType} Chest<br>Gold:${obj.gold}`;
}
    }
  }
}


function update(i, j) {
    let obj = dungeonObjects[i][j]; 
    if (obj instanceof Enemigo) {
        document.getElementById("Dungeon").rows[i].cells[j].innerHTML = "Enemy<br>HP:" + obj.hp + "<br>ATK:" + obj.ataque;
    } else if (obj instanceof Cofre) {
        document.getElementById("Dungeon").rows[i].cells[j].innerHTML = obj.type + " Chest<br>Gold:" + obj.gold;
    }

}

    function clearActions(){
        let menu= document.getElementById("actionMenu");
        menu.innerHTML="";
    }
    function generateActions(n, m) {
  let menu = document.getElementById("actionMenu");
  let genRow = menu.insertRow();
  let obj = dungeonObjects[n][m]; 

  for (let i = 0; i < 4; i++) {
    let genCell = genRow.insertCell();
  }

  if (obj instanceof Cofre) {
    genRow.cells[0].innerHTML = `Open Chest`;
    genRow.cells[0].onclick = function () {
      enviarAbrirCofre(n, m);
    };
  } else if (obj instanceof Enemigo) {
    genRow.cells[0].innerHTML = `Attack`;
    genRow.cells[0].onclick = function () {
      if (Mana < 5) {
        updateText("Not enough Mana to attack!");
        return;
      }else{
        enviarAtaque(n, m, 10);
        //enviarDano();
        changeHP(-obj.ataque);
        changeMana(-5);
      }
      
    };
  }

  else if (obj instanceof Fuente) {
    genRow.cells[0].innerHTML = `Pray`;
    genRow.cells[0].onclick = function () {
      changeMana(100);
      changeHP(100);
      updateText("You were blessed!");
     
  enviarUsarFuente(n, m);



    }
  
  }
}




    let socket;

  function iniciarWebSocket() {
    const wsUrl = "ws://192.168.208.27:3000";
    console.log("Intentando conectar a WebSocket en", wsUrl);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket conectado");
    };

    socket.onmessage = (event) => {
      document.getElementById("chat").value += event.data + "\n";


       try {
      let data = JSON.parse(event.data);

      switch(data.tipo) {
        case 'ataque':
          aplicarAtaque(data.fila, data.columna, data.dano);
          break;
        case 'abrir_cofre':
          abrirCofre(data.fila, data.columna);
          break;
          case "updateDungeon":
       updateDungeonFromJSON(data.dungeon);
  break;
   case 'usar_Fuente':
          abrirCofre(data.fila, data.columna);
          break;
        default:
          console.log("Mensaje desconocido:", data);
      }
    } catch (e) {
      console.error("Error al procesar mensaje WebSocket:", e);
    }
    };

    socket.onclose = () => {
      console.log("WebSocket cerrado");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
}


  function send() {
    const msg = document.getElementById("msg").value;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
      document.getElementById("msg").value = "";
    } else {
      alert("WebSocket no está conectado.");
    }
  }
function aplicarAtaque(fila, columna, dano) {
  let obj = dungeonObjects[fila][columna];
  if (obj instanceof Enemigo && obj.hp > 0) {
    obj.hp -= dano;
    if (obj.hp <= 0) {
      obj.hp = 0;
      dungeonObjects[fila][columna] = null;
      document.getElementById("Dungeon").rows[fila].cells[columna].innerHTML = "Enemy(DEAD)";
      clearActions();
      updateText("Enemy defeated!");
      // Aquí podrías dar recompensa si quieres
    } else {
      updateText(`Enemy hit! HP restante: ${obj.hp}`);
      update(fila, columna);
      
    }
    //actualizar dungeon via WebSocket
const updateMsg = {
  tipo: "updateDungeon",
  dungeon: dungeonObjects, // se serializa automáticamente en JSON al enviarlo
};

socket.send(JSON.stringify(updateMsg));


  }
}
function updateDungeonFromJSON(rawDungeon) {
  dungeonObjects = rawDungeon.map(row => row.map(obj => {
    if (!obj) return null;
    if (obj.type === "enemy") return new Enemigo(obj.hp, obj.ataque);
    if (obj.type === "chest") return new Cofre(obj.chestType, obj.gold);
    return null;
  }));
  renderDungeon();
}

function enviarAtaque(fila, columna, dano) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    let msg = {
      tipo: "ataque",
      fila: fila,
      columna: columna,
      dano: dano
    };
    socket.send(JSON.stringify(msg));
  }
}
/*
function takeDamage(fila, columna, dano) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    let msg = {
      tipo: "ataque",
      fila: fila,
      columna: columna,
      dano: dano
    };
    socket.send(JSON.stringify(msg));
  }
}
*/

function abrirCofre(fila, columna) {
  let obj = dungeonObjects[fila][columna];
  if (obj instanceof Cofre && obj.gold > 0) {
    changeGold(obj.gold);
    updateText(`Chest opened! You gained ${obj.gold} gold.`);
    obj.gold = 0;
    update(fila, columna);
    clearActions();
    const updateMsg = {
  tipo: "updateDungeon",
  dungeon: dungeonObjects
};
socket.send(JSON.stringify(updateMsg));
  }
}

// Función para enviar abrir cofre via WebSocket
function enviarAbrirCofre(fila, columna) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    let msg = {
      tipo: "abrir_cofre",
      fila: fila,
      columna: columna
    };
    socket.send(JSON.stringify(msg));
  }
}

function enviarUsarFuente(fila, columna) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    let msg = {
      tipo: "usar_Fuente",
      fila: fila,
      columna: columna
    };
    socket.send(JSON.stringify(msg));
  }
}


  
  window.onload = iniciarWebSocket;
