import {
aiEasy,
aiMedium,
aiStrong,
aiStrongest
} from "./minimax.js"

import {
aiMCTS
} from "./mcts.js"


// ─────────────────────────────
// Beginner (완전 랜덤)
// ─────────────────────────────

function aiBeginner(board){

let empty=[]

for(let r=0;r<board.length;r++){
for(let c=0;c<board[r].length;c++){

if(board[r][c]===0){

empty.push([r,c])

}

}
}


if(empty.length===0)
return null


return empty[
Math.floor(
Math.random()*empty.length
)
]

}



// ─────────────────────────────
// 난이도 선택
// ─────────────────────────────

export function getAIMove(
board,
difficulty
){

switch(difficulty){

case "beginner":
return aiBeginner(board)


case "easy":
return aiEasy(board)


case "medium":
return aiMedium(board)


case "hard":
return aiStrong(board)


case "strong":
return aiStrongest(board)


case "mcts":
return aiMCTS(board)


default:
return aiMedium(board)

}

}
