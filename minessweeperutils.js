
function buildBoard(rows, cols) {
    var idCell = 0
    var board = [];
    var bombCells = []
    // var num = getRandomIntInclusive(0, 10)
    for (var i = 0; i < rows; i++) {
        board[i] = [];
        for (var j = 0; j < cols; j++) {

            var cell = {
                id: idCell++,
                isBomb: (getRandomIntInclusive(0, 10) > gBombsOdds) ? false : true,
                location: i, j

            }
            board[i][j] = cell;
            if (cell.isBomb === false) {
                gcellsWithoutBombs++;
            }
            // console.log('cell without bombs in build board ', gcellsWithoutBombs)
            if (cell.isBomb === true) {
                gfalgsCount++
            }
        }

    }
    // board[0][0].isBomb = false
    console.log(gfalgsCount)
    return board;
}


function renderBoard(rows, cols) {
    var strHTML = '';
    var classCount = 0
    // var firstCellMarked = 'selected'
    for (var i = 0; i < rows; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < cols; j++) {
            var bombsNegs = countBombsAround(gBoard, i, j,)
            var location = `${i},${j}`
            // cellClicked(this)
            strHTML += `<td class="cell${classCount++}" oncontextmenu="flag(this)"  onclick="cellClicked(this)" id=${bombsNegs} data-isBomb = "${gBoard[i][j].isBomb}" data-location = ${location}>
           </td > `
            // console.log('mat in the position (' + i + ',' + j + ') has ' + bombsNegs + ' bomb negs')
        }
        strHTML += '</tr>'
    }


    // לשנות כאן לפי הסלקטורים המתאימים 
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML
    // console.log(strHTML)
}



function countBombsAround(gBoard, rowIdx, colIdx) {

    var neihborCounter = 0
    for (var i = rowIdx - 1; i <= (rowIdx + 1); i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= (colIdx + 1); j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            var currCell = gBoard[i][j];
            if (currCell.isBomb === true) {
                neihborCounter++
                // console.log('you are in negs count =', i, j, neihborCounter)
            }
        }
    }
    return neihborCounter
}




function shuffle(items) {
    var randIdx, keep
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);

        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}


function createNums(num) {
    var nums = []
    for (var i = 0; i <= num - 1; i++) {
        nums[i] = i + 1
    }
    return nums
}


function getRandomColor() {
    var varters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += varters[Math.trunc(Math.random() * 16)];
    }
    return color;
}


//   מספר רנדומלי
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// if the cell we press has 0 bombs 
// neihbors is comes into this function and find all the
//  neihbors and add the number of there bombs neibors
// function neighborLoop(mat, rowIdx, colIdx) {
//     var neihborCounter = 0
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > mat.length - 1) continue;
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > mat[0].length - 1) continue;
//             if (i === rowIdx && j === colIdx) continue;
//             var cell = mat[i][j];
//             var neiborsNeibors = countBombsAround(mat, i, j)


//             var cellWeWantToMark = document.querySelector(`[data-location='${i}${j}']`)

//             if (cellWeWantToMark.style.color = 'red') continue




//             cellWeWantToMark.innerText = neiborsNeibors
//             cellWeWantToMark.style.color = 'red'

//             // console.log(neiborsNeibors)
//         }
//     }
// }


function flag(cell) {
    // console.log('cell inner html', cell.innerHTML)
    if (cell.innerHTML === '🚩') {
        gfalgsCount++
        cell.innerHTML = ''
    }

    else if (cell.innerHTML !== '🚩') {
        gfalgsCount--
        cell.innerHTML = '🚩'
    }
    if (gcellsWithoutBombs === 0 && gfalgsCount === 0) {
        console.log('victory')
        gIsVictory = true
        var audio = new Audio('victory.wav')
        audio.play()
        gameOver(winningStr)
    }
    console.log('flags count', gfalgsCount)
}
