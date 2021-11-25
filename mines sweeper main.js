
var gClickCount;
var gBombsOdds;
var gRows;
var gCols;
var gBoard;
const winningStr = 'congrarts you won!!'
const loseStr = 'you lose!'
const BOMB_IMG = '<img src="img/bomb.png" />';
var gIsVictory;
var gIsLose;
var gcellsWithoutBombs;
var milisec = 0;
var sec = 0;
var min = 0;
var gTimerIsWorking = true
var gLifeCount;
var gfalgsCount;




function init() {
    gClickCount = 0
    gfalgsCount = 0
    gLifeCount = 3
    gGameInterval = setInterval(startTimer, 10);
    gIsVictory = false
    gIsLose = false
    gcellsWithoutBombs = 0
    gBombsOdds = 2
    gRows = 3
    gCols = 3
    gBoard = buildBoard(gRows, gCols)
    console.table(gBoard)
    renderBoard(gRows, gCols)
    // console.log(gcellsWithoutBombs)
}
function reset() {
    gClickCount = 0
    gfalgsCount = 0
    gLifeCount = 3
    var elLife = document.querySelector('.life')
    elLife.innerText = `life : ${gLifeCount}`
    gGameInterval = setInterval(startTimer, 10);
    gTimerIsWorking = true
    gIsVictory = false
    gIsLose = false
    gcellsWithoutBombs = 0
    gBombsOdds = 2
    gRows = 3
    gCols = 3
    gBoard = buildBoard(gRows, gCols)
    renderBoard(gRows, gCols)
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
    var elFinishedModal = document.querySelector('.finished-modal')
    elFinishedModal.style.display = 'none'

}
function nextLevel() {
    gClickCount = 0
    gfalgsCount = 0
    if (gRows === 9 || gCols === 9) return finished()
    if (gLifeCount <= 0) return
    gGameInterval = setInterval(startTimer, 100);
    gTimerIsWorking = true
    gIsVictory = false
    gIsLose = false
    gcellsWithoutBombs = 0
    gBombsOdds = 2
    gRows++
    gCols++

    gBoard = buildBoard(gRows, gCols)
    renderBoard(gRows, gCols)
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'

}

function cellClicked(cell) {
    // console.log(cell)
    if (gClickCount === 0 && cell.dataset.isbomb === 'true') return showFirstCell(cell)

    console.log('cell innerText', +cell.innerText)
    if (+cell.innerText > 0 && +cell.innerText < 10) return
    // console.log('flags count', gfalgsCount)
    // console.log('cells without bombs count ', gcellsWithoutBombs)

    if (!gTimerIsWorking) return
    if (gIsVictory) return
    if (gIsLose) return
    // console.log(gcellsWithoutBombs)
    // console.log(cell)
    var arrayLocation = cell.dataset.location.split(',')
    // console.log(arrayLocation)
    var cellLocationRow = arrayLocation[0]
    var cellLocationcol = arrayLocation[1]
    var htmlIsBombData = cell.dataset.isbomb

    var neighborsBombs = countBombsAround(gBoard, cellLocationRow, cellLocationcol)
    // console.log('neighbors bomb ', neighborsBombs)

    // if (cell.innerText === `${neighborsBombs}`) return



    if (htmlIsBombData === 'true') {

        gLifeCount--
        var elLife = document.querySelector('.life')
        elLife.innerText = `life : ${gLifeCount}`
        cell.innerHTML = '💣';
        cell.classList.add('selected')
        if (gLifeCount === 0) {
            showAllBombs()
            stopTimer()

            gIsLose = true
            cell.innerHTML = '💣';
            var audio = new Audio('bomb.wav')
            audio.play()
            gameOver(loseStr);
        }
    }

    else {
        gcellsWithoutBombs--
        // console.log('flags count', gfalgsCount)
        // console.log('cells without bombs count ', gcellsWithoutBombs)
        // console.log(neighborsBombs)
        // if (cell.innerText === '') gcellsWithoutBombs--
        cell.innerText = neighborsBombs;
        cell.classList.add('selected')
        // console.log(gcellsWithoutBombs)
        cell.style.color = 'rgb(233, 167, 167)'
        if (neighborsBombs === 0) {
            // console.log('hi')
            // neighborLoop(gBoard, cellLocationRow, cellLocationcol)
        }

        if (gcellsWithoutBombs === 0 && gfalgsCount === 0) {
            console.log('victory')
            gIsVictory = true
            var audio = new Audio('victory.wav')
            audio.play()
            gameOver(winningStr)
        }
    }
    gClickCount++
}

