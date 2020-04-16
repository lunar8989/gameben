//Обращаемся к элементу canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

//Отключаем формы, которые не нужны в нчале игры
document.getElementById("btn").disabled = true;
document.getElementById("pause").style.display = "none";
document.getElementById("gameover").style.display = "none";


// Заводим переменные

var pers = {
    img: new Image(),
    hp: 100,
    x: 50,
    y: 450,
    heigth: 140,
    width: 150,
    jump: 80,
    speed: 4,
    status: false,
};
pers.img.src = "./img/pers.png";

var rightPress = false,
    leftPress = false,
    jumpPress = false,
    downPress = false,
    pausePress = false,
    jumpCount = 0,
    min = 0,
    sek = 0,
    groundY = pers.y + pers.heigth,
    persX = pers.x,
    persY = pers.y,
    username = "",
    counter = 0,
    score = 0,
    statuspers = "";

var ground = {
    img: new Image(),
    x: 0,
    y: 0,
    width: 2494,
};
ground.img.src = "./img/ground.jpg";

var fonAudio = new Audio();
fonAudio.src = "./audio/Level.mp3";

var object = {
    img: new Image(),
    x: 300, 
    y: groundY - 50,
    width: 150,
    heigth: 50,
}
object.img.src = "./img/block.png";

var emerald = {
    img: new Image(),
    x: 350,
    y: object.y - 65,
    width: 75,
    heigth: 65,
    status: true,
}
emerald.img.src = "./img/emerald.png";

var wolf = {
    img: new Image(),
    x: 1000,
    y: 475,
    width: 150,
    heigth: 116,
    speed: 2,
}
wolf.img.src = "./img/wolf2.png";

//Работа с игровым меню
document.getElementById("pers").classList.add("gray");

document.getElementById("pers").onclick = function(){
    document.getElementById("pers").classList.remove("gray");
    pers.status = true;
    if(username != ""){
        document.getElementById("btn").disabled = false;
    }
};

document.getElementById("username").oninput = function() {
    if(pers.status != false){
        document.getElementById("btn").disabled = false;
    }
    username = document.getElementById("username").value;
};

//Обработка кнопок паузы
document.getElementById("resume").onclick = function() {
    document.getElementById("canvas").style.display = "block";
    document.getElementById("pause").style.display = "none";
    pausePress = false;
}

document.getElementById("exit").onclick = function() {
    location.reload();
}

document.getElementById("restart").onclick = function() {
    location.reload();
}

//Начало игры
document.getElementById('btn').onclick = function () {
    document.getElementById("canvas").style.display = "block";
    game();
}

//Игровой цикл
function game() {
    document.getElementById('menu').style.display = "none";  
    document.getElementById('rules').style.display = "none";  

    controll();
    if(pausePress != true){
        update();
        render();
    }
    requestAnimationFrame(game);
    
    
}

//Функция отвечающая за управление персонажем и за нажатия на клавиши
function controll(){
    document.addEventListener("keydown", eventDown, false);
    document.addEventListener("keyup", eventUp, false);

    function eventDown(e) {
        if(e.keyCode == 39){
            rightPress = true;
        }else if(e.keyCode == 37){
            leftPress = true;
        }else if(e.keyCode == 38){
            if(persY == groundY - pers.heigth){
                jumpPress = true;
            }
        }else if(e.keyCode == 40 && persY + pers.heigth == groundY){
            downPress = true;
        }else if(e.keyCode == 32){
            spacePress = true;
        }else if(e.keyCode == 27){
            pausePress = true;           
        }
    }

    function eventUp(e) {
        if(e.keyCode == 39){
            rightPress = false;
            pers.img.src = "./img/pers.png";
        }else if(e.keyCode == 37){
            leftPress = false;
            pers.img.src = "./img/perspos.png";
        }
    }

    //Пауза
    if(pausePress == true){
        canvas.style.display = "none";
        document.getElementById("pause").style.display = "block";
    }
}

var statuswolf = 'right';
var wolfCounter = 0;

