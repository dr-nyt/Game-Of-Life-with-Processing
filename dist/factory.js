var start = false;
var cells = [];
var possibleCells = [];
var tempPossibleCells = [];
document.getElementById("start").addEventListener('click', toggleStart);
function createCells(canvas) {
    var cellDimension = Math.round((1000 / cellsPerRow)).toString() + "px";
    for (var i = 0; i < cellPopulation; i++) {
        var cell = document.createElement('div');
        cell.id = i.toString();
        cell.className = "cell";
        cell.style.width = cellDimension;
        cell.style.height = cellDimension;
        cell.addEventListener('click', setAlive);
        cells.push(cell);
        canvas.appendChild(cell);
    }
}
function setAlive(event) {
    if (start)
        return;
    var targetCell = event.target;
    if (targetCell.classList.contains("alive")) {
        targetCell.classList.remove("alive");
        possibleCells = possibleCells.filter(function (cellID) { return targetCell.id !== cellID; });
    }
    else {
        targetCell.classList.add("alive");
        possibleCells.push(targetCell.id);
    }
    if (debug) {
        console.log("Selected Cell: " + targetCell.id);
    }
}
function toggleStart(event) {
    start = !start;
    var target = event.target;
    if (start) {
        target.innerText = "STOP";
        target.style.background = "red";
        prepGame();
        // startGame();
    }
    else {
        target.innerText = "START";
        target.style.background = "green";
    }
}
function prepGame() {
    possibleCells.sort(function (a, b) { return a - b; });
    console.log(possibleCells);
    for (var _i = 0, possibleCells_1 = possibleCells; _i < possibleCells_1.length; _i++) {
        var cellID = possibleCells_1[_i];
        if (cells[cellID].classList.contains("alive")) {
            console.log("Alive");
            gameRound(cellID, true);
        }
        else {
            console.log("Dead");
            gameRound(cellID, false);
        }
    }
}
function startGame() {
}
function gameRound(cellID, isAlive) {
    var cellNumber = parseInt(cellID);
    var survivalScore = 0;
    var North = cellNumber - cellsPerRow;
    var NorthWest = cellNumber - (cellsPerRow + 1);
    var NorthEast = cellNumber - (cellsPerRow - 1);
    var South = cellNumber + cellsPerRow;
    var SouthWest = cellNumber + (cellsPerRow - 1);
    var SouthEast = cellNumber + (cellsPerRow + 1);
    var West = cellNumber - 1;
    var East = cellNumber + 1;
    // North Side
    if (checkNorth(North)) {
        if (cells[North].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(North)) {
            possibleCells.push(North.toString());
            cells[North].style.background = "blue";
        }
    }
    if (checkNorthWest(NorthWest)) {
        if (cells[NorthWest].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(NorthWest)) {
            possibleCells.push(NorthWest.toString());
            cells[NorthWest].style.background = "blue";
        }
    }
    if (checkNorthEast(NorthEast)) {
        if (cells[NorthEast].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(NorthEast)) {
            possibleCells.push(NorthEast.toString());
            cells[NorthEast].style.background = "blue";
        }
    }
    // South Side
    if (checkSouth(South)) {
        if (cells[South].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(South)) {
            possibleCells.push(South.toString());
            cells[South].style.background = "blue";
        }
    }
    if (checkSouthWest(SouthWest)) {
        if (cells[SouthWest].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(SouthWest)) {
            possibleCells.push(SouthWest.toString());
            cells[SouthWest].style.background = "blue";
        }
    }
    if (checkSouthEast(SouthEast)) {
        if (cells[SouthEast].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(SouthEast)) {
            possibleCells.push(SouthEast.toString());
            cells[SouthEast].style.background = "blue";
        }
    }
    // Sides
    if (checkWest(West)) {
        if (cells[West].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(West)) {
            possibleCells.push(West.toString());
            cells[West].style.background = "blue";
        }
    }
    if (checkEast(East)) {
        if (cells[East].classList.contains("alive")) {
            survivalScore++;
        }
        else if (isAlive && !isPrePossible(East)) {
            possibleCells.push(East.toString());
            cells[East].style.background = "blue";
        }
    }
    if (survivalScore < 2 && isAlive) {
        setAliveState(cellNumber, false);
    }
    else if (survivalScore > 3 && isAlive) {
        setAliveState(cellNumber, false);
    }
    if (survivalScore === 3 && !isAlive) {
        setAliveState(cellNumber, true);
    }
    if (debug) {
        console.log(possibleCells);
    }
}
function isPrePossible(cellNumber) {
    for (var _i = 0, possibleCells_2 = possibleCells; _i < possibleCells_2.length; _i++) {
        var cellID = possibleCells_2[_i];
        if (parseInt(cellID) === cellNumber)
            return true;
    }
    return false;
}
function setAliveState(cellID, isAlive) {
    if (!isAlive) {
        cells[cellID].classList.remove("alive");
        possibleCells = possibleCells.filter(function (cellID) { return cells[cellID].id !== cellID.toString(); });
    }
    else {
        cells[cellID].classList.add("alive");
        possibleCells.push(cells[cellID].id);
    }
}
function checkNorth(pos) {
    var state = pos > 0;
    if (debug) {
        console.log("North: " + state);
    }
    return state;
}
function checkNorthWest(pos) {
    var state = pos > 0 && pos % cellsPerRow !== cellsPerRow - 1;
    if (debug) {
        console.log("NorthWest: " + state);
    }
    return state;
}
function checkNorthEast(pos) {
    var state = pos > 0 && pos % cellsPerRow !== 0;
    if (debug) {
        console.log("NorthEast: " + state);
    }
    return pos > 0 && pos % cellsPerRow !== 0;
}
function checkSouth(pos) {
    var state = pos < cellPopulation;
    if (debug) {
        console.log("South: " + state);
    }
    return state;
}
function checkSouthWest(pos) {
    var state = pos < cellPopulation && pos % cellsPerRow !== cellsPerRow - 1;
    if (debug) {
        console.log("SouthWest: " + state);
    }
    return state;
}
function checkSouthEast(pos) {
    var state = pos < cellPopulation && pos % cellsPerRow !== 0;
    if (debug) {
        console.log("SouthEast: " + state);
    }
    return state;
}
function checkWest(pos) {
    var state = pos % cellsPerRow !== cellsPerRow - 1 && pos > 0;
    if (debug) {
        console.log("West: " + state);
    }
    return state;
}
function checkEast(pos) {
    var state = pos % cellsPerRow !== 0 && pos < cellPopulation;
    if (debug) {
        console.log("East: " + state);
    }
    return state;
}
