import * as Global from './global.js'

const CaroBoard = (() => {
    let caroBoard = null
    let autoPlayRadius = Global.AUTO_PLAY_RADIUS
    let firstMoved = null
    let secondMoved = null
    let historyPlayed = null
    let indexHistoryPlayed = -1

    function convertPlayerValue(playerValue) {
        return playerValue === Global.CARO_X? Global.PLAYER_X : (playerValue === Global.CARO_O? Global.PLAYER_O : '<N/A>')
    }

    function create2DArray(rows, columns, defaultValue) {
        let arr = new Array();
        // Creates all lines:
        for(let i = 0; i < rows; i++) {
            // Creates an empty line
            arr.push([]);
    
            // Adds cols to the empty line:
            arr[i].push(new Array(columns));
    
            for(let j = 0; j < columns; j++){
                // Initializes:
                arr[i][j] = defaultValue;
            }
        }
        return arr;
    }
    
    function clone2DArray(array2D) {
        var new2DArray = array2D.map(function(row) {
            return row.slice()
        })

        return new2DArray
    }

    return {
        initBoard() {
            caroBoard = create2DArray(Global.MAX_ROWS, Global.MAX_COLUMNS, Global.EMPTY_CARO_VALUE)
            autoPlayRadius = Global.AUTO_PLAY_RADIUS
            firstMoved = null
            secondMoved = null

            historyPlayed = []
        },

        getBoard() {
            return caroBoard
        },

        getCopyBoard() {
            return clone2DArray(caroBoard)
        },

        getFirstMoved() {
            return firstMoved
        },

        setFirstMoved(row, column) {
            firstMoved = {row, column}
            console.log('firstMoved:', firstMoved)
        },

        getSecondMoved() {
            return secondMoved
        },

        setSecondMoved(row, column) {
            secondMoved = {row, column}
            console.log('secondMoved:', secondMoved)
        },

        putCaroValue(playerValue, row, column, evalValue) {
            let point = {
                index: historyPlayed.length + 1,
                row, 
                column,
                evalValue,
                playerValue
            }
            historyPlayed.push(point)
            indexHistoryPlayed = historyPlayed.length - 1

            caroBoard[row][column] = playerValue
        },

        convertPlayerValue(playerValue) {
            return convertPlayerValue(playerValue)
        },

        getLastIndexPlayed() {
            return historyPlayed.length - 1
        },

        getHistoryPlayed() {
            return historyPlayed
        },

        historyToText() {
            let text = historyPlayed.reduce((accu_text, point) => {
                        return accu_text + `[${point.row}, ${point.column}: ${point.evalValue}: ${point.playerValue}]; `
                    }, 
                '')
            return text
        },

        /*

        setIndexPlayed(index) {
            if (index >= 0 && index <= historyPlayed.length - 1)
                indexHistoryPlayed = index
        },

        getIndexPlayed() {
            return indexHistoryPlayed
        },

        getHistoryPlayed() {
            return historyPlayed
        },

        
        getPointPlayedByIndex(index) {
            if (index >= 0 && index <= historyPlayed.length - 1)
                return historyPlayed[index]
            
            return null
        },
        */

        getPrevHistory() {
            let index = indexHistoryPlayed;
            if (index >= 0 && index <= historyPlayed.length - 1) {
                indexHistoryPlayed = index - 1

                return historyPlayed[index]
            }
            return null
        },

        getNextHistory() {
            let index = indexHistoryPlayed + 1;
            if (index >= 0 && index <= historyPlayed.length - 1) {
                indexHistoryPlayed = index
                
                return historyPlayed[index]
            }

            return null
        },

        getRandomMove(playerValue) {
            let row = null
            let column = null
            let hasSpace = true
            
            let centerRow = Math.floor(Global.MAX_ROWS/2)
            let centerColumn = Math.floor(Global.MAX_COLUMNS/2)
            let maxRadius = Math.min(centerRow, centerColumn)
        
            do {
                do {
                    let startRow = (centerRow - autoPlayRadius >= 0) ? centerRow - autoPlayRadius: 0;
                    let endRow = (centerRow + autoPlayRadius + 1 <= Global.MAX_ROWS) ? centerRow + autoPlayRadius + 1 : Global.MAX_ROWS; // autoPlayRadius+1 because include the last item
            
                    let startColumn = (centerColumn - autoPlayRadius >= 0) ? centerColumn - autoPlayRadius: 0;
                    let endColumn = (centerColumn + autoPlayRadius + 1 <= Global.MAX_COLUMNS) ? centerColumn + autoPlayRadius + 1: Global.MAX_COLUMNS; // autoPlayRadius+1 because include the last item
        
                    row = startRow + Math.floor(Math.random() * (endRow - startRow))
                    column =  startColumn + Math.floor(Math.random() * (endColumn - startColumn))
        
                    hasSpace = this.isHasSpace(startRow, startColumn, endRow, endColumn)
        
                    //console.log('row:', row, '; column:', column, '; autoPlayRadius:', autoPlayRadius, '; maxRadius:', maxRadius, '; hasSpace:', hasSpace)
                    //console.log('startRow:', startRow, '; startColumn:', startColumn, '; endRow:', endRow, '; endColumn:', endColumn)
        
                    if (!hasSpace)
                        autoPlayRadius++;
                
                } while (caroBoard[row][column] && (autoPlayRadius < maxRadius))
        
                if (autoPlayRadius >= maxRadius)
                {
                    row = Math.floor(Math.random() * Global.MAX_ROWS)
                    column =  Math.floor(Math.random() * Global.MAX_COLUMNS)
                    hasSpace = this.isHasSpace()
                }
            } while (caroBoard[row][column] && hasSpace)
            
            if ((row != null) && (column != null) && hasSpace) {
                //this.putCaroValue(playerValue, row, column, evalValue)
                return {
                    playerValue, 
                    row, 
                    column,
                    evalValue
                }
            }
            return undefined
        },

        checkWon(row, column) {
            // get value at row, column
            let playerValue = caroBoard[row][column]
            if (playerValue)
            {
                let directions = ['horizontal', 'vertical', 'main-diagonal', 'minor-diagonal']  // directions: - , | , \ , /
                for (let direction of directions) {
                    // check by direction
                    // count Consecutive by direction first
                    let countConsecutive = 1
                    let countRow = row
                    let countColumn = column
                    do {
                        switch (direction) {
                            case 'horizontal':
                                countColumn = column + countConsecutive
                                break
                            case 'vertical':
                                countRow = row + countConsecutive
                                break
                            case 'main-diagonal':
                                countRow = row + countConsecutive
                                countColumn = column + countConsecutive
                                break
                            case 'minor-diagonal':
                                countRow = row + countConsecutive
                                countColumn = column - countConsecutive
                                break
                            default:
                                return undefined
                        } 
                        
                        //console.log('checkWon. IN WHILE. direction:', direction, '; playerValue:', playerValue, '; countConsecutive:', countConsecutive, '; row:', countRow, '; column:', countColumn, '; caroBoard[countRow][countColumn]', caroBoard[countRow][countColumn])
                        countConsecutive++;
                    } while ((countRow < Global.MAX_ROWS) && (countColumn >= 0) && (countColumn < Global.MAX_COLUMNS) && (playerValue === caroBoard[countRow][countColumn]))
                    
                    // if (countConsecutive >= NUMBER_WON_ITEMS + 1)
                    // {
                    //     console.log('checkWon. OUT WHILE. direction:', direction, '; playerValue:', playerValue, '; countConsecutive:', countConsecutive, '; row:', countRow, '; column:', countColumn, '; caroBoard[countRow][countColumn]', caroBoard[countRow][countColumn])
                    // }

                    // total count NUMBER_WON_ITEMS = 5 => check the prevBound (item -1) & nextBound (item +5)
                    let prevBoundRow = row
                    let prevBoundColumn = column
                    let nextBoundRow = row
                    let nextBoundColumn = column

                    switch (direction) {
                        case 'horizontal':
                            prevBoundColumn = column - 1
                            nextBoundColumn = column + Global.NUMBER_WON_ITEMS
                            break
                        case 'vertical':
                            prevBoundRow = row - 1
                            nextBoundRow = row + Global.NUMBER_WON_ITEMS
                            break
                        case 'main-diagonal':
                            prevBoundRow = row - 1
                            prevBoundColumn = column - 1
                            nextBoundRow = row + Global.NUMBER_WON_ITEMS
                            nextBoundColumn = column + Global.NUMBER_WON_ITEMS
                            break
                        case 'minor-diagonal':
                            prevBoundRow = row - 1
                            prevBoundColumn = column + 1
                            nextBoundRow = row + Global.NUMBER_WON_ITEMS
                            nextBoundColumn = column - Global.NUMBER_WON_ITEMS
                            break
                        default:
                            return undefined
                    } 
                    // total count NUMBER_WON_ITEMS = 5 => check the prevBound (item -1) & nextBound (item +5)
                    if (countConsecutive === Global.NUMBER_WON_ITEMS + 1) { // NUMBER_WON_ITEMS + 1 because of: do {...} while()
                        let prevBound = (prevBoundRow >= 0 && prevBoundColumn >= 0 && prevBoundColumn < Global.MAX_COLUMNS) ? caroBoard[prevBoundRow][prevBoundColumn] : playerValue
                        let nextBound = (nextBoundRow < Global.MAX_ROWS && nextBoundColumn < Global.MAX_COLUMNS && nextBoundColumn >=0) ? caroBoard[nextBoundRow][nextBoundColumn] : playerValue

                        //console.log(`Check WON? direction: ${direction}, row: ${row}, column: ${column}, playerValue: ${playerValue}, prevBound(item -1)[${prevBoundRow}, ${prevBoundColumn}]: ${prevBound}, '; nextBound(item +5)[${nextBoundRow}, ${nextBoundColumn}]: ${nextBound}`)
                        
                        if ((prevBound != playerValue) && (!prevBound || !nextBound)) { // only NUMBER_WON_ITEMS = 5 items and no bound by opponent
                            console.log(`WON. direction: ${direction}, row: ${row}, column: ${column}, playerValue: ${playerValue} (${convertPlayerValue(playerValue)}), prevBound(item -1)[${prevBoundRow}, ${prevBoundColumn}]: ${prevBound}, nextBound(item +5)[${nextBoundRow}, ${nextBoundColumn}]: ${nextBound}`)
                            return {
                                direction,
                                playerValue,
                                row,
                                column
                            }
                        }
                    }
                }
            }
            return undefined
        },
        
        checkWonInRange(basedRow, basedColumn, endRow, endColumn)
        {
            let startCol = (basedColumn - 5 >= 0) ? basedColumn - 5 : 0 // Global.NUMBER_WON_ITEMS = 5
            let endCol = (basedColumn + 6 <= Global.MAX_COLUMNS) ? basedColumn + 6 : Global.MAX_COLUMNS // 5+1 because include the last item
            let startRow = (basedRow - 5 >= 0) ? basedRow - 5 : 0
            if (endRow != null && endColumn != null) {
                startRow = 0
                basedRow = endRow - 1 // because of: for (; row <= basedRow; )
                startCol = 0
                endCol = endColumn
                console.log('checkWonInRange. WHOLE BOARD. startRow(0):', startRow, 'startCol(0):', startCol, 'endRow(=basedRow):', basedRow, 'endCol(=endColumn):', endCol)
            }

            for (let row = startRow; row <= basedRow; row++) {
                for (let col = startCol; col < endCol; col++) {
                    let result = this.checkWon(row, col)
                    if (result)
                        return result
                }
            }
            return undefined
        },

        isHasSpace(startRow, startColumn, endRow, endColumn) {
            if (startRow && startColumn && endRow && endColumn) {
                for (let row = startRow; row < endRow; row++) {
                    for (let col = startColumn; col < endColumn; col++) {
                        if (caroBoard[row][col] === Global.EMPTY_CARO_VALUE)
                            return true
                    }
                }
            }
            else {
                return caroBoard.some(row => {
                    return row.some(cell => cell === Global.EMPTY_CARO_VALUE)
                })
            }
        }
        
    }
})


