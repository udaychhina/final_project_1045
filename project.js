"use strict";

//GLOBAL VARIABLES//
let ctx;

let gameOver = false;
let virusMovement;
let moveCount = 0;
let directions = ["left", "right", "up", "down"];
let validCoords = [25, 75, 125, 175, 225, 275, 325, 375, 425, 475];
let direction = getDirection();

let walls = new Array();

let time = 13000;

let docSpawner = undefined;
let docTimer = undefined;

let hands = new Hands(25, 25);
let doc = new Doctor(undefined, undefined);
let mask = new Mask(undefined, undefined);
let corona = new Corona(randomXCoord(), randomYCoord());
let soap = new Soap(randomXCoord(), randomYCoord());

let score = 0;

//SETUP//
function setup() {
    ctx = document.getElementById("surface").getContext("2d");
    for(let i = 0; i < 15; i++) {
        walls.push(new Wall(randomXCoord(), randomYCoord()));
        while(walls[i].x == 25 && walls[i].y == 25) {
            walls[i] = new Wall(randomXCoord(), randomYCoord());
        }
    }
    docSpawner = setInterval(docSpawn, time);
    if(gameOver) {
        clearInterval(docSpawner);
    }
	draw();
}

//LOGIC//

//CONSTRUCTORS//

function Wall(x, y) {
    this.x = x;
    this.y = y;
}

function Hands(x, y) {
    this.x = x;
    this.y = y;
}

function Mask(x, y) {
    this.x = x;
    this.y = y;
}

function Corona(x, y) {
    this.x = x;
    this.y = y;
}

function Soap(x, y) {
    this.x = x;
    this.y = y;
}

function Doctor(x, y) {
    this.x = x;
    this.y = y;
}

//HELPER FUNCTIONS//

