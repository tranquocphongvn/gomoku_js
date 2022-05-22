import * as Global from './global.js'

import {buildCaroGrid, buildColumnHeaders, buildRowHeaders, showWonItems} from './ui.js'
import evaluate from './gomoku_ai.js'
import CaroBoard from './board.js'

const theCaroBoard = CaroBoard()

const BASE_TIMEOUT = 200
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

var isCaroX = true

var isPlayer1Playing = false
var isPlayer2Playing = false
var isPCTurn = false
var isPCvsPCMode = false
var isHumanvsPCMode = false
var isPCvsHumanMode = false
var isHumanvsHumanMode = false

function initCaroBoard() {
    gridCaroContainer.innerHTML = buildCaroGrid(Global.MAX_ROWS, Global.MAX_COLUMNS)
    theCaroBoard.initBoard()

    isCaroX = true

    isPlayer1Playing = false
    isPlayer2Playing = false
    isPCTurn = false

    isPCvsPCMode = false
    isHumanvsPCMode = false
    isPCvsHumanMode = false
    isHumanvsHumanMode = false
}

function getPlayers(isPlayerX) {
    let player = CARO_X
    let opponent = CARO_O
    if (!isPlayerX) {
        player = CARO_O
        opponent = CARO_X
    }

    return {
        player,
        opponent
    }
}
const gridColumnHeaders = $(".grid-column-headers")
const gridRowHeaders = $(".grid-row-headers")
const gridCaroContainer = $(".grid-caro-container")
const btnPCvsPC = $("#btn-pc-vs-pc")
const btnHumanvsPC = $("#btn-human-vs-pc")
const btnPCvsHuman = $("#btn-pc-vs-human")
const btnHumanvsHuman = $("#btn-human-vs-human")
const btnRestart = $("#btn-restart")
const lblPlayerX = $("#playerX")
const lblPlayerO = $("#playerO")

//console.log('Global.MAX_ROWS:', Global.MAX_ROWS, 'Global.MAX_COLUMNS:', Global.MAX_COLUMNS)

gridCaroContainer.innerHTML = buildCaroGrid(Global.MAX_ROWS, Global.MAX_COLUMNS)
gridColumnHeaders.innerHTML = buildColumnHeaders(Global.MAX_COLUMNS)
gridRowHeaders.innerHTML = buildRowHeaders(Global.MAX_ROWS)

initCaroBoard()


// update Caro Board state
function updateCaroBoard(row, column, gridCaroCell) {
    if (isCaroX) {
        theCaroBoard.putCaroValue(Global.CARO_X, row, column)
        gridCaroCell.innerHTML = Global.CaroXSpan
        
        lblPlayerX.classList.remove('inturn')
        lblPlayerO.classList.add('inturn')
    }
    else {
        theCaroBoard.putCaroValue(Global.CARO_O, row, column)
        gridCaroCell.innerHTML = Global.CaroOSpan

        lblPlayerX.classList.add('inturn')
        lblPlayerO.classList.remove('inturn')
    }

    setTimeout( () => {
        const img = $("img.newest")
        if (img) {
            img.classList.remove("newest")
        }
        isPlayer1Playing = false
        isPlayer2Playing = false
    }, BASE_TIMEOUT)

    setTimeout( () => {
        //let checkWhoWon = checkWonInRange(row, column)
        let checkWhoWon = theCaroBoard.checkWonInRange(row, column)
        if (checkWhoWon) {
            showWonItems(checkWhoWon)
            
            let msg = `${checkWhoWon.caroValue === Global.CARO_X? Global.PLAYER_X : checkWhoWon.caroValue === Global.CARO_O? Global.PLAYER_O : checkWhoWon.caroValue} has Won by [${checkWhoWon.direction}]!!! at (row: ${checkWhoWon.row}, column: ${checkWhoWon.column})`
            setTimeout(() => { 
                console.log(msg)
                if (isPCvsPCMode) {
                    // restart autoplay again
                    startPCvsPCMode()
                }
            }, 3000)
        }
        else if (isPCvsPCMode) {
            let ai_position = AI_position()
            if (ai_position) {
                //console.log('AI_position:', ai_position)
                putCaroValue(ai_position[0], ai_position[1])
            }
            else {
                console.log('AI_position: no available position. Please restart the game')
                theCaroBoard.checkWonInRange(0, 0, Global.MAX_ROWS, Global.MAX_COLUMNS)
                setTimeout(() => { 
                    // restart autoplay again
                    startPCvsPCMode()
                }, 3000)                
            }
        }
        else if (isHumanvsPCMode && isPCTurn) {
            let ai_position = AI_position()
            if (ai_position) {
                //console.log('AI_position:', ai_position)
                putCaroValue(ai_position[0], ai_position[1])
            }
            else {
                console.log('AI_position: no available position. Please restart the game')
                theCaroBoard.checkWonInRange(0, 0, Global.MAX_ROWS, Global.MAX_COLUMNS)
            }
            isPCTurn = false
        }
        else if (isPCvsHumanMode && isPCTurn) {
            let ai_position = AI_position()
            if (ai_position) {
                //console.log('AI_position:', ai_position)
                putCaroValue(ai_position[0], ai_position[1])
            }
            else {
                console.log('AI_position: no available position. Please restart the game')
                theCaroBoard.checkWonInRange(0, 0, Global.MAX_ROWS, Global.MAX_COLUMNS)
            }
            isPCTurn = false
        }

    }, BASE_TIMEOUT + 100)    

    isCaroX = !isCaroX
}