export default CaroBoard

/*
function isCaroBoardHasSpace(startRow, startColumn, endRow, endColumn) {
    if (startRow && startColumn && endRow && endColumn) {
        for (let row = startRow; row < endRow; row++) {
            for (let col = startColumn; col < endColumn; col++) {
                if (caroBoard[row][col] === DEFAULT_CARO_VALUE)
                    return true
            }
        }
    }
    else {
        return caroBoard.some(row => {
            return row.some(cell => cell === DEFAULT_CARO_VALUE)
        })
    }
}

function checkWon(row, column) {
    let playerValue = caroBoard[row][column]
    if (playerValue)
    {
        let count = 1
        // check by horizontal
        // count by horizontal first
        while ((column + count < MAX_COLUMNS) && (playerValue === caroBoard[row][column + count])) {
            //console.log('IN WHILE. playerValue:', playerValue, '; count:', count, '; row:', row, '; column:', column, '; caroBoard[row][column + count]', caroBoard[row][column + count])
            count++;
        }
        
        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = column >= 1 ? caroBoard[row][column - 1] : playerValue
            let item5 = column + 5 < MAX_COLUMNS ? caroBoard[row][column + 5] : playerValue
            if ((item_1 != playerValue) && (!item_1 || !item5)) {
                console.log('WON. type: horizontal. row:', row, '; column:', column, '; playerValue:', playerValue, '; item -1([column - 1]):', item_1, '; item +5([column + 5]):', item5)
                return {
                    type: 'horizontal',
                    playerValue,
                    row,
                    column
                }
            }
        }

        count = 1
        // check by vertical
        // count by vertical first
        while ((row + count < MAX_ROWS) && (playerValue === caroBoard[row + count][column])) {
            count++;
        }
        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = row >= 1 ? caroBoard[row - 1][column] : playerValue
            let item5 = row + 5 < MAX_ROWS ? caroBoard[row + 5][column] : playerValue
            if ((item_1 != playerValue) && (!item_1 || !item5)) {
                console.log('WON. type: vertical. row:', row, '; column:', column, '; playerValue:', playerValue, '; item -1([row - 1]):', item_1, '; item +5([row + 5]):', item5)
                return {
                    type: 'vertical',
                    playerValue,
                    row,
                    column
                }
            }
        }

        count = 1
        // check by main-diagonal
        // count by main-diagonal first
        while ((row + count < MAX_ROWS) && (column + count < MAX_COLUMNS) && (playerValue === caroBoard[row + count][column + count])) {
            count++;
        }
        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = row >= 1 && column >= 1 ? caroBoard[row - 1][column - 1] : playerValue
            let item5 = row + 5 < MAX_ROWS && column + 5 < MAX_COLUMNS ? caroBoard[row + 5][column + 5] : playerValue
            if ((item_1 != playerValue) && (!item_1 || !item5)) {
                console.log('WON. type: main-diagonal. row:', row, '; column:', column, '; playerValue:', playerValue, '; item -1([row - 1][column - 1]):', item_1, '; item +5([row + 5][column + 5]):', item5)
                return {
                    type: 'main-diagonal',
                    playerValue,
                    row,
                    column
                }
            }
        }

        count = 1
        // check by minor-diagonal
        // count by minor-diagonal first
        while ((row + count < MAX_ROWS) && (column - count >= 0) && (playerValue === caroBoard[row + count][column - count])) {
            count++;
        }

        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = row >= 1 && column + 1 < MAX_COLUMNS ? caroBoard[row - 1][column + 1] : playerValue
            let item5 = row + 5 < MAX_ROWS && column - 5 >= 0 ? caroBoard[row + 5][column - 5] : playerValue
            if ((item_1 != playerValue) && (!item_1 || !item5)) {
                console.log('WON. type: minor-diagonal. row:', row, '; column:', column, '; playerValue:', playerValue, '; item -1([row - 1][column + 1]):', item_1, '; item +5([row + 5][column - 5]):', item5)
                return {
                    type: 'minor-diagonal',
                    playerValue,
                    row,
                    column
                }
            }
        }
    }

    return undefined
}

function checkWonTicTacToe() {
    for (let row = 0; row < 3 ; row++) {
        if (caroBoard[row][0] && caroBoard[row][0] === caroBoard[row][1] && caroBoard[row][1] === caroBoard[row][2])
        {
            return {
                type: 'horizontal',
                playerValue: caroBoard[row][0],
                row: row,
                column: 0
            }
        }
    }

    for (let col = 0; col < 3 ; col++) {
        if (caroBoard[0][col] && caroBoard[0][col] === caroBoard[1][col] && caroBoard[1][col] === caroBoard[2][col])
        {
            return {
                type: 'vertical',
                playerValue: caroBoard[0][col],
                row: 0,
                column: col
            }
        }
    }

    if (caroBoard[0][0] && caroBoard[0][0] === caroBoard[1][1] && caroBoard[1][1] === caroBoard[2][2])
    {
        return {
            type: 'main-diagonal',
            playerValue: caroBoard[0][0],
            row: 0,
            column: 0
        }
    }

    if (caroBoard[0][2] && caroBoard[0][2] === caroBoard[1][1] && caroBoard[1][1] === caroBoard[2][0])
    {
        return {
            type: 'minor-diagonal',
            playerValue: caroBoard[0][2],
            row: 0,
            column: 2
        }
    }

    return undefined
}

function putCaroValueRandom() {
    let result = theCaroBoard.getRandomMove(isCaroX ? Global.CARO_X : Global.CARO_O)
    if (result)
    {   
        //console.log('putCaroValueRandom: ', result.playerValue, result.row, result.column)
        putCaroValue(result.row, result.column)
    }
    isPlayer1Playing = false
    isPlayer2Playing = false
}
*/