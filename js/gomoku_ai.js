// get the source gomoku_ai.js from https://github.com/SiyangHe2017/Gomoku/tree/master/javascript
// modify it based on my rules.

import * as Global from './global.js'

let chessBoard = []
const board_boundary = 11;
//let human_color = Global.CARO_X;
//let AI_color = Global.CARO_O;
const color_none = Global.EMPTY_CARO_VALUE
const DEFAULT_MAX = -Infinity
const DEFAULT_MIN = Infinity


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
function is_bound_available(current_position, direction, distance_left, distance_right) {
    if (distance_left != null && distance_right != null)
        return (new_position_color(current_position, direction, distance_left) === color_none) || (new_position_color(current_position, direction, distance_right) === color_none)
    return true;
}

export default function evaluate(current_position, color, caroBoard) {
    chessBoard = caroBoard
    var value = 0;

    /*
    if(color === human_color){
        value = value-233;
    }
    */

    for(var direction = 0; direction < 4; direction++) {

        // Win: 1111(1) or (1)1111
        if((new_position_color(current_position, direction, 0) === color &&
            new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color &&
            is_bound_available(current_position, direction, -5, 1))
            ||
            (new_position_color(current_position, direction+4, 0) === color &&
            new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            is_bound_available(current_position, direction+4, 1, -5))
        ){            
            return 1000000;
        }

        // Win 111(1)1 or 1(1)111
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 0) === color &&
            new_position_color(current_position, direction, 1) === color &&
            is_bound_available(current_position, direction, -4, 2))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 0) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            is_bound_available(current_position, direction+4, 2, -4))
        ){            
            return 1000000;
        }

        // 连五 11(1)11
        if(new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 0) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color && 
            is_bound_available(current_position, direction, -3, 3)
        ){            
            return 1000000;
        }
    
        // ----------(1) 连五 11111 50000分
        // 连五 1111* or *1111
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color && 
            is_bound_available(current_position, direction, -5, 1))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            is_bound_available(current_position, direction+4, 1, -5))
        ){            
            /*
            if(color === AI_color){
                value += 500000;
            }
            */
            value += 50000;
            continue;
        }
        // 连五 111*1 or 1*111
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 1) === color && 
            is_bound_available(current_position, direction, -4, 2))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 1) === color && 
            is_bound_available(current_position, direction+4, 2, -4))
        ){
            /*
            if(color === AI_color){
                value += 500000;
            }
            */
            value += 50000;
            continue;
        }
        // 连五 11*11
        if(new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color && 
            is_bound_available(current_position, direction, -3, 3)
        ){
            /*
            if(color === AI_color){
                value += 500000;
            }
            */
            value += 50000;
            continue;
        }

        // ----------(2) 活4 011110 4320分
        // 活4 0111*0 or 0*1110. 6 items, dont need to check boundary
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
            /*
            if(color===AI_color){
                value += 10000;
            }
            */
            value += 7000 //4320;
            continue;
        }
        // 活4 011*10 or 01*110. 6 items, dont need to check boundary
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
            /*
            if(color===AI_color){
                value += 10000;
            }
            */
            value += 7000 //4320;
            continue;
        }

        // ---------- 活三和死四 720分 1720分
        // （3）and (4) 011100
        // 活3 011*00 or 00*110. 6 items, dont need to check boundary
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

        // 活3 01*100 or 001*10. 6 items, dont need to check boundary
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

        // 活3 0*1100 or 0011*0. 6 items, dont need to check boundary
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
        // 隔3 0110*0 or 0*0110. 6 items, dont need to check boundary
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

        // 隔3 01*010 or 010*10. 6 items, dont need to check boundary
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

        // 隔3 0*1010 or 0101*0. 6 items, dont need to check boundary
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
        // 死四 111*0 or 0*111
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -4, 2))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4, 2, -4))
        ){
            value += 1770;
            continue;
        }

        // 死四 11*10 or 01*11
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction, -3, 3))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4, 3, -3))
        ){
            value += 1770;
            continue;
        }

        // 死四 1*110 or 011*1
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction, -2, 4))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction+4, 4, -2))
        ){
            value += 1770;
            continue;
        }

        // 死四 *1110 or 0111*
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color_none && 
            is_bound_available(current_position, direction+4, 5, -1))
        ){
            value += 1770;
            continue;
        }

        // ----------（9） 隔四 11011
        // 隔四 1*011 or 110*1
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -2, 4))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4, 4, -2))
        ){
            value += 720;
            continue;
        }

        // 隔四 *1011 or 1101*
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4, 5, -1))
        ){
            value += 720;
            continue;
        }

        // 隔四（10） and (11) 11101
        // 隔四 11*01 or 01*11
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -3, 3))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction+4, 3, -3))
        ){
            value += 745;
            continue;
        }

        // 隔四 1*101 or 101*1
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction, -2, 4))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction+4, 4, -2))
        ){
            value += 745;
            continue;
        }

        // 隔四 *1101 or 1011*
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction+4, 5, -1))
        ){
            value += 745;
            continue;
        }

        // 隔四 1110* or *0111
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -4) === color &&
            new_position_color(current_position, direction, -1) === color_none && 
            is_bound_available(current_position, direction, -5, 1))
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -4) === color &&
            new_position_color(current_position, direction+4, -1) === color_none && 
            is_bound_available(current_position, direction+4, 1, -5))
        ){
            value += 745;
            continue;
        }

        // 活二（12） 001100 => 125
        // 活二 001*00 or 00*100. 6 items, dont need to check boundary
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
        // 000*10 or 01*000. 6 items, dont need to check boundary
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

        // 0001*0 or 0*1000. 6 items, dont need to check boundary
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
        // 11*00 or 00*11
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -3, 3))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction, 3, -3))
        ){
            value += 120;
            continue;
        }

        // 1*100 or 001*1
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction, -2, 4))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction, 4, -2))
        ){
            value += 120;
            continue;
        }

        // *1100 or 0011*
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color_none &&
            new_position_color(current_position, direction, 4) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color_none &&
            new_position_color(current_position, direction+4, 4) === color_none && 
            is_bound_available(current_position, direction, 5, -1))
        ){
            value += 120;
            continue;
        }

        // 死三 （18） 10110
        // 101*0 or 0*101
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -4, 2))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction, 2, -4))
        ){
            value += 120;
            continue;
        }

        // *0110 or 0110*
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 4) === color_none &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 4) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction, 5, -1))
        ){
            value += 120;
            continue;
        }

        // 10*10 or 01*01
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction, -3, 3))
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction, 3, -3))
        ){
            value += 120;
            continue;
        }

        // 死三 （19） 10101
        // *0101 or 1010*
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 4) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 4) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction, 5, -1))
        ){
            value += 120;
            continue;
        }

        // 10*01 or 10*01
        if((new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, -1) === color_none && 
            is_bound_available(current_position, direction, -3, 3))
            ||
            (new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, -1) === color_none && 
            is_bound_available(current_position, direction, 3, -3))
        ){
            value += 120;
            continue;
        }

        // 死三（20） 01110
        // 0*110 or 011*0
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction, -2, 4))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction, 4, -2))
        ){
            value += 120;
            continue;
        }

        // 01*10 or 01*10
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, -2) === color_none &&
            new_position_color(current_position, direction, 2) === color_none && 
            is_bound_available(current_position, direction, -3, 3))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, -2) === color_none &&
            new_position_color(current_position, direction+4, 2) === color_none && 
            is_bound_available(current_position, direction, 3, -3))
        ){
            value += 120;
            continue;
        }

        // 死三（21） 11010
        // *1010 or 0101*
        if((new_position_color(current_position, direction, 1) === color &&
            new_position_color(current_position, direction, 3) === color &&
            new_position_color(current_position, direction, 2) === color_none &&
            new_position_color(current_position, direction, 4) === color_none && 
            is_bound_available(current_position, direction, -1, 5))
            ||
            (new_position_color(current_position, direction+4, 1) === color &&
            new_position_color(current_position, direction+4, 3) === color &&
            new_position_color(current_position, direction+4, 2) === color_none &&
            new_position_color(current_position, direction+4, 4) === color_none && 
            is_bound_available(current_position, direction, 5, -1))
        ){
            value += 120;
            continue;
        }

        // 1*010 or 010*1
        if((new_position_color(current_position, direction, -1) === color &&
            new_position_color(current_position, direction, 2) === color &&
            new_position_color(current_position, direction, 1) === color_none &&
            new_position_color(current_position, direction, 3) === color_none && 
            is_bound_available(current_position, direction, -2, 4))
            ||
            (new_position_color(current_position, direction+4, -1) === color &&
            new_position_color(current_position, direction+4, 2) === color &&
            new_position_color(current_position, direction+4, 1) === color_none &&
            new_position_color(current_position, direction+4, 3) === color_none && 
            is_bound_available(current_position, direction, 4, -2))
        ){
            value += 120;
            continue;
        }

        // 110*0 or 0*011
        if((new_position_color(current_position, direction, -2) === color &&
            new_position_color(current_position, direction, -3) === color &&
            new_position_color(current_position, direction, -1) === color_none &&
            new_position_color(current_position, direction, 1) === color_none && 
            is_bound_available(current_position, direction, -4, 2))
            ||
            (new_position_color(current_position, direction+4, -2) === color &&
            new_position_color(current_position, direction+4, -3) === color &&
            new_position_color(current_position, direction+4, -1) === color_none &&
            new_position_color(current_position, direction+4, 1) === color_none && 
            is_bound_available(current_position, direction, 2, -4))
        ){
            value += 120;
        }

        // 隔二 （13）and (14) 001010
        // 隔二 0010*0 or 0*0100. 6 items, dont need to check boundary
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

        // 隔二 00*010 or 010*00. 6 items, dont need to check boundary
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

        // 活一 000*00 or 00*000（15） and (16). 6 items, dont need to check boundary
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