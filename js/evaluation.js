import {
PLAYER,
AI,
EMPTY,
DIRS,
SCORE_OPEN,
SCORE_HALF
} from "./constants.js"

import {
inBounds,
countDir
} from "./utils.js"


// ─────────────────────────────
// 위치 점수 계산
// score_pos()
// ─────────────────────────────

export function scorePos(
board,
r,
c,
who
){

let totalScore = 0

for(let [dr,dc] of DIRS){

let fwd =
countDir(board,r,c,dr,dc,who)

let bwd =
countDir(board,r,c,-dr,-dc,who)

let cnt =
1 + fwd + bwd


// 열린 끝 계산

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


let openEnds =
(fwdOpen?1:0)
+
(bwdOpen?1:0)

let key =
Math.min(cnt,5)


if(openEnds === 2){

totalScore +=
SCORE_OPEN[key] || 0

}
else if(openEnds === 1){

totalScore +=
SCORE_HALF[key] || 0

}

// openEnds == 0 → 0점

}

return totalScore

}



// ─────────────────────────────
// 전체 보드 평가
// eval_board()
// ─────────────────────────────

export function evalBoard(board){

let aiScore = 0
let plScore = 0


for(let r=0;r<board.length;r++){
for(let c=0;c<board[r].length;c++){

if(board[r][c] === AI){

aiScore +=
scorePos(board,r,c,AI)

}

else if(board[r][c] === PLAYER){

plScore +=
scorePos(board,r,c,PLAYER)

}

}
}


return aiScore - plScore

}
