import * as Global from './global.js'

const CaroBoard = (() => {
    let caroBoard = null
    let autoPlayRadius = Global.AUTO_PLAY_RADIUS
    let firstMove = null
    let secondMove = null
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
            firstMove = null
            secondMove = null
        },

        getBoard() {
            return caroBoard
        },

        getCopyBoard() {
            return clone2DArray(caroBoard)
        },

        getFirstMove() {
            return firstMove
        },

        setFirstMove(row, column) {
            firstMove = {row, column}
            console.log('firstMove:', firstMove)
        },

        getSecondMove() {
            return secondMove
        },

        setSecondMove(row, column) {
            secondMove = {row, column}
            console.log('secondMove:', secondMove)
        },

        putCaroValue(caroValue, row, column) {
            caroBoard[row][column] = caroValue
        },

        getRandomMove(caroValue) {
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
                //this.putCaroValue(caroValue, row, column)
                return {
                    caroValue, 
                    row, 
                    column
                }
            }
            return undefined
        },

        checkWon(row, column) {
            // get value at row, column
            let caroValue = caroBoard[row][column]
            if (caroValue)
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
                        
                        //console.log('checkWon. IN WHILE. direction:', direction, '; caroValue:', caroValue, '; countConsecutive:', countConsecutive, '; row:', countRow, '; column:', countColumn, '; caroBoard[countRow][countColumn]', caroBoard[countRow][countColumn])
                        countConsecutive++;
                    } while ((countRow < Global.MAX_ROWS) && (countColumn >= 0) && (countColumn < Global.MAX_COLUMNS) && (caroValue === caroBoard[countRow][countColumn]))
                    
                    // if (countConsecutive >= NUMBER_WON_ITEMS + 1)
                    // {
                    //     console.log('checkWon. OUT WHILE. direction:', direction, '; caroValue:', caroValue, '; countConsecutive:', countConsecutive, '; row:', countRow, '; column:', countColumn, '; caroBoard[countRow][countColumn]', caroBoard[countRow][countColumn])
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
                        let prevBound = (prevBoundRow >= 0 && prevBoundColumn >= 0 && prevBoundColumn < Global.MAX_COLUMNS) ? caroBoard[prevBoundRow][prevBoundColumn] : caroValue
                        let nextBound = (nextBoundRow < Global.MAX_ROWS && nextBoundColumn < Global.MAX_COLUMNS && nextBoundColumn >=0) ? caroBoard[nextBoundRow][nextBoundColumn] : caroValue

                        //console.log(`Check WON? direction: ${direction}, row: ${row}, column: ${column}, caroValue: ${caroValue}, prevBound(item -1)[${prevBoundRow}, ${prevBoundColumn}]: ${prevBound}, '; nextBound(item +5)[${nextBoundRow}, ${nextBoundColumn}]: ${nextBound}`)
                        
                        if ((prevBound != caroValue) && (!prevBound || !nextBound)) { // only NUMBER_WON_ITEMS = 5 items and no bound by opponent
                            console.log(`WON. direction: ${direction}, row: ${row}, column: ${column}, caroValue: ${caroValue}, prevBound(item -1)[${prevBoundRow}, ${prevBoundColumn}]: ${prevBound}, '; nextBound(item +5)[${nextBoundRow}, ${nextBoundColumn}]: ${nextBound}`)
                            return {
                                direction,
                                caroValue,
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
    let caroValue = caroBoard[row][column]
    if (caroValue)
    {
        let count = 1
        // check by horizontal
        // count by horizontal first
        while ((column + count < MAX_COLUMNS) && (caroValue === caroBoard[row][column + count])) {
            //console.log('IN WHILE. caroValue:', caroValue, '; count:', count, '; row:', row, '; column:', column, '; caroBoard[row][column + count]', caroBoard[row][column + count])
            count++;
        }
        
        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = column >= 1 ? caroBoard[row][column - 1] : caroValue
            let item5 = column + 5 < MAX_COLUMNS ? caroBoard[row][column + 5] : caroValue
            if ((item_1 != caroValue) && (!item_1 || !item5)) {
                console.log('WON. type: horizontal. row:', row, '; column:', column, '; caroValue:', caroValue, '; item -1([column - 1]):', item_1, '; item +5([column + 5]):', item5)
                return {
                    type: 'horizontal',
                    caroValue,
                    row,
                    column
                }
            }
        }

        count = 1
        // check by vertical
        // count by vertical first
        while ((row + count < MAX_ROWS) && (caroValue === caroBoard[row + count][column])) {
            count++;
        }
        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = row >= 1 ? caroBoard[row - 1][column] : caroValue
            let item5 = row + 5 < MAX_ROWS ? caroBoard[row + 5][column] : caroValue
            if ((item_1 != caroValue) && (!item_1 || !item5)) {
                console.log('WON. type: vertical. row:', row, '; column:', column, '; caroValue:', caroValue, '; item -1([row - 1]):', item_1, '; item +5([row + 5]):', item5)
                return {
                    type: 'vertical',
                    caroValue,
                    row,
                    column
                }
            }
        }

        count = 1
        // check by main-diagonal
        // count by main-diagonal first
        while ((row + count < MAX_ROWS) && (column + count < MAX_COLUMNS) && (caroValue === caroBoard[row + count][column + count])) {
            count++;
        }
        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = row >= 1 && column >= 1 ? caroBoard[row - 1][column - 1] : caroValue
            let item5 = row + 5 < MAX_ROWS && column + 5 < MAX_COLUMNS ? caroBoard[row + 5][column + 5] : caroValue
            if ((item_1 != caroValue) && (!item_1 || !item5)) {
                console.log('WON. type: main-diagonal. row:', row, '; column:', column, '; caroValue:', caroValue, '; item -1([row - 1][column - 1]):', item_1, '; item +5([row + 5][column + 5]):', item5)
                return {
                    type: 'main-diagonal',
                    caroValue,
                    row,
                    column
                }
            }
        }

        count = 1
        // check by minor-diagonal
        // count by minor-diagonal first
        while ((row + count < MAX_ROWS) && (column - count >= 0) && (caroValue === caroBoard[row + count][column - count])) {
            count++;
        }

        // total count 5 => check the item -1 & item +5
        if (count === 5) {
            let item_1 = row >= 1 && column + 1 < MAX_COLUMNS ? caroBoard[row - 1][column + 1] : caroValue
            let item5 = row + 5 < MAX_ROWS && column - 5 >= 0 ? caroBoard[row + 5][column - 5] : caroValue
            if ((item_1 != caroValue) && (!item_1 || !item5)) {
                console.log('WON. type: minor-diagonal. row:', row, '; column:', column, '; caroValue:', caroValue, '; item -1([row - 1][column + 1]):', item_1, '; item +5([row + 5][column - 5]):', item5)
                return {
                    type: 'minor-diagonal',
                    caroValue,
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
                caroValue: caroBoard[row][0],
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
                caroValue: caroBoard[0][col],
                row: 0,
                column: col
            }
        }
    }

    if (caroBoard[0][0] && caroBoard[0][0] === caroBoard[1][1] && caroBoard[1][1] === caroBoard[2][2])
    {
        return {
            type: 'main-diagonal',
            caroValue: caroBoard[0][0],
            row: 0,
            column: 0
        }
    }

    if (caroBoard[0][2] && caroBoard[0][2] === caroBoard[1][1] && caroBoard[1][1] === caroBoard[2][0])
    {
        return {
            type: 'minor-diagonal',
            caroValue: caroBoard[0][2],
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
        //console.log('putCaroValueRandom: ', result.caroValue, result.row, result.column)
        putCaroValue(result.row, result.column)
    }
    isPlayer1Playing = false
    isPlayer2Playing = false
}
*/