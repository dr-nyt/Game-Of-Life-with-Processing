var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var start = false;
var cells = [];
var possibleCells = [];
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
        cells.push({ id: cell.id, element: cell, alive: false, survivalScore: 0 });
        canvas.appendChild(cell);
    }
}
function setAlive(event) {
    if (start)
        return;
    var targetCell = event.target;
    if (targetCell.classList.contains("alive")) {
        targetCell.classList.remove("alive");
        targetCell.style.background = "white";
        removePossibleCell(targetCell.id);
    }
    else {
        targetCell.classList.add("alive");
        removePossibleCell(targetCell.id);
        addPossibleCell(targetCell.id, true);
    }
    if (debug) {
        console.log("Selected Cell: " + targetCell.id);
    }
}
function addPossibleCell(cellID, isAlive) {
    possibleCells.push({ id: cellID, element: cells[cellID].element, alive: isAlive, survivalScore: 0 });
}
function removePossibleCell(cellID) {
    possibleCells = possibleCells.filter(function (cell) { return cellID !== cell.id; });
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
    return __awaiter(this, void 0, void 0, function () {
        var _i, possibleCells_1, cell, _a, possibleCells_2, cell;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!start) return [3 /*break*/, 2];
                    possibleCells.sort(function (a, b) { return a - b; });
                    for (_i = 0, possibleCells_1 = possibleCells; _i < possibleCells_1.length; _i++) {
                        cell = possibleCells_1[_i];
                        if (cell.element.classList.contains("alive")) {
                            console.log("Alive");
                            gameRound(cell, true);
                        }
                        else {
                            console.log("Dead");
                            gameRound(cell, false);
                        }
                    }
                    for (_a = 0, possibleCells_2 = possibleCells; _a < possibleCells_2.length; _a++) {
                        cell = possibleCells_2[_a];
                        if (cell.survivalScore < 2 && cell.alive) {
                            setAliveState(parseInt(cell.id), false);
                        }
                        else if (cell.survivalScore > 3 && cell.alive) {
                            setAliveState(parseInt(cell.id), false);
                        }
                        else if (cell.survivalScore === 3 && !cell.alive) {
                            setAliveState(parseInt(cell.id), true);
                        }
                        else if (cell.survivalScore === 0 && !cell.alive) {
                            cell.element.style.background = "white";
                            removePossibleCell(cell.id);
                        }
                    }
                    return [4 /*yield*/, sleep(500)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 0];
                case 2:
                    console.log(possibleCells);
                    return [2 /*return*/];
            }
        });
    });
}
var sleep = function (milliseconds) {
    return new Promise(function (resolve) { return setTimeout(resolve, milliseconds); });
};
function calcCellDir(cellNumber) {
    return {
        North: cellNumber - cellsPerRow,
        NorthWest: cellNumber - (cellsPerRow + 1),
        NorthEast: cellNumber - (cellsPerRow - 1),
        South: cellNumber + cellsPerRow,
        SouthWest: cellNumber + (cellsPerRow - 1),
        SouthEast: cellNumber + (cellsPerRow + 1),
        West: cellNumber - 1,
        East: cellNumber + 1
    };
}
function gameRound(cell, isAlive) {
    cell.survivalScore = 0;
    var cellNumber = parseInt(cell.id);
    var cellDir = calcCellDir(cellNumber);
    // North Side
    if (checkNorth(cellDir.North)) {
        if (cells[cellDir.North].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.North)) {
            addPossibleCell(cellDir.North.toString(), false);
            cells[cellDir.North].element.style.background = "blue";
        }
    }
    if (checkNorthWest(cellDir.NorthWest)) {
        if (cells[cellDir.NorthWest].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.NorthWest)) {
            addPossibleCell(cellDir.NorthWest.toString(), false);
            cells[cellDir.NorthWest].element.style.background = "blue";
        }
    }
    if (checkNorthEast(cellDir.NorthEast)) {
        if (cells[cellDir.NorthEast].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.NorthEast)) {
            addPossibleCell(cellDir.NorthEast.toString(), false);
            cells[cellDir.NorthEast].element.style.background = "blue";
        }
    }
    // South Side
    if (checkSouth(cellDir.South)) {
        if (cells[cellDir.South].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.South)) {
            addPossibleCell(cellDir.South.toString(), false);
            cells[cellDir.South].element.style.background = "blue";
        }
    }
    if (checkSouthWest(cellDir.SouthWest)) {
        if (cells[cellDir.SouthWest].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.SouthWest)) {
            addPossibleCell(cellDir.SouthWest.toString(), false);
            cells[cellDir.SouthWest].element.style.background = "blue";
        }
    }
    if (checkSouthEast(cellDir.SouthEast)) {
        if (cells[cellDir.SouthEast].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.SouthEast)) {
            addPossibleCell(cellDir.SouthEast.toString(), false);
            cells[cellDir.SouthEast].element.style.background = "blue";
        }
    }
    // Sides
    if (checkWest(cellDir.West)) {
        if (cells[cellDir.West].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.West)) {
            addPossibleCell(cellDir.West.toString(), false);
            cells[cellDir.West].element.style.background = "blue";
        }
    }
    if (checkEast(cellDir.East)) {
        if (cells[cellDir.East].element.classList.contains("alive")) {
            cell.survivalScore++;
        }
        else if (isAlive && !isPrePossible(cellDir.East)) {
            addPossibleCell(cellDir.East.toString(), false);
            cells[cellDir.East].element.style.background = "blue";
        }
    }
    if (debug) {
        console.log(possibleCells);
    }
}
function isPrePossible(cellNumber) {
    for (var _i = 0, possibleCells_3 = possibleCells; _i < possibleCells_3.length; _i++) {
        var cell = possibleCells_3[_i];
        if (parseInt(cell.id) === cellNumber)
            return true;
    }
    return false;
}
function setAliveState(cellID, isAlive) {
    if (!isAlive) {
        cells[cellID].element.classList.remove("alive");
        removePossibleCell(cellID.toString());
    }
    else {
        cells[cellID].element.classList.add("alive");
        addPossibleCell(cellID.toString(), true);
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
