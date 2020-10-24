let start = false;

interface cellType {
    id: string
    element: HTMLElement,
    alive: boolean,
    survivalScore: number
}

let cells: cellType[] = [];

let possibleCells: cellType[] = [];

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
        cells.push({ id: cell.id, element: cell, alive: false, survivalScore: 0 });
        canvas.appendChild(cell);
    }
}

function setAlive(event: MouseEvent) {
    if (start) return;
    const targetCell = event.target as HTMLElement;
    if (targetCell.classList.contains("alive")) {
        targetCell.classList.remove("alive");
        targetCell.style.background = "white";
        removePossibleCell(targetCell.id);
    } else {
        targetCell.classList.add("alive");
        removePossibleCell(targetCell.id);
        addPossibleCell(targetCell.id, true);
    }
    if (debug) {
        console.log("Selected Cell: " + targetCell.id);
    }
}

function addPossibleCell(cellID: string, isAlive: boolean) {
    possibleCells.push({ id: cellID, element: cells[cellID].element, alive: isAlive, survivalScore: 0 });
}

function removePossibleCell(cellID: string) {
    possibleCells = possibleCells.filter(cell => cellID !== cell.id);
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

async function prepGame() {
    while (start) {
        possibleCells.sort(function (a: any, b: any) { return a - b });

        for (const cell of possibleCells) {
            if (cell.element.classList.contains("alive")) {
                console.log("Alive");
                gameRound(cell, true);
            } else {
                console.log("Dead");
                gameRound(cell, false);
            }
        }

        for (const cell of possibleCells) {
            if (cell.survivalScore < 2 && cell.alive) {
                setAliveState(parseInt(cell.id), false);
            } else if (cell.survivalScore > 3 && cell.alive) {
                setAliveState(parseInt(cell.id), false);
            } else if (cell.survivalScore === 3 && !cell.alive) {
                setAliveState(parseInt(cell.id), true);
            } else if (cell.survivalScore === 0 && !cell.alive) {
                cell.element.style.background = "white";
                removePossibleCell(cell.id);
            }
        }

        await sleep(500);
    }
    console.log(possibleCells);
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

interface cellDirObj {
    North: number,
    NorthWest: number,
    NorthEast: number,
    South: number,
    SouthWest: number,
    SouthEast: number,
    West: number,
    East: number,
}

function calcCellDir(cellNumber): cellDirObj {
    return {
        North: cellNumber - cellsPerRow,
        NorthWest: cellNumber - (cellsPerRow + 1),
        NorthEast: cellNumber - (cellsPerRow - 1),
        South: cellNumber + cellsPerRow,
        SouthWest: cellNumber + (cellsPerRow - 1),
        SouthEast: cellNumber + (cellsPerRow + 1),
        West: cellNumber - 1,
        East: cellNumber + 1,
    }
}

function gameRound(cell: cellType, isAlive: boolean) {
    cell.survivalScore = 0;

    const cellNumber = parseInt(cell.id);
    const cellDir = calcCellDir(cellNumber);

    // North Side
    if (checkNorth(cellDir.North)) {
        if (cells[cellDir.North].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.North)) {
            addPossibleCell(cellDir.North.toString(), false);
            cells[cellDir.North].element.style.background = "blue"
        }
    }
    if (checkNorthWest(cellDir.NorthWest)) {
        if (cells[cellDir.NorthWest].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.NorthWest)) {
            addPossibleCell(cellDir.NorthWest.toString(), false);
            cells[cellDir.NorthWest].element.style.background = "blue"
        }
    }
    if (checkNorthEast(cellDir.NorthEast)) {
        if (cells[cellDir.NorthEast].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.NorthEast)) {
            addPossibleCell(cellDir.NorthEast.toString(), false);
            cells[cellDir.NorthEast].element.style.background = "blue"
        }
    }

    // South Side
    if (checkSouth(cellDir.South)) {
        if (cells[cellDir.South].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.South)) {
            addPossibleCell(cellDir.South.toString(), false);
            cells[cellDir.South].element.style.background = "blue"
        }
    }
    if (checkSouthWest(cellDir.SouthWest)) {
        if (cells[cellDir.SouthWest].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.SouthWest)) {
            addPossibleCell(cellDir.SouthWest.toString(), false);
            cells[cellDir.SouthWest].element.style.background = "blue"
        }
    }
    if (checkSouthEast(cellDir.SouthEast)) {
        if (cells[cellDir.SouthEast].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.SouthEast)) {
            addPossibleCell(cellDir.SouthEast.toString(), false);
            cells[cellDir.SouthEast].element.style.background = "blue"
        }
    }

    // Sides
    if (checkWest(cellDir.West)) {
        if (cells[cellDir.West].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.West)) {
            addPossibleCell(cellDir.West.toString(), false);
            cells[cellDir.West].element.style.background = "blue"
        }
    }
    if (checkEast(cellDir.East)) {
        if (cells[cellDir.East].element.classList.contains("alive")) {
            cell.survivalScore++;
        } else if (isAlive && !isPrePossible(cellDir.East)) {
            addPossibleCell(cellDir.East.toString(), false);
            cells[cellDir.East].element.style.background = "blue"
        }
    }

    if (debug) {
        console.log(possibleCells);
    }
}

function isPrePossible(cellNumber: number) {
    for (const cell of possibleCells) {
        if (parseInt(cell.id) === cellNumber) return true;
    }
    return false;
}

function setAliveState(cellID: number, isAlive: boolean) {
    if (!isAlive) {
        cells[cellID].element.classList.remove("alive");
        removePossibleCell(cellID.toString());
    } else {
        cells[cellID].element.classList.add("alive");
        addPossibleCell(cellID.toString(), true);
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