function putCaroValue(row, column) {
    if (row != null && column != null && row >=0 && column >= 0) {
        let gridCaroCell = $(`.grid-caro-cell[data-row="${row}"][data-column="${column}"]`)
        if (gridCaroCell && !gridCaroCell.innerHTML) {
            updateCaroBoard(row, column, gridCaroCell)
        }    
    }
}

// events handler
gridCaroContainer.onclick = function(e) {
    if (!isPCTurn && !isPCvsPCMode && !isPlayer1Playing && !isPlayer2Playing) {
        const gridCaroCell = e.target.closest('.grid-caro-cell');

        if (gridCaroCell && !gridCaroCell.innerHTML)
        {
            let row = Number(gridCaroCell.dataset.row)
            let column =  Number(gridCaroCell.dataset.column)

            if (!theCaroBoard.getFirstMove())
            {
                theCaroBoard.setFirstMove(row, column)
            }
            
            isPlayer2Playing = true
            updateCaroBoard(row, column, gridCaroCell)

            if (isHumanvsPCMode && !isPCTurn) {
                isPCTurn = true
            }
            else if (isPCvsHumanMode && !isPCTurn) {
                isPCTurn = true
            }
        }
    }
}

btnPCvsPC.onclick = function(e) {
    if (!isPCvsPCMode) {
        btnPCvsPC.classList.add('active')
        btnHumanvsPC.classList.remove('active')
        btnPCvsHuman.classList.remove('active')
        btnHumanvsHuman.classList.remove('active')
        lblPlayerX.innerText = "Player X: Computer"
        lblPlayerO.innerText = "Player O: Computer"
        
        startPCvsPCMode()

        isPCvsPCMode = true
    }
}

btnHumanvsPC.onclick = function(e) {
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.add('active')
    btnPCvsHuman.classList.remove('active')
    btnHumanvsHuman.classList.remove('active')
    lblPlayerX.innerText = "Player X: Human"
    lblPlayerO.innerText = "Player O: Computer"
    
    isPCTurn = false
    isPCvsPCMode = false
    isPCvsHumanMode = false
    isHumanvsPCMode = true
    if (!isPlayer1Playing && !isPlayer2Playing) {
        initCaroBoard()
        isHumanvsPCMode = true
    }
}

btnPCvsHuman.onclick = function(e) {
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.remove('active')
    btnPCvsHuman.classList.add('active')
    btnHumanvsHuman.classList.remove('active')
    lblPlayerX.innerText = "Player X: Computer"
    lblPlayerO.innerText = "Player O: Human"
    
    isPCTurn = false
    isPCvsPCMode = false
    isHumanvsPCMode = false
    isPCvsHumanMode = true
    if (!isPlayer1Playing && !isPlayer2Playing) {
        initCaroBoard()
        isPCvsHumanMode = true
        let ai_position = AI_position()
        if (ai_position) {
            putCaroValue(ai_position[0], ai_position[1])
        }
        isPCTurn = false
    }
}

