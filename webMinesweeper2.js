var field = [];
var showed = [];
var marked = [];
var initialClick = 1;
const fieldElement = document.getElementById('field');
var buttonElements = [];

const MINE_CNT = 10;
const ROWS = 10;
const COLS = 10;
const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

init();

function randInt(min, max) { // interval [min, max]
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function isValidCoord(row, col) {
    return 0 <= row && row < ROWS && 0 <= col && col < COLS;
}

function safeAccessField(row, col) {
    if (0 <= row && row < ROWS && 0 <= col && col < COLS) return field[row][col];
    else return -2;
}

function createMines(row_avoid=-1, col_avoid=-1) {
    // create mines
    let mine_created = 0;
    while (mine_created<MINE_CNT) {
        const row = randInt(0, ROWS-1);
        const col = randInt(0, COLS-1);
        if (field[row][col]!=-1 && row!=row_avoid && col!=col_avoid) {
            field[row][col] = -1;
            mine_created++;
        }
    }

    // fill field numbers
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            if (field[i][j]==-1) continue;
            for (let k=0; k<8; k++) {
                if (safeAccessField(i+directions[k][0], j+directions[k][1])==-1) field[i][j]+=1;
            }
        }
    }
}

function clearField() {
    field = new Array(ROWS);
    showed = new Array(ROWS);
    marked = new Array(ROWS);
    for (let i=0; i<ROWS; i++) {
        field[i] = new Array(COLS);
        showed[i] = new Array(COLS);
        marked[i] = new Array(COLS);
        for (let j=0; j<COLS; j++) {
            field[i][j] = 0;
            showed[i][j] = 0;
            marked[i][j] = 0;
        }
    }

    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            buttonElements[i][j].textContent = '';
            buttonElements[i][j].style['background-color'] = 'lightgray';
        }
    }

}

function checkEnd() {
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            if (field[i][j]!=-1 && !showed[i][j]) return;
        }
    }
    win();
}

async function win() {
    setTimeout(() => alert("축하합니다!"), 1);
}

async function gameOver() {
    alert("game over");
}

function onClick(e) {
    const row = e.target.parentElement.parentElement.rowIndex;
    const col = e.target.parentElement.cellIndex;

    if (showed[row][col] || marked[row][col]) return;
    
    if (initialClick) {
        initialClick = 0;
        clearField();
        createMines(row, col);
    }
    showCell(row, col);
    if (field[row][col] == -1) gameOver();

    checkEnd();
}

function onRightClick(e) {
    const row = e.target.parentElement.parentElement.rowIndex;
    const col = e.target.parentElement.cellIndex;

    if (showed[row][col]) return;

    if (marked[row][col]) {
        marked[row][col] = 0;
        buttonElements[row][col].style['background-color'] = 'lightgray';
    }
    else {
        marked[row][col] = 1;
        buttonElements[row][col].style['background-color'] = 'darkred';
    }
    
}

function onDoubleClick(e) {
    // TODO
    // showed=1 인 칸을 더블클릭하면 주변 셀을 열어줌
    const row = e.target.parentElement.parentElement.rowIndex;
    const col = e.target.parentElement.cellIndex;

    let marked_cnt = 0;
    for (let k=0; k<8; k++) {
        const _row = row+directions[k][0];
        const _col = col+directions[k][1];
        if (isValidCoord(_row, _col) && marked[_row][_col]) marked_cnt++;
    }

    if (marked_cnt != field[row][col]) return;

    for (let k=0; k<8; k++) {
        const _row = row+directions[k][0];
        const _col = col+directions[k][1];
        if (isValidCoord(_row, _col) && !marked[_row][_col]) {
            if (field[_row][_col]==-1) {
                gameOver();
            }
            else showCell(_row, _col);
        }
    }

    checkEnd();
}

function init() {
    // create arrays
    buttonElements = new Array(ROWS);
    for (let i=0; i<ROWS; i++) {
        buttonElements[i] = new Array(COLS);
    }

    // create buttons
    for (let i=0; i<ROWS; i++) {
        const new_row = fieldElement.insertRow();
        for (let j=0; j<COLS; j++) {
            const new_col = new_row.insertCell();
            let btn = document.createElement('button');
            
            // set attributes
            btn.textContent = '';
            btn.style['background-color'] = 'lightgray';
            btn.addEventListener('click', onClick);
            btn.addEventListener('contextmenu', onRightClick);
            btn.addEventListener('dblclick', onDoubleClick);

            // append
            new_col.append(btn);
            buttonElements[i][j] = btn;
        }
    }

    // initialize a game
    initGame();
}

function initGame() {
    clearField();
    initialClick = 1;

    // mines are created at first click

}

function showCell(row, col) {
    if (showed[row][col]) return;
    showed[row][col] = 1;

    if (field[row][col]!=0) buttonElements[row][col].textContent = field[row][col];
    buttonElements[row][col].style['background-color'] = 'gray';

    if (field[row][col] == 0) {
        for (let k=0; k<8; k++) {
            const _row = row + directions[k][0];
            const _col = col + directions[k][1];
            if (isValidCoord(_row, _col)) {
                showCell(_row, _col);
            }
        }
    }

}
