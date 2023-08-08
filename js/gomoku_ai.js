import * as Global from './global.js'

let chessBoard = []
const board_boundary = 11;
let human_color = Global.CARO_X;
let AI_color = Global.CARO_O;
const color_none = Global.EMPTY_CARO_VALUE


// 相对于position的new_position中direction代表方向，distance代表距离。
// x: row; y: column
function new_position_color(position, direction, distance){
    let position_x = position[0];
    let position_y = position[1];

    if (direction === 0) {
        position_x = position_x + distance;
    }else if(direction === 1){
        position_x = position_x + distance;
        position_y = position_y + distance;
    }else if(direction === 2){
        position_y = position_y + distance;
    }else if(direction === 3){
        position_x = position_x - distance;
        position_y = position_y + distance;
    }else if(direction === 4){
        position_x = position_x - distance;
    }else if(direction === 5){
        position_x = position_x - distance;
        position_y = position_y - distance;
    }else if(direction === 6){
        position_y = position_y - distance;
    }else if(direction === 7){
        position_x = position_x + distance;
        position_y = position_y - distance;
    }

    if(position_x < 0 || position_x >= Global.MAX_ROWS || position_y < 0 || position_y >= Global.MAX_COLUMNS){
        return board_boundary;
    }
    return chessBoard[position_x][position_y];
}

function position_color(position) {
    let position_x = position[0];
    let position_y = position[1];

    console.log('chessBoard: ', chessBoard);
    let color = chessBoard[position_x][position_y];
    console.log('position:', position, ', position_x:', position_x, ', position_y:', position_y, ', color:', color)
    return color;
}

// the un-boundary is available, it means not bound by opponent, or myself
// dont apply for small value <= 200
function is_unbound_available(current_position, direction, left_bound, right_bound, color) {
    /*
    return (new_position_color(current_position, direction, -5) === color_none) ||
        (new_position_color(current_position, direction, +1) === color_none);
    */
    
    return (new_position_color(current_position, direction, left_bound) === color_none && new_position_color(current_position, direction, right_bound) !== color) ||
        (new_position_color(current_position, direction, left_bound) !== color && new_position_color(current_position, direction, right_bound) === color_none) ;
}

