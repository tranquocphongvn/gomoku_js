// get the value from --grid-columns, --grid-rows in the main.css
const style = getComputedStyle(document.documentElement)
const root = document.querySelector(':root')

let cellSize = parseInt(style.getPropertyValue('--cell-width-height'), 10)
if (Number.isNaN(cellSize) || cellSize < 23)
    cellSize = 23

let numCols = Math.floor((window.screen.availWidth - 250)/cellSize)
let numRows = Math.floor((window.screen.availHeight - 150)/cellSize)

if (Number.isNaN(numCols) || numCols < 25)
    numCols = 25

if (Number.isNaN(numRows) || numRows < 20)
    numRows = 20

root.style.setProperty('--grid-rows', numRows);
root.style.setProperty('--grid-columns', numCols);
root.style.setProperty('--cell-width-height', cellSize + 'px');

//console.log('window.screen.availWidth:', window.screen.availWidth, ', window.screen.availHeight:', window.screen.availHeight);
//console.log('window.screen.width:', window.screen.width, ', window.screen.height:', window.screen.height, ', window.devicePixelRatio:', window.devicePixelRatio.toFixed(2))
// alert('window.screen.availWidth:' + window.screen.availWidth + ', window.screen.availHeight:' + window.screen.availHeight);
// alert('window.screen.width:' + window.screen.width + ', window.screen.height:' + window.screen.height + ', window.devicePixelRatio:' + window.devicePixelRatio.toFixed(2))

const MAX_ROWS = style.getPropertyValue('--grid-rows')
const MAX_COLUMNS = style.getPropertyValue('--grid-columns')
const EMPTY_CARO_VALUE = 0
const CARO_X = 1
const CARO_O = 2
const NUMBER_WON_ITEMS = 5
const AUTO_PLAY_RADIUS = 6
const PLAYER_X = 'X'
const PLAYER_O = 'O'
const Direction = {
    Horizontal: 'horizontal',
    Vertical: 'vertical',
    MainDiagonal: 'main-diagonal', 
    MinorDiagonal: 'minor-diagonal'
}
const CaroXSpan = `<span class="middle-item"><img class="newest caro-cell" src="./img/x.png" alt="x"></span>`
const CaroOSpan = `<span class="middle-item"><img class="newest caro-cell" src="./img/o.png" alt="o"></span>`
const CaroEmptySpan = `<span class="middle-item"><img class="newest caro-cell" src="./img/empty.png" alt=""></span>`

export {MAX_ROWS, MAX_COLUMNS, EMPTY_CARO_VALUE, CARO_X, CARO_O, NUMBER_WON_ITEMS, AUTO_PLAY_RADIUS, PLAYER_X, PLAYER_O, Direction, CaroXSpan, CaroOSpan, CaroEmptySpan}