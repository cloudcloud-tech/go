import {
PLAYER,
AI,
EMPTY,
MAX_CANDIDATES
} from "./constants.js"

import {
getCandidates,
checkWin
} from "./utils.js"

import {
scorePos,
evalBoard
} from "./evaluation.js"

import {
isForbidden
} from "./renju.js"


// ─────────────────────────────
// 후보 정렬
// Python best_cands()
// ─────────────────────────────

function bestCandidates(
board,
who,
topK
){

let opp =
who === AI
? PLAYER
: AI

let cands =
getCandidates(board)


// PLAYER일 때 금수 제거

if(who === PLAYER){

cands =
cands.filter(
([r,c]) =>
!isForbidden(board,r,c)
)

if(cands.length === 0){

cands =
getCandidates(board)

}

}


// 점수 정렬

cands.sort(
(a,b)=>{

let [ar,ac]=a
let [br,bc]=b

let sa =
scorePos(board,ar,ac,who)
+
scorePos(board,ar,ac,opp)

let sb =
scorePos(board,br,bc,who)
+
scorePos(board,br,bc,opp)

return sb - sa

}
)

return cands.slice(0,topK)

}


// ─────────────────────────────
// Minimax 본체
// ─────────────────────────────

function minimax(

board,
depth,
alpha,
beta,
isMax,
lastMove

){

if(lastMove){

let [lr,lc,lastWho] =
lastMove

if(
checkWin(
board,
lr,
lc,
lastWho
)
){

return {

value:
lastWho === AI
? 50000000
: -50000000

}

}

}


if(depth === 0){

return {
value: evalBoard(board)
}

}


let who =
isMax ? AI : PLAYER

let cands =
bestCandidates(
board,
who,
MAX_CANDIDATES
)

if(cands.length === 0){

return {
value: evalBoard(board)
}

}


let bestMove =
cands[0]


if(isMax){

let bestVal =
-Infinity

for(let [r,c] of cands){

board[r][c] = who

let result =
minimax(
board,
depth-1,
alpha,
beta,
false,
[r,c,who]
)

board[r][c] = EMPTY


if(result.value > bestVal){

bestVal = result.value
bestMove = [r,c]

}

alpha =
Math.max(alpha,bestVal)

if(beta <= alpha)
break

}

return {
value: bestVal,
move: bestMove
}

}


else{

let bestVal =
Infinity

for(let [r,c] of cands){

board[r][c] = who

let result =
minimax(
board,
depth-1,
alpha,
beta,
true,
[r,c,who]
)

board[r][c] = EMPTY


if(result.value < bestVal){

bestVal = result.value
bestMove = [r,c]

}

beta =
Math.min(beta,bestVal)

if(beta <= alpha)
break

}

return {
value: bestVal,
move: bestMove
}

}

}



// ─────────────────────────────
// 외부 호출 함수
// ─────────────────────────────

export function aiMinimax(
board,
depth
){

let result =
minimax(
board,
depth,
-Infinity,
Infinity,
true,
null
)

return result.move

}


// ─────────────────────────────
// 난이도별 AI
// ─────────────────────────────

export function aiEasy(board){

return aiMinimax(
board,
2
)

}


export function aiMedium(board){

return aiMinimax(
board,
3
)

}


export function aiStrong(board){

return aiMinimax(
board,
4
)

}


export function aiStrongest(board){

return aiMinimax(
board,
5
)

}
