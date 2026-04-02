import {
PLAYER,
AI,
EMPTY,
BOARD_SIZE,
DIRS,
MCTS_SIMULATIONS
} from "./constants.js"

import {
getCandidates,
checkWin,
inBounds
} from "./utils.js"

import {
evalBoard
} from "./evaluation.js"

import {
isForbidden
} from "./renju.js"


// ─────────────────────────────
// MCTS Node
// ─────────────────────────────

class MCTSNode {

constructor(
board,
move=null,
parent=null,
nextPlayer=AI
){

this.board = board
this.move = move
this.parent = parent
this.nextPlayer = nextPlayer

this.children = []

this.wins = 0
this.visits = 0


// 후보 생성

let allCands =
getCandidates(board,1)

let filtered=[]

for(let [r,c] of allCands){

if(
nextPlayer===PLAYER &&
isForbidden(board,r,c)
) continue

filtered.push([r,c])

}

// 셔플

filtered.sort(()=>Math.random()-0.5)

// 최대 12개

this.untried =
filtered.slice(0,12)

}


// ─────────────────────

isTerminal(){

if(this.move===null)
return false

let lastPlayer =
this.nextPlayer===AI
? PLAYER
: AI

let [r,c]=this.move

return checkWin(
this.board,
r,
c,
lastPlayer
)

}


// ─────────────────────

ucb1(c=0.6){

if(this.visits===0)
return Infinity

let winRate =
this.wins/this.visits

if(
this.parent &&
this.parent.nextPlayer===PLAYER
){

winRate =
1 - winRate

}

let explore =
c *
Math.sqrt(
Math.log(this.parent.visits)
/
this.visits
)

return winRate + explore

}


// ─────────────────────

expand(){

let move =
this.untried.pop()

let newBoard =
this.board.map(r=>r.slice())

newBoard[
move[0]
][
move[1]
]=this.nextPlayer

let nextP =
this.nextPlayer===AI
? PLAYER
: AI

let child =
new MCTSNode(
newBoard,
move,
this,
nextP
)

this.children.push(child)

return child

}


// ─────────────────────

rollout(){

let board =
this.board.map(r=>r.slice())

let curr =
this.nextPlayer

let candSet=new Set()


for(let r=0;r<BOARD_SIZE;r++){
for(let c=0;c<BOARD_SIZE;c++){

if(board[r][c]!==EMPTY){

for(let dr=-1;dr<=1;dr++){
for(let dc=-1;dc<=1;dc++){

let nr=r+dr
let nc=c+dc

if(
inBounds(nr,nc) &&
board[nr][nc]===EMPTY
){

candSet.add(nr+","+nc)

}

}
}

}

}
}


if(candSet.size===0){

let mid=
Math.floor(BOARD_SIZE/2)

candSet.add(mid+","+mid)

}


for(let step=0;step<20;step++){

let cands =
Array.from(candSet)
.map(s=>s.split(",").map(Number))

if(cands.length===0)
break


// 즉시 승리

for(let [r,c] of cands){

board[r][c]=curr

if(
checkWin(board,r,c,curr)
){

return curr===AI?1:0

}

board[r][c]=EMPTY

}


// 상대 차단

let opp=
curr===AI
? PLAYER
: AI

let move=null

for(let [r,c] of cands){

board[r][c]=opp

if(
checkWin(board,r,c,opp)
){

board[r][c]=EMPTY
move=[r,c]
break

}

board[r][c]=EMPTY

}


// 무작위

if(!move){

move =
cands[
Math.floor(
Math.random()*cands.length
)
]

}


// 배치

board[
move[0]
][
move[1]
]=curr


candSet.delete(
move[0]+","+move[1]
)


for(let dr=-1;dr<=1;dr++){
for(let dc=-1;dc<=1;dc++){

let nr=move[0]+dr
let nc=move[1]+dc

if(
inBounds(nr,nc) &&
board[nr][nc]===EMPTY
){

candSet.add(nr+","+nc)

}

}
}


curr = opp

}


// 미종료

return 0.5

}


// ─────────────────────

backpropagate(result){

this.visits++

this.wins+=result

if(this.parent){

this.parent.backpropagate(result)

}

}

}


// ─────────────────────────────
// MCTS 실행
// ─────────────────────────────

export function aiMCTS(
board,
simulations=MCTS_SIMULATIONS
){

let root =
new MCTSNode(
board.map(r=>r.slice()),
null,
null,
AI
)


for(let i=0;i<simulations;i++){

let node=root


// Selection

while(
!node.isTerminal() &&
node.untried.length===0 &&
node.children.length>0
){

node =
node.children.reduce(
(a,b)=>
a.ucb1()>b.ucb1()
?a:b
)

}


// Expansion

if(
!node.isTerminal() &&
node.untried.length>0
){

node=node.expand()

}


// Simulation

let result

if(node.isTerminal()){

let lastP =
node.nextPlayer===AI
? PLAYER
: AI

result =
lastP===AI?1:0

}
else{

result =
node.rollout()

}


// Backpropagation

node.backpropagate(result)

}


// 가장 많이 방문

if(root.children.length===0){

let cands =
getCandidates(board)

return cands[
Math.floor(
Math.random()*cands.length
)
]

}


return root.children.reduce(
(a,b)=>
a.visits>b.visits
?a:b
).move

}
