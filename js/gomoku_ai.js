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

// the boundary is available, it means not bound by opponent
// dont apply for small value <= 200
function is_bound_available(current_position, direction) {
    return (new_position_color(current_position, direction, -5) === color_none || new_position_color(current_position, direction, +1) === color_none);
}

export default function evaluate(current_position, color, caroBoard){
    chessBoard = caroBoard
    var value = 0;

    if(color === human_color){
        value = value-233;
    }

    for(var direction = 0; direction<4; direction++) {
        // ----------(1) 连五 11111 50000分
        // 连五 1111*
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            is_bound_available(current_position, direction+4))
        ){            
            if(color === AI_color){
                value += 500000;
            }
            value += 50000;
            continue;
        }
        // 连五 111*1
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 1) === color && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 1) === color && 
            is_bound_available(current_position, direction+4))
        ){
            if(color === AI_color){
                value += 500000;
            }
            value += 50000;
            continue;
        }
        // 连五 11*11
        if(new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color && 
            is_bound_available(current_position, direction)
        ){
            if(color === AI_color){
                value += 500000;
            }
            value += 50000;
            continue;
        }

        // ----------(2) 活4 011110 4320分
        // 活4 0111*0
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 4320;
            if(color===AI_color){
                value += 10000;
            }
            continue;
        }
        // 活4 011*10
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            if(color===AI_color){
                value += 10000;
            }
            value += 4320;
            continue;
        }

        // ---------- 活三和死四 720分 1720分
        // （3）and (4) 011100
        // 活3 011*00
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, -3) === color_none &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -3) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 670;
            continue;
        }

        // 活3 01*100
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 3) === color_none &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 670;
            continue;
        }

        // 活3 0*1100
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 4) === color_none &&
            new_position_color(current_position, direction, 3) === color_none &&
            new_position_color(current_position, direction, -1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 4) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none &&
            new_position_color(current_position, direction+4, -1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 670;
            continue;
        }

        // ---隔3（5） and (6) 011010
        // 隔3 0110*0
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, -4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, -4) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 620;
            continue;
        }

        // 隔3 01*010
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 620;
            continue;
        }

        // 隔3 0*1010
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 4) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 4) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 620;
            continue;
        }

        // ----------死四（7）and (8) 11110
        // 死四 111*0
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 1770;
            continue;
        }

        // 死四 11*10
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 1770;
            continue;
        }

        // 死四 1*110
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 1770;
            continue;
        }

        // 死四 *1110
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 1770;
            continue;
        }

        // ----------（9） 隔四 11011
        // 隔四 1*011
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 720;
            continue;
        }

        // 隔四 *1011
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 720;
            continue;
        }

        // 隔四（10） and (11) 11101
        // 隔四 11*01
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 745;
            continue;
        }

        // 隔四 1*101
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 745;
            continue;
        }

        // 隔四 *1101
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 745;
            continue;
        }

        // 隔四 1110*
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color &&
            new_position_color(current_position, direction, -1) === color_none && 
            is_bound_available(current_position, direction))
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            new_position_color(current_position, direction+4, -1) === color_none && 
            is_bound_available(current_position, direction+4))
        ){
            value += 745;
            continue;
        }

        // 活二（12） 001100
        // 活二 001*00 125
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
        // 000*10
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

        // 0001*0
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
        // 11*00
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

        // 1*100
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

        // *1100
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
        // 101*0
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

        // *0110
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

        // 10*10
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
        // *0101
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

        // 10*01
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
        // 0*110
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

        // 01*10
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
        // *1010
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

        // 1*010
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

        // 110*0
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
        // 隔二 0010*0
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