btnHumanvsHuman.onclick = function(e) {
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.remove('active')
    btnPCvsHuman.classList.remove('active')
    btnHumanvsHuman.classList.add('active')
    lblPlayerX.innerText = "Player X: Human"
    lblPlayerO.innerText = "Player O: Human"

    isPCTurn = false
    isPCvsPCMode = false
    isHumanvsPCMode = false
    isPCvsHumanMode = false
    if (!isPlayer1Playing && !isPlayer2Playing) {
        initCaroBoard()
    }
}


btnRestart.onclick = function(e) {
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.remove('active')
    btnPCvsHuman.classList.remove('active')
    btnHumanvsHuman.classList.remove('active')
    lblPlayerX.innerText = "Player X: Unknown"
    lblPlayerO.innerText = "Player O: Unknown"

    isPCTurn = false
    isPCvsPCMode = false
    isHumanvsPCMode = false
    isPCvsHumanMode = false
    initCaroBoard()
}

function startPCvsPCMode()
{
    initCaroBoard()

    isHumanvsPCMode = false
    isPCvsHumanMode = false
    isHumanvsHumanMode = false
    isPCvsPCMode = true
    isCaroX = true

    let ai_position = AI_position()
    if (ai_position) {
        putCaroValue(ai_position[0], ai_position[1])
    }
    isPCTurn = false
}

function AI_position() {
    let color_none = Global.EMPTY_CARO_VALUE;

    // true 代表黑棋，false 代表白棋。
    let human_color = Global.CARO_X;
    let AI_color = Global.CARO_O;
    
    let max_value = 0;
    let current_value = 0;
    let max_position = null;
    let current_position = [0, 0];
    let current_value_AI_color = 0;
    let current_value_non_AI_color = 0;
    let chessBoard = theCaroBoard.getBoard()

    let firstMove = theCaroBoard.getFirstMove()
    let secondMove = theCaroBoard.getSecondMove()
    let availablePositions = []

    if (firstMove && !secondMove) {
        // calculate the secondMove Value
        for (let i = -1; i <= 1 ; i++) {
            for (let j = -1; j <= 1 ; j++) {
                if ((i !== 0 || j !== 0) && (firstMove.row + i >= 0 && firstMove.row + i < Global.MAX_ROWS && firstMove.column + j >= 0 && firstMove.column + j < Global.MAX_COLUMNS))  {
                    availablePositions.push({row: firstMove.row + i, column: firstMove.column + j})
                }
            }
        }

        let availablePosition = availablePositions[Math.floor(Math.random() * availablePositions.length)]
        max_position = [availablePosition.row, availablePosition.column]
        theCaroBoard.setSecondMove(max_position[0], max_position[1])
        //console.log('availablePositions:', availablePositions, 'availablePosition:', availablePosition, 'max_position:', max_position)

        return max_position
    }
    else if (!firstMove) {
        // set firstMove at the center of the board
        max_position = [Math.floor(Global.MAX_ROWS/2), Math.floor(Global.MAX_COLUMNS/2)]
        theCaroBoard.setFirstMove(max_position[0], max_position[1])
        return max_position
    }

    availablePositions = []
    for (var row = 0; row < Global.MAX_ROWS; row++) {
        for (var col = 0; col < Global.MAX_COLUMNS; col++) {
            if (chessBoard[row][col] === color_none) {
                current_position = [row, col];
                current_value_AI_color = evaluate(current_position, AI_color, chessBoard);
                current_value_non_AI_color = evaluate(current_position, human_color, chessBoard);
                if (current_value_non_AI_color < 0) {
                    current_value_non_AI_color = 0;
                }
                current_value = current_value_AI_color + current_value_non_AI_color;
                if (current_value > max_value) {
                    //console.log('AI_position. current_value:', current_value, '. max_value:', max_value)
                    max_value = current_value;
                    max_position = current_position;
                    availablePositions.length = 0
                    availablePositions.push(max_position)
                }
                else if (current_value === max_value) {
                    availablePositions.push(current_position)
                }
            }
        }
    }
    
    if (availablePositions && availablePositions.length >= 2 && max_value > 0) {
        console.log('AI max_value:', max_value, '; available positions:', availablePositions)
        max_position = availablePositions[Math.floor(Math.random() * availablePositions.length)]
        console.log('AI random selected position:', max_position)
    }
    return max_position;
}

