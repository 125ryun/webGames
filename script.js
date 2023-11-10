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

var field = [];
var showed = [];
var marked = [];

var initialClick = 0;

init();

function randInt(min, max) { // interval [min, max]
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function isValidCoord(row, col) {
    return ((0 <= row) && (row < ROWS) && (0 <= col) && (col < COLS));
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
      // btn.addEventListener('dblclick', onDoubleClick);

      // append button elements
      new_col.append(btn);
      buttonElements[i][j] = btn;
    }
  }

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

  // initialize a game
  initGame();
}

initGame();

function initGame() {
  clearField();
  initialClick = 1;
}

function clearField() {
  // clear field matrix
  for (let i=0; i<ROWS; i++) {
    for (let j=0; j<COLS; j++) {
      field[i][j] = 0;
      showed[i][j] = 0;
      marked[i][j] = 0;
    }
  }

  // clear button elements matrix
  for (let i=0; i<ROWS; i++) {
    for (let j=0; j<COLS; j++) {
      buttonElements[i][j].style.backgroundColor = 'lightgray';
      buttonElements[i][j].textContent = '';
    }
  }
}

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
      }
    }
  }
}

function onClick(e) {
  const row = e.target.parentElement.parentElement.rowIndex;
  const col = e.target.parentElement.cellIndex;

  if (initialClick) {
    initialClick = 0;
    createMines(row, col);
  }

  if (showed[row][col]) return;

  // if gameover or win, end game
  if (field[row][col] == -1) {
    gameover();
    return;
  }

  showCell(row, col);

  if (checkWin()) win();
}

function showCell(row, col) {
  console.log('showCell');
  if (showed[row][col]) return;

  // set bit
  showed[row][col] = 1;

  buttonElements[row][col].style['background-color'] = 'gray';

  if (field[row][col] == -1)
    buttonElements[row][col].textContent = '💥';
  if (field[row][col] > 0)
    buttonElements[row][col].textContent = field[row][col];

  // 주변 지뢰 개수가 0개인 칸을 클릭한 경우
  // 지뢰가 없는 다른 주변 칸의 값을 재귀적으로 깐다
  if (field[row][col] == 0) {
    for (let k=0; k<8; k++) {
      const _row = row + directions[k][0];
      const _col = col + directions[k][1];
      if (isValidCoord(_row, _col)) showCell(_row, _col);
    }
  }
}

// 경고창 띄우기 이 사이트 참고
// https://myhappyman.tistory.com/179

function gameover() {
  revealAnswer();
  setTimeout(() => alert("game over!"), 1);
  // initGame();
};

function checkWin() {
  console.log('called checkWin');
  for (let i=0; i<ROWS; i++) {
    for (let j=0; j<COLS; j++) {
      if (field[i][j] != -1 && !showed[i][j]) return 0;
    }
  }
  return 1;
};

function win() {
  revealAnswer();
  setTimeout(() => alert("축하합니다!"), 1);
  // initGame();
};

function revealAnswer() {
  for (let i=0; i<ROWS; i++) {
      for (let j=0; j<COLS; j++) {
          if (showed[i][j]) continue;
          showCell(i, j);
      }
  }
}

function onRightClick(e) {
  const row = e.target.parentElement.parentElement.rowIndex;
  const col = e.target.parentElement.cellIndex;

  if (showed[row][col]) return;

  markCell(row, col);
}

function markCell(row, col) {
  // reverse bit
  marked[row][col] = 1 - marked[row][col];

  // set color
  if (marked[row][col])
      buttonElements[row][col].style['background-color'] = 'darkred';
  else
      buttonElements[row][col].style['background-color'] = 'lightgray';
}