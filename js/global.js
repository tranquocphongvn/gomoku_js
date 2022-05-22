// get the value from --grid-columns, --grid-rows in the main.css
const MAX_ROWS = getComputedStyle(document.documentElement).getPropertyValue('--grid-rows')
const MAX_COLUMNS = getComputedStyle(document.documentElement).getPropertyValue('--grid-columns')
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

export {MAX_ROWS, MAX_COLUMNS, EMPTY_CARO_VALUE, CARO_X, CARO_O, NUMBER_WON_ITEMS, AUTO_PLAY_RADIUS, PLAYER_X, PLAYER_O, Direction, CaroXSpan, CaroOSpan}