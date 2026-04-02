// ─────────────────────────────
// 게임 기본 설정
// ─────────────────────────────

export const BOARD_SIZE = 15

export const CELL_SIZE = 40
export const MARGIN = 30

export const STONE_RADIUS = 16

// 플레이어 정의

export const PLAYER = 1   // 검정 (사람)
export const AI     = 2   // 흰색 (AI)
export const EMPTY  = 0


// 방향 벡터

export const DIRS = [

[0,1],
[1,0],
[1,1],
[1,-1]

]

// ─────────────────────────────
// 렌주 점수 테이블
// ─────────────────────────────

export const SCORE_OPEN = {

1: 15,
2: 400,
3: 15000,
4: 500000,
5: 5000000

}

export const SCORE_HALF = {

1: 5,
2: 80,
3: 800,
4: 80000,
5: 5000000

}


// ─────────────────────────────
// AI 설정
// ─────────────────────────────

export const MAX_CANDIDATES = 12

export const DEFAULT_RADIUS = 2

export const MCTS_SIMULATIONS = 2000


// ─────────────────────────────
// Canvas 크기 계산
// ─────────────────────────────

export const CANVAS_SIZE =

MARGIN * 2
+
CELL_SIZE * (BOARD_SIZE - 1)


// ─────────────────────────────
// 난이도 정의
// ─────────────────────────────

export const DIFFICULTY = {

BEGINNER: "① 입문",
EASY:     "② 쉬움",
MEDIUM:   "③ 보통",
HARD:     "④ 어려움",
STRONG:   "⑤ 매우 어려움",
TOP:      "⑥ 최상",
ULTRA:    "⑦ 찐찐막"

}
