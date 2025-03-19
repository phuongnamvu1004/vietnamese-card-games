// core/game.ts
import { Deck } from "../cards";
import { Player } from "./player";

export abstract class Game {
  protected deck: Deck;
  protected players: Player[];
  protected currentPlayerIndex: number;
  protected isGameOver: boolean;

  constructor(numPlayers: number) {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.deck = this.createDeck();
    this.initializePlayers(numPlayers);
  }

  protected abstract createDeck(): Deck;
  protected abstract initializePlayers(numPlayers: number): void;
  
  public abstract startGame(): void;
  public abstract playTurn(playerIndex: number, action: any): boolean;
  public abstract checkWinCondition(): Player | null;
  
  public getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  
  public nextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }
}