export default function evaluate(current_position, color, caroBoard){
    chessBoard = caroBoard
    var value = 0;

    if(color === human_color){
        value = value - 233;
    }

    for(var direction = 0; direction<4; direction++) {
        /*
        // ----------(1) 连五 11111 5000000分
        // 连五 ?1111[1]?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color &&
            position_color(current_position) === color &&
            is_unbound_available(current_position, direction, -5, 1, color))
        ){            
            console.log('?1111[1]?')

            if(color === AI_color){
                value += 55555555;
            }
            break;
        }

        // 连五 ?111[1]1?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            position_color(current_position) === color &&
            new_position_color(current_position, direction, 1) === color &&
            is_unbound_available(current_position, direction, -4, 2, color))
        ){            
            console.log('?111[1]1?')

            if(color === AI_color){
                value += 55555555;
            }
            break;
        }
        
        // 连五 ?11[1]11?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            position_color(current_position) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            is_unbound_available(current_position, direction, -3, 3, color))
        ){            
            console.log('?11[1]11?')

            if(color === AI_color){
                value += 55555555;
            }
            break;
        }
        */


        // ----------(1) 连五 11111 50000分
        // 连五 1111* / ?1111*?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color && 
            is_unbound_available(current_position, direction, -5, 1, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            is_unbound_available(current_position, direction+4, -5, 1, color))
        ){            
            if(color === AI_color){
                value += 500000;
            }
            value += 50000;
            continue;
        }
        // 连五 111*1 / ?111*1?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 1) === color && 
            is_unbound_available(current_position, direction, -4, 2, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 1) === color && 
            is_unbound_available(current_position, direction+4, -4, 2, color))
        ){
            if(color === AI_color){
                value += 500000;
            }
            value += 50000;
            continue;
        }
        // 连五 11*11 / ?11*11?
        if(new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color && 
            is_unbound_available(current_position, direction, -3, 3, color)
        ){
            if(color === AI_color){
                value += 500000;
            }
            value += 50000;
            continue;
        }

        // ----------(2) 活4 011110 4320分
        // 活4 0111*0 / ?_111*_?  / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none)
        ){
            value += 4320;
            if(color === AI_color){
                value += 10000;
            }
            continue;
        }
        // 活4 011*10 / ?_11*1_? / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, 2) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            if(color === AI_color){
                value += 10000;
            }
            value += 4320;
            continue;
        }

        // ---------- 活三和死四 720分 1720分
        // （3）and (4) 011100
        // 活3 011*00 / ?_11*__? / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, 2) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            value += 670;
            continue;
        }

        // 活3 01*100 / ?_1*1__? / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 3) === color_none &&
            new_position_color(current_position, direction, 2) === color_none)
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            value += 670;
            continue;
        }

        // 活3 0*1100 / ?_*11__?
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 4) === color_none &&
            new_position_color(current_position, direction, 3) === color_none &&
            new_position_color(current_position, direction, -1) === color_none)
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 4) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none &&
            new_position_color(current_position, direction+4, -1) === color_none)
        ){
            value += 670;
            continue;
        }

        // ---隔3（5） and (6) 011010
        // 隔3 0110*0 / ?_11_*_? / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, -4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, -4) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none)
        ){
            value += 620;
            continue;
        }

        // 隔3 01*010 / ?_1*_1_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none)
        ){
            value += 620;
            continue;
        }

        // 隔3 0*1010 / ?_*1_1_? / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 4) === color_none)
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 4) === color_none)
        ){
            value += 620;
            continue;
        }

        // ----------死四（7）and (8) 11110
        // 死四 111*0 / ?111*_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_unbound_available(current_position, direction, -4, 2, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_unbound_available(current_position, direction+4, -4, 2, color))
        ){
            value += 1770;
            continue;
        }

        // 死四 11*10 / ?11*1_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_unbound_available(current_position, direction, -3, 3, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_unbound_available(current_position, direction+4, -3, 3, color))
        ){
            value += 1770;
            continue;
        }

        // 死四 1*110 / ?1*11_?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_unbound_available(current_position, direction, -2, 4, color))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_unbound_available(current_position, direction+4, -2, 4, color))
        ){
            value += 1770;
            continue;
        }

        // 死四 *1110 / ?*111_?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color_none && 
            is_unbound_available(current_position, direction, -1, 5, color))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color_none && 
            is_unbound_available(current_position, direction+4, -1, 5, color))
        ){
            value += 1770;
            continue;
        }

        // ----------（9） 隔四 11011
        // 隔四 1*011 / ?1*_11?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_unbound_available(current_position, direction, -2, 4, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_unbound_available(current_position, direction+4, -2, 4, color))
        ){
            value += 720;
            continue;
        }

        // 隔四 *1011 / ?*1_11?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_unbound_available(current_position, direction, -1, 5, color))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_unbound_available(current_position, direction+4, -1, 5, color))
        ){
            value += 720;
            continue;
        }

        // 隔四（10） and (11) 11101
        // 隔四 11*01 / ?11*_1?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_unbound_available(current_position, direction, -3, 3, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_unbound_available(current_position, direction+4, -3, 3, color))
        ){
            value += 745;
            continue;
        }

        // 隔四 1*101 / ?1*1_1?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_unbound_available(current_position, direction, -2, 4, color))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_unbound_available(current_position, direction+4, -2, 4, color))
        ){
            value += 745;
            continue;
        }

        // 隔四 *1101 / ?*11_1?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_unbound_available(current_position, direction, -1, 5, color))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_unbound_available(current_position, direction+4, -1, 5, color))
        ){
            value += 745;
            continue;
        }

        // 隔四 1110* / ?111_*?
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color &&
            new_position_color(current_position, direction, -1) === color_none && 
            is_unbound_available(current_position, direction, -5, 1, color))
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            new_position_color(current_position, direction+4, -1) === color_none && 
            is_unbound_available(current_position, direction+4, -5, 1, color))
        ){
            value += 745;
            continue;
        }

        // 活二（12） 001100
        // 活二 001*00 125  / ?__1*__?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 2) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            value += 125;
            continue;
        }

        // 偏二
        // 偏二 （12.5） 000110
        // 000*10 / ?___1*_?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, -2) === color_none)
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            value += 125;
            continue;
        }

        // 0001*0 / ?___1*_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -4) === color_none &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, -2) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -4) === color_none)
        ){
            value += 125;
            continue;
        }

        // 死三 （17） 11100
        // 11*00 / ?11*__?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none)
        ){
            value += 120;
            continue;
        }

        // 1*100 / ?1*1__?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 3) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none)
        ){
            value += 120;
            continue;
        }

        // *1100 / ?*11__?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color_none &&
            new_position_color(current_position, direction, 4) === color_none)
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color_none &&
            new_position_color(current_position, direction+4, 4) === color_none)
        ){
            value += 120;
            continue;
        }

        // 死三 （18） 10110
        // 101*0 / ?1_1*_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none)
        ){
            value += 120;
            continue;
        }

        // *0110 / ?*_11_?
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none)
        ){
            value += 120;
            continue;
        }

        // 10*10 / ?1_*1_?
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 2) === color_none)
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            value += 120;
            continue;
        }

        // 死三 （19） 10101
        // *0101 / ?*_1_1?
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none)
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none)
        ){
            value += 120;
            continue;
        }

        // 10*01 / ?1_*_1?
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, -1) === color_none)
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -1) === color_none)
        ){
            value += 120;
            continue;
        }

        // 死三（20） 01110
        // 0*110 / ?_*11_?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none)
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none)
        ){
            value += 120;
            continue;
        }

        // 01*10 / ?_1*1_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 2) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none)
        ){
            value += 120;
            continue;
        }

        // 死三（21） 11010
        // *1010 / ?*1_1_?
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 4) === color_none)
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 4) === color_none)
        ){
            value += 120;
            continue;
        }

        // 1*010 / ?1*_1_?
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none)
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none)
        ){
            value += 120;
            continue;
        }

        // 110*0 / ?11_*_?
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none)
        ){
            value += 120;
        }

        // 隔二 （13）and (14) 001010
        // 隔二 0010*0 / 6 spaces, dont check bound
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, -4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none)
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -4) === color_none)
        ){
            value += 115;
            continue;
        }

        // 隔二 00*010
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none)
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none)
        ){
            value += 115;
            continue;
        }

        // 活一 000*00 （15） and (16)
        if((new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, -3) === color_none)
            ||
            (new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none)
        ){
            value += 1;
            continue;
        }



    }
    return value;
}