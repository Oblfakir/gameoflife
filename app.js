var width = 900;
var cellSize = 9;
var positionX = 10;
var positionY = 10;
var DELTA_TIME = 50;
var canvas = document.getElementById("canvas").getContext("2d");
var field = document.getElementById("field").getContext("2d");
var start = document.getElementById("start");
var reset = document.getElementById("reset");
var pause = document.getElementById("pause");
var randomize = document.getElementById("randomize");
var arr = [];
var countArr = [];
var mark = false;
var interval;

function getRandomColor() {
    let r = (Math.floor(Math.random() * 255) + 1).toString(16);
    let g = (Math.floor(Math.random() * 255) + 1).toString(16);
    let b = (Math.floor(Math.random() * 255) + 1).toString(16);
    
    r = r.length > 1 ? r : '0' + r;
    g = g.length > 1 ? g : '0' + g;
    b = b.length > 1 ? b : '0' + b;
    
    return `#${r}${g}${b}`;
}

window.onload = function() {
    resetCountArr();
    fillArr();
    drawCells();
}
    
start.onclick = function(e) {
    e.preventDefault();
    mark = true;
    onStart();
}

reset.onclick = function(e) {
    e.preventDefault();
    clearInterval(interval);
    mark = false;
    resetCountArr();
    fillArr();
    clearField();
}

pause.onclick = function(e) {
    mark = !mark;
} 

window.onclick = function(e) {
    onClick(e.pageX, e.pageY);
}

randomize.onclick = function(e) {
    clearField();
    arr = [];
    
    for (var i = 0; i < 100; i++) {
        var subarr = [];
        
        for (var j = 0; j < 100; j++) {
            if (Math.random() < 0.2) {
                subarr.push({ color: getRandomColor(), status: true });
            } else {
                subarr.push({ color: getRandomColor(), status: false });
            }
        }

        arr.push(subarr);
    }
    
    drawFromArr();
}

function drawCells() {
    field.beginPath();
    
    for (var i = cellSize; i < width; i += cellSize) {
        field.moveTo(i, 0);
        field.lineTo(i, width);
        field.moveTo(0, i);
        field.lineTo(width, i);
    }
    
    field.closePath();
    field.strokeStyle = "lightgray";
    field.stroke();
}

function drawCell(x, y, color) {
    x = x * cellSize + 1;
    y = y * cellSize + 1;
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(x, y + cellSize - 2);
    canvas.lineTo(x + cellSize - 2, y + cellSize - 2);
    canvas.lineTo(x + cellSize - 2, y);
    canvas.lineTo(x, y);
    canvas.closePath();
    canvas.fillStyle = color;
    canvas.fill();
}

function eraseCell(x, y) {
    x = x * cellSize + 1;
    y = y * cellSize + 1;
    canvas.clearRect(x, y, cellSize - 2, cellSize - 2);
}

function fillArr() {
    arr = [];
    
    for (var i = 0; i < 100; i++) {
        var subarr = [];
        
        for (var j = 0; j < 100; j++) {
            subarr.push({ color: getRandomColor(), status: false });
        }
        
        arr.push(subarr);
    }
}

function resetCountArr() {
    countArr = [];
    
    for (var i = 0; i < 100; i++) {
        var countSubarr = [];
        
        for (var j = 0; j < 100; j++) {
            countSubarr.push(0);
        }
        
        countArr.push(countSubarr);
    }
}

function onClick(x, y) {
    if (x < width + positionX && y < width + positionY) {
        var posX = -1;
        var posY = -1;

        while (x > cellSize) {
            x -= cellSize;
            posX++;
        }
        while (y > cellSize) {
            y -= cellSize;
            posY++;
        }
        
        if (!arr[posX][posY].status) {
            drawCell(posX, posY, arr[posX][posY].color);
            arr[posX][posY].status = true;
        } else {
            eraseCell(posX, posY);
            arr[posX][posY].status = false;
        }
    }
}

function onStart() {
    if (interval){
        return;
    }
    
    interval = setInterval(function() {
        if (mark) {
            clearField();
            countNearbyCells();
            nextGeneration();
            resetCountArr();
            drawFromArr();
        }
    }, DELTA_TIME);
}

let qwe = true;

function countNearbyCells() {
    for (var i = 1; i < 99; i++) {
        for (var j = 1; j < 99; j++) {
            countArr[i][j] += Number(arr[i - 1][j].status);
            countArr[i][j] += Number(arr[i + 1][j].status);
            countArr[i][j] += Number(arr[i][j - 1].status);
            countArr[i][j] += Number(arr[i][j + 1].status);
            countArr[i][j] += Number(arr[i + 1][j + 1].status);
            countArr[i][j] += Number(arr[i - 1][j + 1].status);
            countArr[i][j] += Number(arr[i + 1][j - 1].status);
            countArr[i][j] += Number(arr[i - 1][j - 1].status);
        }
    }
}

function nextGeneration() {
    var newarr = [];
    
    for (var i = 0; i < 100; i++) {
        var subarr = [];
        
        for (var j = 0; j < 100; j++) {
            if ((countArr[i][j] > 3 || countArr[i][j] < 2) && arr[i][j].status) {
                subarr.push({color: arr[i][j].color, status: false});
            } else if ((countArr[i][j] == 2 || countArr[i][j] == 3) && arr[i][j].status) {
                subarr.push({color: arr[i][j].color, status: true});
            } else if (countArr[i][j] == 3 && !arr[i][j].status) {
                subarr.push({color: arr[i][j].color, status: true});
            } else {
                subarr.push({color: arr[i][j].color, status: false});
            }
        }
        
        newarr.push(subarr);
    }
    
    arr = newarr;
}

function drawFromArr() {
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            if (arr[i][j].status) {
                drawCell(i, j, arr[i][j].color);
            }
        }
    }
}

function clearField() {
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            eraseCell(i, j);
        }
    }
}