function reset() {
    gameOver = false;
    hands.x = 25;
    hands.y = 25;
    soap.x = randomXCoord();
    soap.y = randomYCoord();
    corona.x = randomXCoord();
    corona.y = randomYCoord();
    score = 0;
    draw();
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function isValidForSoap(x, y) {
    let flag = true;
    for(let i = 0; i < walls.length; i++) {
        if(x == walls[i].x && y == walls[i].y) {
            flag = false;
        }
    }
    if(x == corona.x && y == corona.y) {
        flag = false;
    }
    if(x < 25 || x > 475 || y < 25 || y > 475) {
        flag = false;
    }
    return flag;
}

function isValidForCorona(x, y) {
    let flag = true;
    for(let i = 0; i < walls.length; i++) {
        if(x == walls[i].x && y == walls[i].y) {
            flag = false;
        }
    }
    return flag;
}

function isValidForDoc(x, y) {
    let flag = true;
    for(let i = 0; i < walls.length; i++) {
        if(x == walls[i].x && y == walls[i].y) {
            flag = false;
        }
    }
    if(x == corona.x && y == corona.y) {
        flag = false;
    }
    if(x < 25 || x > 475 || y < 25 || y > 475) {
        flag = false;
    }
    if(x == soap.x && y == soap.y) {
        flag = false;
    }
    return flag;
}

function randomXCoord() {
    let coordinate = Math.round(getRandomNumber(0, 9));
    return validCoords[coordinate];
}

function randomYCoord() {
    let coordinate = Math.round(getRandomNumber(0, 9));
    return validCoords[coordinate];
}

function isOffGrid(x, y) {
    if(y < 0 || y > 500 || x < 0 || x > 500) {
        return true;
    } else {
        return false;
    }
}

function isWall(x, y) {
    let flag = false;
    for(let i = 0; i < walls.length; i++) {
        if(x == walls[i].x && y == walls[i].y) {
            flag = true;
        }
    }
    return flag;
}

function isSoap(x, y) {
    if(y == soap.y && x == soap.x) {
        return true;
    }
}

function isCorona() {
    if(hands.y == corona.y && hands.x == corona.x) {
        return true;

    }
}

function isMask(x, y) {
    if(x == mask.x && y == mask.y) {
        return true;
    } else {
        return false;
    }
}

function isHands(x, y) {
    if(x == hands.x && y == hands.y) {
        return true;
    } else {
        return false;
    }
}

function isDoctor(x, y) {
    if(x == doc.x && y == doc.y) {
        return true;
    } else {
        return false;
    }
}

//DOCTOR TIMERS & HELPERS//

function docSpawn() {
    doc.x = randomXCoord();
    doc.y = randomYCoord();
    while(!isValidForDoc(doc.x, doc.y)) {
        doc.x = randomXCoord();
        doc.y = randomYCoord();
    }
    docTimer = setTimeout(docTimeOut, time - 10000);
    draw();
}

function docTimeOut() {
    doc.x = undefined;
    doc.y = undefined;
    draw();
}

//VIRUS MOVEMENT HELPER FUNCTIONS//

function play() {
    if(virusMovement == undefined) {
        virusMovement = setInterval(moveVirus, 300);
    }
}

function pause() {
    clearInterval(virusMovement);
    virusMovement = undefined;
}

function getDirection() {
    return directions[Math.round(getRandomNumber(0, 3))];
}

//MOVING VIRUS//

function moveVirus() {
    if(!gameOver) {
        if(moveCount == 8) {
            direction = getDirection();
            moveCount = 0;
        }
        switch(direction) {
            //MOVE VIRUS UPWARDS//
            case "up":
                corona.y -= 50;
                if(isHands(corona.x, corona.y)) {
                    gameOver = true;
                    break;
                }
                if(isOffGrid(corona.x, corona.y)) {
                    corona.y += 50;
                    direction = getDirection();
                } 
                if(isWall(corona.x, corona.y)) {
                    corona.y += 50;
                    direction = getDirection();
                } 
                if(isSoap(corona.x, corona.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                    while(!isValidForSoap(soap.x, soap.y)) {
                        soap.y = randomXCoord();
                        soap.x = randomYCoord();
                    }
                    score -= 100;
                    break;
                } 
                if(isMask(corona.x, corona.y)) {
                    corona.x = randomXCoord();
                    corona.y = randomYCoord();
                    mask.x = undefined;
                    mask.y = undefined;
                    score += 150;
                }
                break;

            //MOVE VIRUS DOWNWARDS//
            case "down":
                corona.y += 50;
                if(isHands(corona.x, corona.y)) {
                    gameOver = true;
                    break;
                }
                if(isOffGrid(corona.x, corona.y)) {
                    corona.y -= 50;
                    direction = getDirection();
                }
                if(isWall(corona.x, corona.y)) {
                    corona.y -= 50;
                    direction = getDirection();
                }
                if(isSoap(corona.x, corona.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                    while(!isValidForSoap(soap.x, soap.y)) {
                        soap.y = randomXCoord();
                        soap.x = randomYCoord();
                    }
                    score -= 100;
                    break;
                }
                if(isMask(corona.x, corona.y)) {
                    corona.x = randomXCoord();
                    corona.y = randomYCoord();
                    mask.x = undefined;
                    mask.y = undefined;
                    score += 150;
                }
                break;
            
            //MOVE VIRUS LEFT//
            case "left":
                corona.x -= 50;
                if(isHands(corona.x, corona.y)) {
                    gameOver = true;
                    break;
                }
                if(isOffGrid(corona.x, corona.y)) {
                    corona.x += 50;
                    direction = getDirection();
                }
                if(isWall(corona.x, corona.y)) {
                    corona.x += 50;
                    direction = getDirection();
                }
                if(isSoap(corona.x, corona.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                    while(!isValidForSoap(soap.x, soap.y)) {
                        soap.y = randomXCoord();
                        soap.x = randomYCoord();
                    }
                    score -= 100;
                    break;
                }
                if(isMask(corona.x, corona.y)) {
                    corona.x = randomXCoord();
                    corona.y = randomYCoord();
                    mask.x = undefined;
                    mask.y = undefined;
                    score += 150;
                }
                break;

            //MOVE VIRUS RIGHT//
            case "right":
                corona.x += 50;
                if(isHands(corona.x, corona.y)) {
                    gameOver = true;
                    break;
                }
                if(isOffGrid(corona.x, corona.y)) {
                    corona.x -= 50;
                    direction = getDirection();
                }
                if(isWall(corona.x, corona.y)) {
                    corona.x -= 50;
                    direction = getDirection();
                }
                if(isSoap(corona.x, corona.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                    while(!isValidForSoap(soap.x, soap.y)) {
                        soap.y = randomXCoord();
                        soap.x = randomYCoord();
                    }
                    score -= 100;
                    break;
                }
                if(isMask(corona.x, corona.y)) {
                    corona.x = randomXCoord();
                    corona.y = randomYCoord();
                    mask.x = undefined;
                    mask.y = undefined;
                    score += 150;
                }
                break;       
        }
        moveCount++;
        draw();
    } else {
        return;
    }
}


//EVENT LISTENERS//
//MOVING HANDS//

addEventListener("keydown", function(e) {
	//Move Hands Up
	if(e.key == "ArrowUp") {
        if(!gameOver) {
            hands.y -= 50;
            if(isOffGrid(hands.x, hands.y)) {
                hands.y += 50;
                this.alert("Can't go off the playing area!");
            }
            if(isSoap(hands.x, hands.y)) {
                soap.y = randomXCoord();
                soap.x = randomYCoord();
                while(!isValidForSoap(soap.x, soap.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                }  
                score += 50;
            }
            if(isCorona()) {
                gameOver = true;
            }
            if(isWall(hands.x, hands.y)) {
                hands.y += 50;
            }
            if(isDoctor(hands.x, hands.y)) {
                score *= 2;
                doc.x = undefined;
                doc.y = undefined;
            }
            draw();
        } else {
            return;
        }
	}

	//Move Hands Left
	if(e.key == "ArrowLeft") {
		if(!gameOver) {
            hands.x -= 50;
            if(isOffGrid(hands.x, hands.y)) {
                hands.x += 50;
                this.alert("Can't go off the playing area!");
            }
            if(isSoap(hands.x, hands.y)) {
                soap.y = randomXCoord();
                soap.x = randomYCoord();
                while(!isValidForSoap(soap.x, soap.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                }
                score += 50;  
            }
            if(isCorona()) {
                gameOver = true;
            }
            if(isWall(hands.x, hands.y)) {
                hands.x += 50;
            }
            if(isDoctor(hands.x, hands.y)) {
                score *= 2;
                doc.x = undefined;
                doc.y = undefined;
            }
            draw();
        } else {
            return;
        }
	}

	//Move Hands Right
	if(e.key == "ArrowRight") {
		if(!gameOver) {
            hands.x += 50;
            if(isOffGrid(hands.x, hands.y)) {
                hands.x -= 50;
                this.alert("Can't go off the playing area!");
            }
            if(isSoap(hands.x, hands.y)) {
                soap.y = randomXCoord();
                soap.x = randomYCoord();
                while(!isValidForSoap(soap.x, soap.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                }
                score += 50;  
            }
            if(isCorona()) {
                gameOver = true;
            }
            if(isWall(hands.x, hands.y)) {
                hands.x -= 50;
            }
            if(isDoctor(hands.x, hands.y)) {
                score *= 2;
                doc.x = undefined;
                doc.y = undefined;
            }
            draw();
        } else {
            return;
        }
	}

	//Move Hands Down
	if(e.key == "ArrowDown") {
		if(!gameOver) {
            hands.y += 50;
            if(isOffGrid(hands.x, hands.y)) {
                hands.y -= 50;
                this.alert("Can't go off the playing area!");
            }
            if(isSoap(hands.x, hands.y)) {
                soap.y = randomXCoord();
                soap.x = randomYCoord();
                while(!isValidForSoap(soap.x, soap.y)) {
                    soap.y = randomXCoord();
                    soap.x = randomYCoord();
                }
                score += 50;  
            }
            if(isCorona()) {
                gameOver = true;
            }
            if(isWall(hands.x, hands.y)) {
                hands.y -= 50;
            }
            if(isDoctor(hands.x, hands.y)) {
                score *= 2;
                doc.x = undefined;
                doc.y = undefined;
            }
            draw();
        } else {
            return;
        }
    }
    //PLACE THE MASK//
    if(e.key == " ") {
        mask.x = hands.x;
        mask.y = hands.y;
        draw();
    }
});


//DRAWINGS//
function draw() {
    ctx.clearRect(0, 0, 500, 500);
    drawPattern(250, 250);
    document.getElementById("handCount").innerHTML = "Score: " + score;
    drawGrid();
    if(!gameOver) {
        for(let i = 0; i < walls.length; i++) {
            drawWalls(walls[i].x, walls[i].y);
        }
        while(!isValidForCorona(corona.x, corona.y)) {
            corona.x = randomXCoord();
            corona.y = randomYCoord();
        }
        drawCoronavirus(corona.x, corona.y);
        while(!isValidForSoap(soap.x, soap.y)) {
            soap.x = randomXCoord();
            soap.y = randomYCoord();
        }
        drawSoap(soap.x, soap.y);
        drawHands(hands.x, hands.y);
        if(mask.x !== undefined && mask.y !== undefined) {
            drawMask(mask.x, mask.y);
        }
        if(doc.x != undefined && doc.y != undefined) {
            drawDoctor(doc.x, doc.y);
        }
    } else {
        drawGameover();
    }
}

//Draw Grid//
function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    for (let i = 0; i < 550; i += 50) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 500);
        
    }
    for (let i = 0; i < 550; i += 50) {
        ctx.moveTo(0, i);
        ctx.lineTo(500, i);
    }
    ctx.stroke();
}

//Draw Doc//
function drawDoctor(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.stroke()

    ctx.restore();
}

//Draw Mask//
function drawMask(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(-12.5, -5, 25, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "lightblue"
    ctx.fillRect(-12.5, -1, 25, 16);

    ctx.beginPath();
    ctx.strokeStyle = "black"
    ctx.rect(-12.5, -1, 25, 16);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-12.5, 5, 10, 90 * (Math.PI / 180), 270 * (Math.PI / 180));
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(12.5, 5, 10, 270 * (Math.PI / 180), 90 * (Math.PI / 180));
    ctx.stroke();

    ctx.restore();
}

//Draw Soap//
function drawSoap(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(-10, -6, 14, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(-10, -6, 14, 20);

    ctx.beginPath();
    ctx.fillStyle = "lightblue";
    ctx.fillRect(-10, 0, 14, 8);

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(-7.5, -10, 9, 4);

    ctx.beginPath();
    ctx.moveTo(-3, -10);
    ctx.lineTo(-3, -15);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, -14);
    ctx.lineTo(5, -14);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(10, -12, 2.5, 0, 360 * (Math.PI/180));
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(12, -6, 1.5, 0, 360 * (Math.PI/180));
    ctx.stroke();

    ctx.beginPath();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "purple";
    ctx.fillRect(-20, -20, 40, 40);

    ctx.restore();
}


//Draw Coronavirus//
function drawCoronavirus(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    for (let i = 0; i < 18; i++) {
        ctx.rotate(20 * (Math.PI / 180));
        ctx.moveTo(-8, 0);
        ctx.lineTo(17, 0);
        ctx.strokeStyle = "green";
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 12.5, 0, 360 * (Math.PI / 180));
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 12.5, 0, 360 * (Math.PI / 180));
    ctx.fillStyle = "lightgreen";
    ctx.fill();

    ctx.beginPath();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "red";
    ctx.arc(0, 0, 20, 0, 360 * (Math.PI / 180));
    ctx.fill();

    ctx.restore();

}

//Draw Hands//
function drawHands(x, y) {
    ctx.save();
    ctx.translate(x, y);

    //common part
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 10);
    ctx.moveTo(-8, 10);
    ctx.lineTo(8, 10);
    ctx.stroke();

    //left hand
    ctx.beginPath();
    ctx.moveTo(-8, 10);
    ctx.lineTo(-8, 4);
    ctx.lineTo(-16, -2);
    ctx.lineTo(-16, -15);
    ctx.arc(-14, -15, 2, Math.PI, 0);
    ctx.lineTo(-12, -7);
    ctx.lineTo(-7, -3);
    ctx.arc(-7, -5, 2, 145 * (Math.PI / 180), 325 * (Math.PI / 180));
    ctx.lineTo(0, 0)
    ctx.stroke();

    //right hand
    ctx.beginPath();
    ctx.moveTo(8, 10);
    ctx.lineTo(8, 4);
    ctx.lineTo(16, -2);
    ctx.lineTo(16, -15);
    ctx.arc(14, -15, 2, Math.PI, 0);
    ctx.moveTo(12, -15);
    ctx.lineTo(12, -7);
    ctx.lineTo(7, -3);
    ctx.stroke();
    ctx.beginPath()
    ctx.arc(7, -5, 2, 235 * (Math.PI / 180), 55 * (Math.PI / 180));
    ctx.moveTo(6, -6);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "orange";
    ctx.arc(0, 0, 20, 0, 360 * (Math.PI / 180));
    ctx.fill();

    ctx.restore();
}

//Draw Walls//
function drawWalls(x, y) {
    ctx.save();
    ctx.translate(x - 10, y);

    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black"
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.lineTo(-3, 15);
    ctx.moveTo(0, 5);
    ctx.lineTo(3, 15);
    ctx.moveTo(0, -5);
    ctx.lineTo(-3, 5);
    ctx.moveTo(0, -5);
    ctx.lineTo(3, 5)
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.restore();

    ctx.save();
    ctx.translate(x + 10, y);

    ctx.beginPath();
    ctx.arc(0, -10, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black"
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.lineTo(-3, 15);
    ctx.moveTo(0, 5);
    ctx.lineTo(3, 15);
    ctx.moveTo(0, -5);
    ctx.lineTo(-3, 5);
    ctx.moveTo(0, -5);
    ctx.lineTo(3, 5)
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.restore();
}

//Draw Aesthetic Pattern//
function drawPattern(x, y) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.arc(0, 0, 235, 0, 360 * (Math.PI / 180));
    ctx.fillStyle = "lightblue";
    ctx.fill();

    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "lightgreen"
    ctx.arc(0, 0, 235, 345 * (Math.PI / 180), 110 * (Math.PI / 180));   
    ctx.fill();

    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "lightgreen";
    ctx.arc(0, 0, 235, 170 * (Math.PI / 180), 300 * (Math.PI / 180));
    ctx.fill();

    ctx.restore();
}

//DRAW GAME OVER//
function drawGameover() {
    ctx.font = "100px Times New Roman";
    ctx.fillStyle = "brown";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", 250, 280);
}