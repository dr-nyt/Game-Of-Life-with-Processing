let start = false;

let cells: HTMLDivElement[] = [];
let possibleCells: string[] = [];
let tempPossibleCells: string[] = [];

document.getElementById("start").addEventListener('click', toggleStart);

function createCells(canvas: HTMLElement) {
    const cellDimension = Math.round((1000 / cellsPerRow)).toString() + "px";
    for (let i = 0; i < cellPopulation; i++) {
        const cell = document.createElement('div');
        cell.id = i.toString();
        cell.className = "cell";
        cell.style.width = cellDimension;
        cell.style.height = cellDimension;
        cell.addEventListener('click', setAlive)
        cells.push(cell);
        canvas.appendChild(cell);
    }
}

function setAlive(event: MouseEvent) {
    if (start) return;
    const targetCell = event.target as HTMLElement;
    if (targetCell.classList.contains("alive")) {
        targetCell.classList.remove("alive");
        possibleCells = possibleCells.filter(cellID => targetCell.id !== cellID);
    } else {
        targetCell.classList.add("alive");
        possibleCells.push(targetCell.id);
    }
    if (debug) {
        console.log("Selected Cell: " + targetCell.id);
    }
}

function toggleStart(event: MouseEvent) {
    start = !start;
    const target = event.target as HTMLElement;
    if (start) {
        target.innerText = "STOP";
        target.style.background = "red";
        prepGame();
        // startGame();
    } else {
        target.innerText = "START";
        target.style.background = "green";
    }
}

function prepGame() {
    possibleCells.sort(function (a: any, b: any) { return a - b });
    console.log(possibleCells);
    for (const cellID of possibleCells) {
        if (cells[cellID].classList.contains("alive")) {
            console.log("Alive");
            gameRound(cellID, true);
        } else {
            console.log("Dead");
            gameRound(cellID, false);
        }
    }
}

function startGame() {

}

function gameRound(cellID: string, isAlive: boolean) {
    const cellNumber = parseInt(cellID);
    let survivalScore = 0;

    const North = cellNumber - cellsPerRow;
    const NorthWest = cellNumber - (cellsPerRow + 1);
    const NorthEast = cellNumber - (cellsPerRow - 1)

    const South = cellNumber + cellsPerRow;
    const SouthWest = cellNumber + (cellsPerRow - 1);
    const SouthEast = cellNumber + (cellsPerRow + 1)

    const West = cellNumber - 1;
    const East = cellNumber + 1;

    // North Side
    if (checkNorth(North)) {
        if (cells[North].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(North)) {
            possibleCells.push(North.toString());
            cells[North].style.background = "blue"
        }
    }
    if (checkNorthWest(NorthWest)) {
        if (cells[NorthWest].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(NorthWest)) {
            possibleCells.push(NorthWest.toString());
            cells[NorthWest].style.background = "blue"
        }
    }
    if (checkNorthEast(NorthEast)) {
        if (cells[NorthEast].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(NorthEast)) {
            possibleCells.push(NorthEast.toString());
            cells[NorthEast].style.background = "blue"
        }
    }

    // South Side
    if (checkSouth(South)) {
        if (cells[South].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(South)) {
            possibleCells.push(South.toString());
            cells[South].style.background = "blue"
        }
    }
    if (checkSouthWest(SouthWest)) {
        if (cells[SouthWest].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(SouthWest)) {
            possibleCells.push(SouthWest.toString());
            cells[SouthWest].style.background = "blue"
        }
    }
    if (checkSouthEast(SouthEast)) {
        if (cells[SouthEast].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(SouthEast)) {
            possibleCells.push(SouthEast.toString());
            cells[SouthEast].style.background = "blue"
        }
    }

    // Sides
    if (checkWest(West)) {
        if (cells[West].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(West)) {
            possibleCells.push(West.toString());
            cells[West].style.background = "blue"
        }
    }
    if (checkEast(East)) {
        if (cells[East].classList.contains("alive")) {
            survivalScore++;
        } else if (isAlive && !isPrePossible(East)) {
            possibleCells.push(East.toString());
            cells[East].style.background = "blue"
        }
    }

    if (survivalScore < 2 && isAlive) {
        setAliveState(cellNumber, false);
    } else if (survivalScore > 3 && isAlive) {
        setAliveState(cellNumber, false);
    }

    if (survivalScore === 3 && !isAlive) {
        setAliveState(cellNumber, true);
    }

    if (debug) {
        console.log(possibleCells);
    }
}

function isPrePossible(cellNumber: number) {
    for (const cellID of possibleCells) {
        if (parseInt(cellID) === cellNumber) return true;
    }
    return false;
}

function setAliveState(cellID: number, isAlive: boolean) {
    if (!isAlive) {
        cells[cellID].classList.remove("alive");
        possibleCells = possibleCells.filter(cellID => cells[cellID].id !== cellID.toString());
    } else {
        cells[cellID].classList.add("alive");
        possibleCells.push(cells[cellID].id);
    }
}

function checkNorth(pos: number) {
    const state = pos > 0;
    if (debug) {
        console.log("North: " + state);
    }
    return state;
}

function checkNorthWest(pos: number) {
    const state = pos > 0 && pos % cellsPerRow !== cellsPerRow - 1;
    if (debug) {
        console.log("NorthWest: " + state);
    }
    return state;
}

function checkNorthEast(pos: number) {
    const state = pos > 0 && pos % cellsPerRow !== 0;
    if (debug) {
        console.log("NorthEast: " + state);
    }
    return pos > 0 && pos % cellsPerRow !== 0;
}

function checkSouth(pos: number) {
    const state = pos < cellPopulation;
    if (debug) {
        console.log("South: " + state);
    }
    return state;
}

function checkSouthWest(pos: number) {
    const state = pos < cellPopulation && pos % cellsPerRow !== cellsPerRow - 1;
    if (debug) {
        console.log("SouthWest: " + state);
    }
    return state;
}

function checkSouthEast(pos: number) {
    const state = pos < cellPopulation && pos % cellsPerRow !== 0
    if (debug) {
        console.log("SouthEast: " + state);
    }
    return state;
}

function checkWest(pos: number) {
    const state = pos % cellsPerRow !== cellsPerRow - 1 && pos > 0;
    if (debug) {
        console.log("West: " + state);
    }
    return state;
}

function checkEast(pos: number) {
    const state = pos % cellsPerRow !== 0 && pos < cellPopulation;
    if (debug) {
        console.log("East: " + state);
    }
    return state;
}