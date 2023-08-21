import * as Global from './global.js'

import {buildCaroGrid, buildColumnHeaders, buildRowHeaders, showWonItems} from './ui.js'
import evaluate from './gomoku_ai.js'
import CaroBoard from './board.js'

const BASE_TIMEOUT = 300
const RESTART_TIMEOUT = 5000
const GOMOKU_STORAGE_KEY = 'GOMOKU_STORAGE'

const theCaroBoard = CaroBoard()

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PlayingMode = {
    PCvsPC: 'PCvsPC',
    HumanvsPC: 'HumanvsPC',
    PCvsHuman: 'PCvsHuman',
    HumanvsHuman: 'HumanvsHuman',
    Unknown: 'Unknown'
}

var isCaroX = true

var isPlayer1Playing = false
var isPlayer2Playing = false
var isPCTurn = false
var currentMode = PlayingMode.Unknown;
var isEndGame = false
var timerPCPlaying

function initCaroBoard(playMode) {
    if (playMode === PlayingMode.Unknown)
        lblPlayerX.classList.remove('inturn-x')
    else
        lblPlayerX.classList.add('inturn-x')

    lblPlayerO.classList.remove('inturn-o')

    gridCaroContainer.innerHTML = buildCaroGrid(Global.MAX_ROWS, Global.MAX_COLUMNS)
    theCaroBoard.initBoard()
    if (timerPCPlaying)
        clearTimeout(timerPCPlaying)

    isCaroX = true

    isPlayer1Playing = false
    isPlayer2Playing = false
    isPCTurn = false

    isEndGame = false

    return playMode
}

function getPlayers(isPlayerX) {
    let player = Global.CARO_X
    let opponent = Global.CARO_O
    if (!isPlayerX) {
        player = Global.CARO_O
        opponent = Global.CARO_X
    }

    return {
        player,
        opponent
    }
}

// get elements
const gridColumnHeaders = $(".grid-column-headers")
const gridRowHeaders = $(".grid-row-headers")
const gridCaroContainer = $(".grid-caro-container")
const btnPCvsPC = $("#btn-pc-vs-pc")
const btnHumanvsPC = $("#btn-human-vs-pc")
const btnPCvsHuman = $("#btn-pc-vs-human")
const btnHumanvsHuman = $("#btn-human-vs-human")
const btnRestart = $("#btn-restart")
const btnToggleFullscreen = $("#btn-toggle-fullscreen")
const btnFirst = $("#btn-first")
const btnPrev = $("#btn-prev")
const btnNext = $("#btn-next")
const btnLast = $("#btn-last")
const btnSave = $("#btn-save")
const btnLoad = $("#btn-load")

const lblPlayerX = $("#playerX")
const lblPlayerO = $("#playerO")

//console.log('Global.MAX_ROWS:', Global.MAX_ROWS, 'Global.MAX_COLUMNS:', Global.MAX_COLUMNS)

gridCaroContainer.innerHTML = buildCaroGrid(Global.MAX_ROWS, Global.MAX_COLUMNS)
gridColumnHeaders.innerHTML = buildColumnHeaders(Global.MAX_COLUMNS)
gridRowHeaders.innerHTML = buildRowHeaders(Global.MAX_ROWS)

currentMode = initCaroBoard(PlayingMode.Unknown)