function gameOver(str) {
    // if (gIsVictory) 
    clearInterval(gGameInterval)
    var elModal = document.querySelector('.modal');
    var elModalSpan = elModal.querySelector('span');
    elModal.style.display = 'block';
    elModalSpan.innerText = str;
    var elModalNextLevelButton = elModal.querySelector('.nextLevelButton');
    var showNextLevelButton;
    if (gIsVictory) showNextLevelButton = 'block'
    else showNextLevelButton = 'none'


}



function startTimer() {

    var timer = document.querySelector('.time');
    milisec++



    if (milisec > 99) {
        sec++;
        milisec = 0;
    }
    if (sec > 59) {
        min++;
        sec = 0;
    }
    timer.innerText = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec) + ':' + milisec;

}
function stopTimer() {
    if (gTimerIsWorking) {
        gGameInterval = clearInterval(gGameInterval)
        gTimerIsWorking = false
    }
    else {
        gGameInterval = setInterval(startTimer, 10)
        gTimerIsWorking = true
    }
    var timer = document.querySelector('.time');

    var currTime = timer.innerText

    addBestScore(currTime)
}

function revealeOne() {

    var num1 = getRandomIntInclusive(0, gRows)
    var num2 = getRandomIntInclusive(0, gCols)
    setTimeout(function () {
        console.log('hi')
        disapearReveale(num1, num2)
    }, 500)
    var elCurrCell = document.querySelector(`[data-location='${num1}${num2}']`)
    console.log(elCurrCell);
    elCurrCell.classList.add('selected')
    var isTheCellBomb = elCurrCell.dataset.isbomb

    if (isTheCellBomb === 'true') {
        elCurrCell.innerHTML = '💣'
    }
    else elCurrCell.innerHTML = '🌹'

}

function showAllBombs() {
    var elBombsCells = document.querySelectorAll(`[data-isBomb='true']`)
    for (var i = 0; i < elBombsCells.length; i++) {
        elBombCurrCell = elBombsCells[i]
        // console.log(elBombCurrCell)
        elBombCurrCell.innerHTML = '💣'
        elBombCurrCell.classList.add('selected')
    }



}



function finished() {

    var elFinishedModal = document.querySelector('.finished-modal')
    elFinishedModal.style.display = 'block'
}

function disapearReveale(num1, num2) {

    var elCurrCell = document.querySelector(`[data-location='${num1}${num2}']`)
    console.log(elCurrCell);
    elCurrCell.classList.remove('selected')
    var isTheCellBomb = elCurrCell.dataset.isbomb
    elCurrCell.innerHTML = ''


}

function addBestScore(time) {

    var elScore = document.querySelector('.best-score')
    elScore.innerText = 'your time is :' + time
}

function showFirstCell(cell) {
    // console.table(gBoard)
    console.log('you are in show first cell function')
    gClickCount++
    gfalgsCount--
    console.log(cell)
    var location = cell.dataset.location.split(',')
    console.log('first click location', location[0], location[1])
    gBoard[location[0]][location[1]].isBomb = false
    var negsCount = countBombsAround(gBoard, location[0], location[1])
    cell.innerHTML = negsCount
    cell.classList.add('selected')
    // console.table(gBoard)
}