import { GameState } from "./gamestate";

export class SubcardBuilder {
  private _subcard: string = '';
  private _gameState: GameState;

  public constructor(gameState: GameState) {
    this._gameState = gameState;
  }

  public AddUpgrade(cardID: string, owner: number, isPilot: boolean = false, epicAction: boolean = false) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    this._subcard += `${cardID},${owner},${isPilot ? "1" : "0"},${this._gameState.GetNextUniqueID()},${epicAction ? "1" : "0"},0,0,0`;

    return this;
  }

  public AddShield(owner: number, number: number = 1) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    for(let i = 0; i < number; ++i) {
      this._subcard += `8752877738,${owner},0,${this._gameState.GetNextUniqueID()},0,0,0,0`;
      if(i < number - 1) {
        this._subcard += ',';
      }
    }

    return this;
  }

  public AddExperience(owner: number, number: number = 1) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    for(let i = 0; i < number; ++i) {
      this._subcard += `2007868442,${owner},0,${this._gameState.GetNextUniqueID()},0,0,0,0`;
      if(i < number - 1) {
        this._subcard += ',';
      }
    }

    return this;
  }

  public AddCaptive(cardID: string, owner: number) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    this._subcard += `${cardID},${owner},0,${this._gameState.GetNextUniqueID()},0,0,0,0`;

    return this;
  }

  public AddPilot(cardID: string, owner: number, epicAction: boolean = false) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    this._subcard += `${cardID},${owner},1,${this._gameState.GetNextUniqueID()},${epicAction ? "1" : "0"},0,0,0`;

    return this;
  }

  public Build() {
    const result = this._subcard;
    this._subcard = '';

    return result;
  }
}