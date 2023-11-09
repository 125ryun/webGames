const fieldElement = document.getElementById('field');
var buttonElements = [];

var field = [];
var showed = [];
var marked = [];

var initialClick = 1;

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
    return ((0 <= row) && (row < ROWS) && (0 <= col) && (col < COLS));
}

/*
function safeAccessField(row, col) {
    if (0 <= row && row < ROWS && 0 <= col && col < COLS) return field[row][col];
    else return -2;
}
*/

function createMines(row_avoid=-1, col_avoid=-1) {
    // create mines
    let mine_created = 0;
    while (mine_created < MINE_CNT) {
        const row = randInt(0, ROWS-1);
        const col = randInt(0, COLS-1);
        if (field[row][col] != -1 
            && row != row_avoid && col!=col_avoid) {
            field[row][col] = -1;
            mine_created++;
        }
    }

    // fill field numbers
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            if (field[i][j] == -1) continue;
            for (let k=0; k<8; k++) {
                const _row = i + directions[k][0];
                const _col = j + directions[k][1];
                if (isValidCoord(_row, _col) && field[_row][_col] == -1)
                    field[i][j] += 1;
                // if (safeAccessField(i+directions[k][0], j+directions[k][1])==-1) field[i][j]+=1;
            }
        }
    }
}

function clearField() {
    // clear field matrix
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

    // clear button elements matrix
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            buttonElements[i][j].style['backgroundColor'] = 'lightgray';
            // buttonElements[i][j].style.backgroundColor = '#CDCDCD';
            console.log('reset color of', i, j, buttonElements[i][j].style.backgroundColor);
            buttonElements[i][j].textContent = '';
        }
    }
}

function checkWin() {
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            if (field[i][j]!= -1 && !showed[i][j]) return;
        }
    }
    win();
}

async function win() {
    // revealAnswer();
    setTimeout(() => alert("축하합니다!"), 1);
    // initGame();
}

async function gameover() {
    // revealAnswer();
    alert("game over");
    // setTimeout(() => alert("game over!"), 1);
    // initGame();
}

function onClick(e) {
    const row = e.target.parentElement.parentElement.rowIndex;
    const col = e.target.parentElement.cellIndex;

    // if (showed[row][col] || marked[row][col]) return;
    if (showed[row][col]) return;
    
    if (initialClick) {
        initialClick = 0;
        // clearField();
        createMines(row, col);
    }
    else {
        if (field[row][col] == -1) gameover();
        checkWin();
    }

    showCell(row, col);
}

function onRightClick(e) {
    const row = e.target.parentElement.parentElement.rowIndex;
    const col = e.target.parentElement.cellIndex;

    if (showed[row][col]) return;

    // reverse bit
    marked[row][col] = 1 - marked[row][col];
    
    // if (marked[row][col]) {
    //     marked[row][col] = 0;
    //     buttonElements[row][col].style['background-color'] = 'lightgray';
    // }
    // else {
    //     marked[row][col] = 1;
    //     buttonElements[row][col].style['background-color'] = 'darkred';
    // }

    // set color
    if (marked[row][col])
        buttonElements[row][col].style['background-color'] = 'darkred';
    else
        buttonElements[row][col].style['background-color'] = 'lightgray';
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
        const _row = row + directions[k][0];
        const _col = col + directions[k][1];
        if (isValidCoord(_row, _col) && !marked[_row][_col]) {
            if (field[_row][_col] == -1) {
                gameover();
            }
            else showCell(_row, _col);
        }
    }

    checkWin();
}

function init() {
    // create button elements arrays
    buttonElements = new Array(ROWS);
    for (let i=0; i<ROWS; i++) {
        buttonElements[i] = new Array(COLS);
    }

    // create button elements
    for (let i=0; i<ROWS; i++) {
        const new_row = fieldElement.insertRow();
        for (let j=0; j<COLS; j++) {
            const new_col = new_row.insertCell();
            let btn = document.createElement('button');
            
            // add button event listeners
            btn.addEventListener('click', onClick);
            btn.addEventListener('contextmenu', onRightClick);
            btn.addEventListener('dblclick', onDoubleClick);

            // append button elements
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
}

function showCell(row, col) {
    if (showed[row][col]) return;

    showed[row][col] = 1;

    // buttonElements[row][col].style['backgroundColor'] = 'gray';
    buttonElements[row][col].style.backgroundColor = 'gray';
    if (field[row][col] != 0)
        buttonElements[row][col].textContent = field[row][col];

    // 주변 지뢰 개수가 0개인 칸을 클릭한 경우
    // 지뢰가 없는 다른 주변 칸의 값을 재귀적으로 깐다
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

function revealAnswer() {
    for (let i=0; i<ROWS; i++) {
        for (let j=0; j<COLS; j++) {
            if (showed[i][j]) continue;
            // showCell[i][j];
        }
    }
}