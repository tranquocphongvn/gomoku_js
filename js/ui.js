import * as Global from './global.js'

export {buildCaroGrid, buildColumnHeaders, buildRowHeaders, showWonItems}

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function buildCaroGrid(maxRows, maxColumns) {
    let gridHtml = ''
    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < maxColumns; j++) {
            let diff = ((i + j) % 2 === 0)? 'grid-caro-cell-diff' : ''
            gridHtml += `<div class="grid-caro-cell ${diff}" data-row="${i}" data-column="${j}"></div>\n`
        }
    }
    return gridHtml
}

function buildColumnHeaders(maxColumns) {
    let gridHeaderHtml = ''
    for (let i = 1; i <= maxColumns; i++) {
        gridHeaderHtml += `<div class="grid-column-header">${i-1}</div>\n`
    }
    return gridHeaderHtml
}

function buildRowHeaders(maxRows) {
    let gridHeaderHtml = ''
    for (let i = 1; i <= maxRows; i++) {
        gridHeaderHtml += `<div class="grid-row-header"><span class="middle-item">${i-1}</span></div>\n`
    }
    return gridHeaderHtml
}

function showWonItems(wonResult) {
    let row = wonResult.row
    let column = wonResult.column
    for (let i = 0; i < Global.NUMBER_WON_ITEMS; i++) {
        let gridCaroCell = $(`.grid-caro-cell[data-row="${row}"][data-column="${column}"]`)
        if (gridCaroCell) {
            gridCaroCell.classList.add("won")
            switch (wonResult.direction) {
                case Global.Direction.Horizontal:
                    column++;
                    break
                case Global.Direction.Vertical:
                    row++
                    break
                case Global.Direction.MainDiagonal:
                    row++
                    column++
                    break
                case Global.Direction.MinorDiagonal:
                    row++
                    column--
                    break
                default:
                    break
            }
        }
    }
}