//Функция отвечающая за изменение игрового пространства при взаимодействии игрока
function update() {
    //Свободное падение
    if(persY < groundY - pers.heigth){
        persY += 5;
    }

    //движение волка
    if(wolfCounter <= 150 && statuswolf == 'right'){
        wolf.x += wolf.speed;
        wolfCounter++; 
        if(wolfCounter == 150){
            wolf.img.src = "./img/wolf.png";
            statuswolf = 'left';
        }
    }else{
        wolf.x -= wolf.speed;
        wolfCounter--;
        if(wolfCounter == 0 && statuswolf == 'left'){
            statuswolf = 'right';
            wolf.img.src = "./img/wolf2.png";
        }
    }

    //Удар волка
//     if((persX + pers.width >= wolf.x || persX <= wolf.x + wolf.width) && downPress == false){
//         pers.hp -= 30;
//     }

    //Движение вправо
    if(rightPress == true && downPress == false){
        pers.img.src = "./img/pers1.png";
        if(persX + pers.width != object.x || persY + pers.heigth < object.y){
            
            if(persY + pers.heigth < object.y){
                groundY = object.y;
            }
            if(persX > object.x + object.width){
                groundY = pers.y + pers.heigth;
            }
            if(persX == canvas.width / 2 && ground.x > -594){
                ground.x -= pers.speed;
                wolf.x -= pers.speed;
                object.x -= pers.speed;
                emerald.x -= pers.speed;
            }else
                persX += pers.speed;
        }

        if(persX == canvas.width - pers.width){
            canvas.style.display = "none";
            document.getElementById("gameover").style.display = "block";
            document.getElementById("result").innerText = "Ваш результат: " + score + " Ваше время: " + min + ":" + sek;
        }
    }

    //Дввижение влево
    if(leftPress == true && downPress == false){
        pers.img.src = "./img/pers2.png";
        if(persX > 0 && persX != object.x + object.width  || persY + pers.heigth < object.y){
            
            if(persY + pers.heigth < object.y){
                groundY = object.y;
            }
            if(persX + pers.width < object.x){
                groundY = pers.y + pers.heigth;
            }

            if(persX == canvas.width / 2 && ground.x < 0){
                ground.x += pers.speed;
                wolf.x += pers.speed;
                object.x += pers.speed;
                emerald.x += pers.speed;
            }else
                persX -= pers.speed;
        }
    }
    
    //Подбор изумруда
    if(persX == emerald.x && emerald.status != false){
        emerald.status = false;
        score++;
        pers.hp += 5; 
    }

    //Прыжок
    if(jumpPress == true && persY > groundY - 2 * pers.heigth){
        if(downPress == true){
            downPress = false;
            pers.img.src = "./img/pers.png";
        }else
            persY -= 8;
        if(persY == groundY - pers.heigth){
            jumpPress = false;
        }
    } 
    
    if(persY == groundY - pers.heigth * 2){
        jumpPress = false;
    }


    //Уход под землю
    if(downPress == true && jumpPress != true){
        pers.img.src = "./img/pers3.png";         
    }


    //Счетчик времени(таймер)
    if(counter % 60 == 0){
        sek++;
        pers.hp--;
        if(pers.hp == 0){
            document.getElementById("canvas").style.display = "none";
            document.getElementById("gameover").style.display = "block";
            document.getElementById("result").innerText = "Ваш результат: " + score + " Ваше время: " + min + ":" + sek;
        }

        if(sek % 60 == 0){
            sek = 0;
            min++;
        }
    }
    counter++;
}

//Функция отвечающая за отрисовку игровой сцены
function render() {
    context.drawImage(ground.img, ground.x, ground.y);
    if(emerald.status != false)
        context.drawImage(emerald.img, emerald.x, emerald.y, emerald.width, emerald.heigth);
    context.drawImage(pers.img, persX, persY, pers.width, pers.heigth);
    context.drawImage(object.img, object.x, object.y, object.width, object.heigth);
    context.drawImage(wolf.img, wolf.x, wolf.y, wolf.width, wolf.heigth);
    

    fonAudio.play();
    
    context.fillText("Здоровье: " + pers.hp, 50, 50);
    context.fillText("Игрок: " + username, 50, 100);
    context.fillText("Время: " + min + ":" + sek, canvas.width - 300, 50);
    context.fillText("Изумруды: " + score, canvas.width - 300, 100);
    context.font = "35px Verdana";
} 
