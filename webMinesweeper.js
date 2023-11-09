
const fieldElement = document.getElementById('field');
var buttonElements = [];
var pressed = [];
var initialClick = 1;
/*
console.log(fieldElement);
var sth = fieldElement.rows;

console.log(fieldElement.childElements());
*/

const MINE_RATIO = 5; // 지뢰 : 빈칸 = 1 : MINERATIO
const N = 10;
const field = [];

initData();
//initButtonArr();
initFieldZero();
genRandomField();

async function clearCell(row, col) {
    if (field[row][col]) {
        field[row][col] = 0;
    }
}

async function initData() {
    var tmparr = [];

    for (let i=1; i<=N; i++) {
        let nr = fieldElement.insertRow();

        for (let j=1; j <=N; j++) {
            let nc = nr.insertCell();

            let btn = document.createElement('button');
            nc.append(btn);
            tmparr.push(btn);

            btn.textContent = '';
            btn.addEventListener('click', (event) => {
                let row = event.target.parentElement.parentElement.rowIndex;
                let col = event.target.parentElement.cellIndex;

                if (pressed[row][col]) return;
                
                if (initialClick) {
                    initialClick = 0;
                    clearCell(row, col);
                }

                var status = getCellStatus(row, col);
                btn.style['background-color'] = 'gray';
                
                showAdjecentCellStatus(row, col);

                if (status == -1) gameOver();

            });
            btn.addEventListener('contextmenu', (event) => {
                let row = event.target.parentElement.parentElement.rowIndex;
                let col = event.target.parentElement.cellIndex;

                if (pressed[row][col])
                    btn.style['background-color'] = 'lightgray';
                else
                    btn.style['background-color'] = 'darkred';
                pressed[row][col] = 1-pressed[row][col];
            })
        }
    }

    for (var i=0; i<N; i++) {
        let tmp = [];
        for (var j=0; j<N; j++) {
            tmp.push(tmparr[i * N + j]);
        }
        buttonElements.push(tmp);
    }

    console.log(buttonElements);

    for (var i=0; i<N; i++) {
        let tmp = [];
        for (var j=0; j<N; j++) {
            tmp.push(0);
        }
        pressed.push(tmp);
    }
}

async function initFieldZero() {
    for (var i=0; i<N+2; i++) {
        var tmp = [];
        for (var j=0; j<N+2; j++) {
            tmp.push(0);
        }
        field.push(tmp);
    }
}

async function genRandomField() {
    /**
     * 이부분 최적화 필요
     * N*N개 칸 다 순회할 게 아니라, 반대로 지뢰가 없는 빈칸 a개를 바로 추첨해야 함
     * 
     * 구상한 하나의 방법
     * 예를 들어 10*10 field일 경우 0~99 중 빈칸 개수만큼 수를 적당히 뽑음
     * 행번호 = 십의자리수, 열번호 = 일의자리수
     * 예를 들어 23이 뽑히면 field[2][3]은 지뢰가 없는 빈칸
     */
    for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= N; j++) {
            // rndint: 0 1 ... MINE_RATIO 중 하나의 정수
            let rndint = Math.floor(Math.random() * (MINE_RATIO+1));
            // rndint가 0일 경우
            // 해당 칸은 지뢰
            if (rndint == 0) { field[i][j] = 1; }
        }
    }
}

function getCellStatus(row, col) {
    row++; col++;

    if (field[row][col] == 1) return -1;

    var adjacentCells = [
        [row-1, col-1],
        [row-1, col], 
        [row-1, col+1],
        [row, col-1], 
        [row, col+1], 
        [row+1, col-1],
        [row+1, col],
        [row+1, col+1],
    ];

    var neighborMineCnt = 0;
    adjacentCells.forEach((pos) => {
        if (pos[0]<0 || pos[0]>N) return;
        if (pos[1]<0 || pos[1]>N) return;
        if (field[pos[0]][pos[1]]) neighborMineCnt++;
    })
    return neighborMineCnt;
}

function showCellStatus(row, col) {
    var cellStatus = getCellStatus(row, col);

    if (cellStatus == -1) return;
    
    buttonElements[row][col].textContent = cellStatus;
    buttonElements[row][col].style['background-color'] = 'gray';
    pressed[row][col] = 1;
}

function gameOver() {
    // show answer

    alert('gameover!!');
    //console.log('gameover!!');

    // clear game
    document.querySelectorAll('button').forEach((btn) => {
        btn.textContent = '';
        btn.style['background-color'] = 'lightgray';
    });

    // reset game
    genRandomField();   
}

async function showAdjecentCellStatus(row, col) {
    console.log('onclickSafeCell', row, col);

    var adjacentCellPos = [
        [row-1, col-1], 
        [row-1, col], 
        [row-1, col+1], 
        [row, col-1], 
        [row, col], // ********
        [row, col+1], 
        [row+1, col-1], 
        [row+1, col], 
        [row+1, col+1]
    ];

    adjacentCellPos.forEach((pos) => {
        if (pos[0]<0 || pos[0]>=N) return;
        if (pos[1]<0 || pos[1]>=N) return;
        showCellStatus(pos[0], pos[1]);
    })
}