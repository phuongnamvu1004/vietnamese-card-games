import { Card }  from "../game/shared/cards";

type Player = {
  id: string,
  socketId: string,
  hand: Card[],
  buyIn: number,
  gameBalance: number,
  state: "instantWin" | "waitingForTurn" | "inTurn"
}

type CurrentGameState = {
  players: string[],
  deck: Card[],
  pile: Card[],
  currentTurn: string,
  phase: "waiting" | "playing" | "finish",
  instantWinPlayers: string[]
}