// update Caro Board state
function updateCaroBoard(row, column, gridCaroCell) {
    // put Caro Value into the board
    if (isCaroX) {
        theCaroBoard.putCaroValue(Global.CARO_X, row, column)
        gridCaroCell.innerHTML = Global.CaroXSpan
        
        lblPlayerX.classList.remove('inturn-x')
        lblPlayerO.classList.add('inturn-o')
    }
    else {
        theCaroBoard.putCaroValue(Global.CARO_O, row, column)
        gridCaroCell.innerHTML = Global.CaroOSpan

        lblPlayerX.classList.add('inturn-x')
        lblPlayerO.classList.remove('inturn-o')
    }

    // remove newest css, after BASE_TIMEOUT ms
    setTimeout( () => {
        const img = $("img.newest")
        if (img) {
            img.classList.remove("newest")
        }
        isPlayer1Playing = false
        isPlayer2Playing = false
    }, BASE_TIMEOUT)

    
    // check Won and make the PC playing
    timerPCPlaying = setTimeout( () => {
        //let checkWhoWon = checkWonInRange(row, column)
        let checkWhoWon = theCaroBoard.checkWonInRange(row, column)
        if (checkWhoWon) {
            isEndGame = true

            showWonItems(checkWhoWon)
            
            let msg = `${checkWhoWon.caroValue === Global.CARO_X? Global.PLAYER_X : checkWhoWon.caroValue === Global.CARO_O? Global.PLAYER_O : checkWhoWon.caroValue} has Won by [${checkWhoWon.direction}]!!! at (row: ${checkWhoWon.row}, column: ${checkWhoWon.column})`
            console.log(msg)
            /*
            setTimeout(() => {
                if (currentMode === PlayingMode.PCvsPC) {
                    // restart autoplay again
                    startPCvsPCMode(true)
                }
            }, RESTART_TIMEOUT)
            */
        }
        else if (currentMode === PlayingMode.PCvsPC) {
            let ai_position = AI_position()
            if (ai_position) {
                //console.log('AI_position:', ai_position)
                putCaroValue(ai_position[0], ai_position[1])
            }
            else {
                isEndGame = true
                console.log('AI_position: no available position. Please restart the game')
                theCaroBoard.checkWonInRange(0, 0, Global.MAX_ROWS, Global.MAX_COLUMNS)
                setTimeout(() => { 
                    // restart autoplay again
                    startPCvsPCMode(true)
                }, RESTART_TIMEOUT)                
            }
        }
        else if (currentMode === PlayingMode.HumanvsPC && isPCTurn) {
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
        else if (currentMode === PlayingMode.PCvsHuman && isPCTurn) {
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
    if (isEndGame) {
        console.log("Please restart the game!!!")
        return
    }

    //console.log('Before. isPCTurn:', isPCTurn, ', currentMode:', currentMode, ', isPlayer1 Playing:', isPlayer1Playing, ', isPlayer2 Playing:', isPlayer2Playing)
    if (!isPCTurn && (currentMode !== PlayingMode.PCvsPC) && !isPlayer1Playing && !isPlayer2Playing) {
        const gridCaroCell = e.target.closest('.grid-caro-cell');

        if (gridCaroCell && !gridCaroCell.innerHTML)
        {
            if (currentMode === PlayingMode.Unknown) {
                currentMode = PlayingMode.HumanvsHuman
                startHumanvsHumanMode(false)
            }

            let row = Number(gridCaroCell.dataset.row)
            let column =  Number(gridCaroCell.dataset.column)
            
            if (!theCaroBoard.getFirstMove()) {
                theCaroBoard.setFirstMove(row, column)
            }
            else if (!theCaroBoard.getSecondMove())
            {
                theCaroBoard.setSecondMove(row, column)
            }

            
            //console.log('After. isPCTurn:', isPCTurn, ', currentMode:', currentMode, ', isPlayer1 Playing:', isPlayer1Playing, ', isPlayer2 Playing:', isPlayer2Playing)

            //isPlayer2Playing = true
            updateCaroBoard(row, column, gridCaroCell)

            if (currentMode === PlayingMode.HumanvsPC && !isPCTurn) {
                isPCTurn = true
            }
            else if (currentMode === PlayingMode.PCvsHuman && !isPCTurn) {
                isPCTurn = true
            }
        }
    }
}

btnPCvsPC.onclick = function(e) {
    if (currentMode !== PlayingMode.PCvsPC || (currentMode === PlayingMode.PCvsPC && isEndGame) ) {
        btnPCvsPC.classList.add('active')
        btnHumanvsPC.classList.remove('active')
        btnPCvsHuman.classList.remove('active')
        btnHumanvsHuman.classList.remove('active')
        lblPlayerX.innerText = "Player X: Computer"
        lblPlayerO.innerText = "Player O: Computer"
        
        let continueGame = currentMode === PlayingMode.PCvsHuman || currentMode === PlayingMode.HumanvsPC || currentMode === PlayingMode.HumanvsHuman
        startPCvsPCMode(!continueGame)

        currentMode = PlayingMode.PCvsPC
    }
}

btnHumanvsPC.onclick = function(e) {
    startHumanvsPCMode(true)
}

btnPCvsHuman.onclick = function(e) {
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.remove('active')
    btnPCvsHuman.classList.add('active')
    btnHumanvsHuman.classList.remove('active')
    lblPlayerX.innerText = "Player X: Computer"
    lblPlayerO.innerText = "Player O: Human"
    
    isPCTurn = false
    if (!isPlayer1Playing && !isPlayer2Playing) {
        currentMode = initCaroBoard(PlayingMode.PCvsHuman)

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
    if (timerPCPlaying)
        clearTimeout(timerPCPlaying)

    isPCTurn = false
    if (!isPlayer1Playing && !isPlayer2Playing) {
        currentMode = initCaroBoard(PlayingMode.HumanvsHuman)
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
    if (timerPCPlaying)
        clearTimeout(timerPCPlaying)

    currentMode = initCaroBoard(PlayingMode.Unknown)
}


btnToggleFullscreen.onclick = function(e) {
    let fullscreenElement = document.fullscreenElement
    if (!fullscreenElement) {
        fullscreenElement = document.documentElement
        if (fullscreenElement.requestFullscreen) {
            fullscreenElement.requestFullscreen()
        } 
        else if (fullscreenElement.webkitRequestFullscreen) { /* Safari */
            fullscreenElement.webkitRequestFullscreen()
        } 
        else if (fullscreenElement.msRequestFullscreen) { /* IE11 */
            fullscreenElement.msRequestFullscreen()
        }    
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } 
        else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen()
        } 
        else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen()
        }        
    }
}

btnPrev.onclick = function(e) {
    if (!isEndGame)
        return null
    
    let point = theCaroBoard.getPrevHistory()

    if (point && point.row != null && point.column != null && point.row >=0 && point.column >= 0) {
        console.log('btnPrev:', point.index, ', point:', point, ', will be removed.')

        let gridCaroCell = $(`.grid-caro-cell[data-row="${point.row}"][data-column="${point.column}"]`)
        if (gridCaroCell && gridCaroCell.innerHTML) {
            gridCaroCell.innerHTML = point.caroValue === Global.CARO_X? Global.CaroXSpan : Global.CaroOSpan

            setTimeout( () => {
                const img = $("img.newest")
                if (img) {
                    img.classList.remove("newest")
                }
                gridCaroCell.innerHTML = ''
            }, BASE_TIMEOUT * 2)
        }    
    }
}
btnNext.onclick = function(e) {
    if (!isEndGame)
        return null

    
    let point = theCaroBoard.getNextHistory()

    if (point && point.row != null && point.column != null && point.row >=0 && point.column >= 0) {
        let gridCaroCell = $(`.grid-caro-cell[data-row="${point.row}"][data-column="${point.column}"]`)
        if (gridCaroCell && !gridCaroCell.innerHTML) {
            gridCaroCell.innerHTML = point.caroValue === Global.CARO_X? Global.CaroXSpan : Global.CaroOSpan

            setTimeout( () => {
                const img = $("img.newest")
                if (img) {
                    img.classList.remove("newest")
                }
            }, BASE_TIMEOUT * 2)
        }    
        console.log('btnNext:', point.index, ', point:', point)
    }
}


btnLast.onclick = function (e) {
    if (isEndGame)
        return null

    let ai_position = AI_position()
    if (ai_position) {
        //console.log('AI_position:', ai_position)
        putCaroValue(ai_position[0], ai_position[1])
    }
}

btnSave.onclick = function (e) {
    let text = theCaroBoard.historyToText()
    localStorage.setItem(GOMOKU_STORAGE_KEY, JSON.stringify(text));
    console.log('Saved historyInText:', text)
    
    // let saving = {}
    // saving['Game-01'] = text
    // localStorage.setItem(GOMOKU_STORAGE_KEY, JSON.stringify(saving));

}

btnLoad.onclick = function (e) {
    // let text = JSON.parse(localStorage.getItem(GOMOKU_STORAGE_KEY)) || {}
    let text = JSON.parse(localStorage.getItem(GOMOKU_STORAGE_KEY))
    //console.log('historyInText:', text)
    
    if (text) {
        let pointTexts = text.split(';')
        
        if (pointTexts && (pointTexts[pointTexts.length - 1].indexOf(']') === -1)) {
            pointTexts.splice(pointTexts.length - 1, 1)
        }

        let points = pointTexts.map( (value, index) => {
            if (value) {
                value = value.replaceAll(' ', '').replace('[', '').replace(']', '').replace(':', ',')
                let values = value.split(',')
                let point = {
                    index: index + 1,
                    row: parseInt(values[0]),
                    column: parseInt(values[1]),
                    caroValue: parseInt(values[2])
                }
                return point
            }
            return null
        })
        //console.log('points:', points)

        btnPCvsPC.classList.remove('active')
        btnHumanvsPC.classList.remove('active')
        btnPCvsHuman.classList.remove('active')
        btnHumanvsHuman.classList.remove('active')
        lblPlayerX.innerText = "Player X: Unknown"
        lblPlayerO.innerText = "Player O: Unknown"

        isPCTurn = false
        if (timerPCPlaying)
            clearTimeout(timerPCPlaying)

        currentMode = initCaroBoard(PlayingMode.Unknown)

        if (points && points.length > 0)
            theCaroBoard.setFirstMove(points[0].row, points[0].column)

        if (points && points.length > 1)
            theCaroBoard.setSecondMove(points[1].row, points[1].column)

        points.forEach(value => {
            putCaroValue(value.row, value.column)
        })
    }
    else {
        console.log('Nothing to load')
    }
}


function startPCvsPCMode(newGame = true)
{
    if (newGame) {
        initCaroBoard(PlayingMode.PCvsPC)
        isCaroX = true
    }

    currentMode = PlayingMode.PCvsPC

    let ai_position = AI_position()
    if (ai_position) {
        putCaroValue(ai_position[0], ai_position[1])
    }
    isPCTurn = false
}

function startHumanvsPCMode(initBoard = true)
{
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.add('active')
    btnPCvsHuman.classList.remove('active')
    btnHumanvsHuman.classList.remove('active')
    lblPlayerX.innerText = "Player X: Human"
    lblPlayerO.innerText = "Player O: Computer"
    
    isPCTurn = false
    if (!isPlayer1Playing && !isPlayer2Playing && initBoard) {
        currentMode = initCaroBoard(PlayingMode.HumanvsPC)
    }
}

function startHumanvsHumanMode(initBoard = true)
{
    btnPCvsPC.classList.remove('active')
    btnHumanvsPC.classList.remove('active')
    btnPCvsHuman.classList.remove('active')
    btnHumanvsHuman.classList.add('active')
    lblPlayerX.innerText = "Player X: Human"
    lblPlayerO.innerText = "Player O: Human"
    
    isPCTurn = false
    if (!isPlayer1Playing && !isPlayer2Playing && initBoard) {
        currentMode = initCaroBoard(PlayingMode.HumanvsHuman)
    }
}


function AI_position(playerColor, opponentColor) {
    let color_none = Global.EMPTY_CARO_VALUE;

    
    let players = getPlayers(isCaroX)
    playerColor = players.player;
    opponentColor = players.opponent;
    
    let max_value = 0;
    let current_value = 0;
    let max_position = null;
    let current_position = [0, 0];
    let current_value_player_color = 0;
    let current_value_opponent_color = 0;
    let chessBoard = theCaroBoard.getBoard()

    let firstMove = theCaroBoard.getFirstMove()
    let secondMove = theCaroBoard.getSecondMove()
    let availablePositions = []

    if (firstMove && !secondMove) {
        // calculate the secondMove Value
        for (let i = -1; i <= 1 ; i++) {
            for (let j = -1; j <= 1 ; j++) { // (i !== 0 && j !== 0) because the 2nd moving should in the 4 corner (diagonal)
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

    let index = theCaroBoard.getLastIndexPlayed() + 1
    //console.log('IndexPlayed:', index + 1, ', Players:', players, '. Evaluating...')
    availablePositions = []
    for (let row = 0; row < Global.MAX_ROWS; row++) {
        for (let col = 0; col < Global.MAX_COLUMNS; col++) {
            if (chessBoard[row][col] === color_none) {
                current_position = [row, col];
                current_value_player_color = evaluate(current_position, playerColor, playerColor, opponentColor, chessBoard);
                current_value_opponent_color = evaluate(current_position, opponentColor, playerColor, opponentColor, chessBoard); // OR ??? current_value_opponent_color = evaluate(current_position, playerColor, opponentColor, playerColor, chessBoard);
                
                if (current_value_opponent_color < 0) {
                    current_value_opponent_color = 0;
                }
                current_value = current_value_player_color + current_value_opponent_color;

                // if ((row === 13 && col === 22) || (row === 13 && col === 23) || (row === 15 && col === 22) || (row === 14 && col === 23)) {
                //     console.log('- IndexPlayed:', index + 1, ', Players:', players, ', current_position:', current_position, ', current_value_player_color:', current_value_player_color, ', current_value_opponent_color:', current_value_opponent_color, ', current_value:', current_value, ', max_value:', max_value)
                // }

                if (current_value > max_value) {
                    if (current_value >= 500)
                        console.log('- IndexPlayed:', index + 1, ', Players:', players, ', current_position:', current_position, ', current_value_player_color:', current_value_player_color, ', current_value_opponent_color:', current_value_opponent_color, ', current_value:', current_value, '> max_value:', max_value)

                    max_value = current_value;
                    max_position = current_position;
                    availablePositions.length = 0 // reset the array
                    availablePositions.push(max_position)
                }
                else if (current_value === max_value) {
                    availablePositions.push(current_position)
                }
            }
        }
    }
    
    if (availablePositions && availablePositions.length >= 2 && max_value > 0) {
        console.log('IndexPlayed:', index + 1, ', Players:', players, ', AI max_value:', max_value, '; available positions:', availablePositions)
        
        //console.log('Players:', players, ', AI_position ---, chessBoard:', chessBoard)
        for (let i = 0; i < availablePositions.length; i++) {
            let tempBoard = theCaroBoard.getCopyBoard()
            getMaxMinPosition(availablePositions[i], playerColor, opponentColor, tempBoard, 2)
        }

        let randomIndex = Math.floor(Math.random() * availablePositions.length);
        max_position = availablePositions[randomIndex]
        console.log('IndexPlayed:', index + 1, ', Players:', players, ', AI random index:', randomIndex, '; selected position:', max_position)
    }
    else if (max_value >= 500) {
        console.log('IndexPlayed:', index + 1, ', Players:', players, ', AI max_value:', max_value, '; position:', max_position)
    }
    return max_position;
}

function getMaxMinPosition(current_position, playerColor, opponentColor, chessBoard, deepLevel) {
    chessBoard[current_position[0]][current_position[1]] = playerColor

    //console.log('getMaxMinPosition ---, current_position:', current_position, ', deepLevel:', deepLevel)
    //console.log('getMaxMinPosition ---, chessBoard:', chessBoard)
    //console.log('getMaxMinPosition ---, playerColor:', playerColor, ', opponentColor:', opponentColor)

    let max_position = null;

    /*
    let color_none = Global.EMPTY_CARO_VALUE;

    // true 代表黑棋，false 代表白棋。
    let human_color = opponentColor;
    let AI_color = playerColor;
    
    let max_value = 0;
    let current_value = 0;
    let current_position = [0, 0];
    let current_value_player_color = 0;
    let current_value_opponent_color = 0;
    let availablePositions = [];

    availablePositions = []
    for (let row = 0; row < Global.MAX_ROWS; row++) {
        for (let col = 0; col < Global.MAX_COLUMNS; col++) {
            if (chessBoard[row][col] === color_none) {
                current_position = [row, col];
                current_value_player_color = evaluate(current_position, AI_color, chessBoard);
                current_value_opponent_color = evaluate(current_position, human_color, chessBoard);
                if (current_value_opponent_color < 0) {
                    current_value_opponent_color = 0;
                }
                current_value = current_value_player_color + current_value_opponent_color;
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
        let randomIndex = Math.floor(Math.random() * availablePositions.length);
        max_position = availablePositions[randomIndex]
        console.log('AI random index:', randomIndex, '; selected position:', max_position)
    }
    else if (max_value >= 2000) {
        console.log('AI max_value:', max_value, '; position:', max_position)
    }
    */
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