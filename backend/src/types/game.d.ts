import { Card } from "../game/shared/cards";

type Player = {
  id: number,
  socketId: string;
  name: string;
  hand: Card[];
  buyIn: number;
  gameBalance: number;
  mustBeat: boolean;
  state: "instantWin" | "waitingForTurn" | "inTurn";
};

type BaseGameState = {
  players: Player[];
  deck: Card[]; // Only needed for Phom
  currentTurn: string;
  lastPlayed: { socketId: string; cards: Card[] };
  betUnit: number; // The unit of a bet for the game, value per card for Sam and other rules for Phom
  phase: "waiting" | "playing" | "finish";
};

type SamGameState = BaseGameState & {
  gameType: "sam";
  instantWinPlayers: Player[]; // Replace it with real fields for sam
};

type PhomGameState = BaseGameState & {
  gameType: "phom";
  phomSpecificField: undefined; // Replace it with real fields for phom
};

type CurrentGameState = SamGameState | PhomGameState;

type GameLog = {
  playerId: string;
  action: "draw" | "play" | "discard" | "instantWin";
  card: Card;
  createdAt: Date;
};
