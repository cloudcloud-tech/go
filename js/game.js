import {
BOARD_SIZE,
PLAYER,
AI,
EMPTY
} from "./constants.js"

import {
checkWin
} from "./utils.js"

import {
isForbidden
} from "./renju.js"

import {
getAIMove
} from "./ai.js"


// ─────────────────────────────
// 상태 변수
// ─────────────────────────────

let board=[]
let currentPlayer=PLAYER
let gameOver=false

let difficulty="medium"


// HTML 요소

let canvas
let ctx

let cellSize


// ─────────────────────────────
// 보드 초기화
// ─────────────────────────────

export function initGame(){

canvas=document.getElementById("board")
ctx=canvas.getContext("2d")

cellSize=
canvas.width/BOARD_SIZE


// 보드 생성

board=[]

for(let r=0;r<BOARD_SIZE;r++){

let row=[]

for(let c=0;c<BOARD_SIZE;c++){

row.push(EMPTY)

}

board.push(row)

}


currentPlayer=PLAYER
gameOver=false


drawBoard()

canvas.addEventListener(
"click",
handleClick
)

}



// ─────────────────────────────
// 보드 그리기
// ─────────────────────────────

function drawBoard(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
)


// 격자

for(let i=0;i<BOARD_SIZE;i++){

ctx.beginPath()

ctx.moveTo(
i*cellSize,
0
)

ctx.lineTo(
i*cellSize,
canvas.height
)

ctx.stroke()


ctx.beginPath()

ctx.moveTo(
0,
i*cellSize
)

ctx.lineTo(
canvas.width,
i*cellSize
)

ctx.stroke()

}


// 돌 그리기

for(let r=0;r<BOARD_SIZE;r++){
for(let c=0;c<BOARD_SIZE;c++){

if(board[r][c]===PLAYER){

drawStone(r,c,"black")

}

else if(board[r][c]===AI){

drawStone(r,c,"white")

}

}
}

}



// ─────────────────────────────
// 돌 그리기
// ─────────────────────────────

function drawStone(r,c,color){

ctx.beginPath()

ctx.arc(
c*cellSize + cellSize/2,
r*cellSize + cellSize/2,
cellSize/2 - 2,
0,
Math.PI*2
)

ctx.fillStyle=color
ctx.fill()

ctx.stroke()

}



// ─────────────────────────────
// 클릭 처리
// ─────────────────────────────

function handleClick(e){

if(gameOver)
return

if(currentPlayer!==PLAYER)
return


let rect=
canvas.getBoundingClientRect()

let x=
e.clientX - rect.left

let y=
e.clientY - rect.top

let c=
Math.floor(x/cellSize)

let r=
Math.floor(y/cellSize)


placeStone(r,c)

}



// ─────────────────────────────
// 돌 놓기
// ─────────────────────────────

function placeStone(r,c){

if(gameOver)
return

if(board[r][c]!==EMPTY)
return


// 금수 체크

let forbidden =
isForbidden(board,r,c)

if(forbidden){

alert(forbidden)
return

}


// 돌 배치

board[r][c]=currentPlayer

drawBoard()


// 승리 체크

if(
checkWin(
board,
r,
c,
currentPlayer
)
){

gameOver=true

alert(
currentPlayer===PLAYER
?"플레이어 승리!"
:"AI 승리!"
)

return

}


// 턴 변경

currentPlayer=
currentPlayer===PLAYER
? AI
: PLAYER


// AI 턴

if(
!gameOver &&
currentPlayer===AI
){

setTimeout(aiTurn,200)

}

}



// ─────────────────────────────
// AI 턴
// ─────────────────────────────

function aiTurn(){

let move =
getAIMove(
board,
difficulty
)

if(!move)
return

let [r,c]=move

board[r][c]=AI

drawBoard()


if(
checkWin(
board,
r,
c,
AI
)
){

gameOver=true

alert("AI 승리!")

return

}


currentPlayer=PLAYER

}



// ─────────────────────────────
// 난이도 설정
// ─────────────────────────────

export function setDifficulty(level){

difficulty=level

}
