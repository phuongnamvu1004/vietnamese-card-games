import { Card } from "../game/shared/cards";

type Player = {
  id: string,
  socketId: string,
  hand: Card[],
  buyIn: number,
  gameBalance: number,
  state: "instantWin" | "waitingForTurn" | "inTurn"
}

type BaseGameState = {
  players: Player[],
  deck: Card[],
  pile: Card[],
  currentTurn: string,
  lastPlayed: Card[],
  phase: "waiting" | "playing" | "finish",
}

type SamGameState = BaseGameState & {
  nextPlayerStatus: "regular" | "mustBeat",
  instantWinPlayers: string[]
}

type PhomGameState = BaseGameState & {
  gameType: "phom",
  phomSpecificField: any // Replace with real fields for phom
}

type CurrentGameState = SamGameState | PhomGameState;


type GameLog = {
  playerId: string,
  action: "draw" | "play" | "discard" | "instantWin",
  card: Card,
  createdAt: Date
}