// core/player.ts
import { Card } from "../cards";

export enum PlayerType {
  Human,
  Bot
}

export abstract class Player {
  protected hand: Card[];
  protected name: string;
  protected type: PlayerType;

  constructor(name: string, type: PlayerType, initialHand: Card[] = []) {
    this.name = name;
    this.type = type;
    this.hand = initialHand;
  }

  public getName(): string {
    return this.name;
  }

  public getHand(): Card[] {
    return this.hand;
  }

  public addCard(card: Card): void {
    this.hand.push(card);
  }

  public removeCard(cardIndex: number): Card | undefined {
    if (cardIndex >= 0 && cardIndex < this.hand.length) {
      return this.hand.splice(cardIndex, 1)[0];
    }
    return undefined;
  }

  public isHuman(): boolean {
    return this.type === PlayerType.Human;
  }

  public isBot(): boolean {
    return this.type === PlayerType.Bot;
  }

  public abstract canPlayCard(card: Card): boolean;
  public abstract getValidMoves(): any[];
}