import {
BOARD_SIZE,
PLAYER,
EMPTY,
DIRS
} from "./constants.js"

import {
inBounds,
countDir
} from "./utils.js"


// ─────────────────────────────
// 내부 streak 계산
// ─────────────────────────────

function streak(board,r,c,dr,dc){

let fwd =
countDir(board,r,c,dr,dc,PLAYER)

let bwd =
countDir(board,r,c,-dr,-dc,PLAYER)

let total =
1 + fwd + bwd

let fr =
r + (fwd+1)*dr

let fc =
c + (fwd+1)*dc

let br =
r - (bwd+1)*dr

let bc =
c - (bwd+1)*dc

let fwdOpen =
inBounds(fr,fc) &&
board[fr][fc] === EMPTY

let bwdOpen =
inBounds(br,bc) &&
board[br][bc] === EMPTY

return [
total,
fwdOpen,
bwdOpen
]

}


// ─────────────────────────────
// 장목 체크
// ─────────────────────────────

function isOverline(board,r,c){

for(let [dr,dc] of DIRS){

let total =
1
+
countDir(board,r,c,dr,dc,PLAYER)
+
countDir(board,r,c,-dr,-dc,PLAYER)

if(total >= 6)
return true

}

return false

}


// ─────────────────────────────
// 4목 개수
// ─────────────────────────────

function countFours(board,r,c){

let cnt = 0

for(let [dr,dc] of DIRS){

let [total,fwd,bwd] =
streak(board,r,c,dr,dc)

if(
total === 4 &&
(fwd || bwd)
){

cnt++

}

}

return cnt

}


// ─────────────────────────────
// 열린 3목 개수
// ─────────────────────────────

function countOpenThrees(board,r,c){

let cnt = 0

for(let [dr,dc] of DIRS){

let [total,fwd,bwd] =
streak(board,r,c,dr,dc)

if(
total === 3 &&
fwd &&
bwd
){

cnt++

}

}

return cnt

}


// ─────────────────────────────
// 금수 판정
// ─────────────────────────────

export function isForbidden(
board,
r,
c
){

board[r][c] = PLAYER


// ① 정확히 5목

let five = false

for(let [dr,dc] of DIRS){

let total =
1
+
countDir(board,r,c,dr,dc,PLAYER)
+
countDir(board,r,c,-dr,-dc,PLAYER)

if(total === 5){

five = true
break

}

}

if(five){

board[r][c] = EMPTY
return null

}


// ② 장목

if(isOverline(board,r,c)){

board[r][c] = EMPTY

return "장목(6목 이상)"

}


// ③ 사사

if(
countFours(board,r,c) >= 2
){

board[r][c] = EMPTY

return "사사(4-4 금수)"

}


// ④ 삼삼

if(
countOpenThrees(board,r,c) >= 2
){

board[r][c] = EMPTY

return "삼삼(3-3 금수)"

}


board[r][c] = EMPTY

return null

}