// todo
function computerPlay(caroBoard) {
    let maxPoint = 0;
    let defendPoint = 0;
    let attackPoint = 0;

    // Algorithm Minimax to get position has Max Point
    for (let row = 0; row < Global.MAX_ROWS; row++) {
        for (let column = 0; column < Global.MAX_COLUMNS; column++) {
            // the position (row, column) is available and NOT Prune
            if ((caroBoard[row][column] === Global.EMPTY_CARO_VALUE) && !alphaBetaPruning(row, column)) {
                let tempPoint = 0
                attackPoint = attackByHorizontal(row, column) + attackByVertical(row, column) + attackByMainDiagonal(row, column) + attackByMinorDiagonal(row, column)
                defendPoint = defendByHorizontal(row, column) + defendByVertical(row, column) + defendByMainDiagonal(row, column) + defendByMinorDiagonal(row, column)

                tempPoint = (defendPoint > attackPoint) ? defendPoint : attackPoint
                if (maxPoint < tempPoint) {
                    maxPoint = tempPoint
                    // todo
                }
            }
        }
    }
}



function alphaBetaPruning(row, column) {
    // if there is no space (cant play) in 4 ways, it means Pruning
    if (pruneHorizontal(row, column) && pruneVertical(row, column) && pruneMainDiagonal(row, column) && pruneMinorDiagonal(row, column))
    {
        return true
    }
    
    return false
}

function pruneHorizontal(row, column) {
    // check horizontal (row, column-4 => row, column+4) if there is an empty cell (playable), return false
    let startCol = (column - 4 >= 0) ? column - 4: 0;
    let endCol = (column + 5 <= Global.MAX_COLUMNS) ? column + 5 : Global.MAX_COLUMNS; // 4+1 because it has to include the last item

    for (let col = startCol; col < endCol; col++) {
        if (!caroBoard[row, col])
            return false
    }

    // if there is no space (cant play) in 4 ways, it means Pruning by Horizontal
    return true
}

function pruneVertical(row, column) {
    // check vertical (row-4. column => row+4, column) if there is an empty cell (playable), return false
    let startRow = (row - 4 >= 0) ? row - 4: 0;
    let endRow = (row + 5 <= Global.MAX_ROWS) ? row + 5 : Global.MAX_ROWS; // 4+1 because it has to include the last item

    for (let r = startRow; r < endRow; r++) {
        if (!caroBoard[r, column])
            return false
    }

    // if there is no space (cant play) in 4 ways, it means Pruning by Vertical
    return true
}

function pruneMainDiagonal(row, column) {
    // check MainDiagonal (row-4, column-4 => row+4, column+4) if there is an empty cell (playable), return false
    for (let i = -4; i < 5; i++) { // 5 (=4+1) because it has to include the last item
        if ((row + i >= 0) && (row + i < Global.MAX_ROWS) && (column + i >= 0) && (column + i < Global.MAX_COLUMNS) && !caroBoard[row + i, column + i])
            return false
    }

    // if there is no space (cant play) in 4 ways, it means Pruning by Main Diagonal
    return true
}

function pruneMinorDiagonal(row, column) {
    // check MainDiagonal (row-4, column+4 => row+4, column-4) if there is an empty cell (playable), return false
    for (let i = -4; i < 5; i++) { // 5 (=4+1) because it has to include the last item
        if ((row + i >= 0) && (row + i < Global.MAX_ROWS) && (column - i < Global.MAX_COLUMNS) && (column - i >= 0) && !caroBoard[row + i, column - i])
            return false
    }

    // if there is no space (cant play) in 4 ways, it means Pruning by Minor Diagonal
    return true
}

// todo
function attackByHorizontal()
{
}

function attackByVertical()
{
}

function attackByMainDiagonal()
{
}

function attackByMinorDiagonal()
{
}

function defendByHorizontal()
{
}

function defendByVertical()
{
}

function defendByMainDiagonal()
{
}

function defendByMinorDiagonal()
{
}