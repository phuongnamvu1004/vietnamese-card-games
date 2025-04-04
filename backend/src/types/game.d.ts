import { Card } from "../game/shared/cards";

type Player = {
  id: string,
  socketId: string,
  hand: Card[],
  buyIn: number,
  gameBalance: number,
  state: "instantWin" | "waitingForTurn" | "inTurn"
}

type CurrentGameState = {
  players: Player[],
  deck: Card[],
  pile: Card[],
  currentTurn: string,
  lastPlayed: Card[],
  gameType: "sam" | "phom",
  phase: "waiting" | "playing" | "finish",
  instantWinPlayers: string[]
}

type GameLog = {
  playerId: string,
  action: "draw" | "play" | "discard" | "instantWin",
  card: Card,
  createdAt: Date
}