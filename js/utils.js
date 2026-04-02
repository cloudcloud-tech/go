import {
BOARD_SIZE,
PLAYER,
AI,
EMPTY,
DIRS
} from "./constants.js"


// ─────────────────────────────
// 범위 체크
// ─────────────────────────────

export function inBounds(r, c){

return (
r >= 0 &&
c >= 0 &&
r < BOARD_SIZE &&
c < BOARD_SIZE
)

}


// ─────────────────────────────
// 한 방향 돌 개수
// ─────────────────────────────

export function countDir(
board,
r,
c,
dr,
dc,
who
){

let cnt = 0

let nr = r + dr
let nc = c + dc

while(
inBounds(nr,nc) &&
board[nr][nc] === who
){

cnt++

nr += dr
nc += dc

}

return cnt

}


// ─────────────────────────────
// 승리 체크
// ─────────────────────────────

export function checkWin(
board,
r,
c,
who
){

for(let [dr,dc] of DIRS){

let total =
1
+
countDir(board,r,c,dr,dc,who)
+
countDir(board,r,c,-dr,-dc,who)

if(who === PLAYER){

// 흑: 정확히 5목

if(total === 5)
return true

}else{

// 백: 5 이상

if(total >= 5)
return true

}

}

return false

}


// ─────────────────────────────
// 후보 위치 찾기
// ─────────────────────────────

export function getCandidates(
board,
radius = 2
){

let visited = new Set()

let result = []

for(let r=0;r<BOARD_SIZE;r++){
for(let c=0;c<BOARD_SIZE;c++){

if(board[r][c] !== EMPTY){

for(let dr=-radius;dr<=radius;dr++){
for(let dc=-radius;dc<=radius;dc++){

let nr = r + dr
let nc = c + dc

if(
inBounds(nr,nc) &&
board[nr][nc] === EMPTY
){

let key = nr + "," + nc

if(!visited.has(key)){

visited.add(key)

result.push([nr,nc])

}

}

}
}

}

}
}

// 비어 있으면 중앙

if(result.length === 0){

let mid =
Math.floor(BOARD_SIZE/2)

result.push([mid,mid])

}

return result

}
