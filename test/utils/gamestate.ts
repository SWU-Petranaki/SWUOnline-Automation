import fsp from 'fs/promises';
import { NightwatchAPI } from 'nightwatch';

import {
  g
} from './util';

class SubcardBuilder {
  private _subcard: string = '';
  private _gameState: GameState;

  public constructor(gameState: GameState) {
    this._gameState = gameState;
  }

  public AddUpgrade(cardID: string, owner: number, isPilot: boolean = false) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    this._subcard += `${cardID},${owner},${isPilot ? "1" : "0"},${this._gameState.GetNextUniqueID()}`;

    return this;
  }

  public AddShield(owner: number, number: number = 1) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    for(let i = 0; i < number; ++i) {
      this._subcard += `8752877738,${owner},0,${this._gameState.GetNextUniqueID()}`;
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
      this._subcard += `2007868442,${owner},0,${this._gameState.GetNextUniqueID()}`;
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
    this._subcard += `${cardID},${owner},0,${this._gameState.GetNextUniqueID()}`;

    return this;
  }

  public AddPilot(cardID: string, owner: number) {
    if(this._subcard !== '') {
      this._subcard += ',';
    }
    this._subcard += `${cardID},${owner},1,${this._gameState.GetNextUniqueID()}`;

    return this;
  }

  public Build() {
    const result = this._subcard;
    this._subcard = '';

    return result;
  }
}

export class GameState {
  private _subcardBuilder: SubcardBuilder = new SubcardBuilder(this);

  private _gameName: string = '';
  private _gameState: string[] = [];
  private _uniqueIdCounter: number = 0;

  public constructor(gameName: string) {
    if(gameName === '') {
      throw new Error('Game name cannot be empty.');
    }
    this._gameName = gameName;
    this._uniqueIdCounter = 1;
  }

  public SubcardBuilder() {
    return this._subcardBuilder;
  }

  public async LoadGameStateLinesAsync() {
    const data = await fsp.readFile(`${process.env.SWUONLINE_ROOT_PATH || '../SWUOnline'}/Games/${this._gameName}/gamestate.txt`, 'ascii');
    this._gameState = data.split('\r\n');
  }

  public async FlushAsync(cb?: Function) {
    await fsp.writeFile(`${process.env.SWUONLINE_ROOT_PATH || '../SWUOnline'}/Games/${this._gameName}/gamestate.txt`, this._gameState.join('\r\n'), 'ascii');

    if (cb) cb();
  }

  public ResetGameStateLines() {
    this._gameState[g.BaseHealths] = "0 0";
    this._gameState[g.P1Hand] = "";
    this._gameState[g.P1Deck] = "";
    this._gameState[g.P1CharArray] = "";
    this._gameState[g.P1ResourcesState] = "0 0";
    this._gameState[g.P1ResourcesArray] = "";
    this._gameState[g.P1Discard] = "";
    this._gameState[g.P1ClassState] = "0 0 0 0 0 0 0 0 DOWN 0 -1 0 0 0 0 0 0 -1 0 0 0 0 NA 0 0 0 - -1 0 0 0 0 0 0 - 0 0 0 0 0 0 0 0 - - 0 -1 0 0 0 0 0 - 0 0 0 0 0 -1 0 - 0 0 - 0 0 0 - -1 0 0 -";
    this._gameState[g.P1CharDisplay] = "";
    this._gameState[g.P1CardStats] = "";
    this._gameState[g.P1TurnStats] = "0 0 0 0 0 0 0 0 0 0 0 0";
    this._gameState[g.P1AlliesArray] = "";
    this._gameState[g.P1Settings] = "0 1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 4 0 0 0 0 0";
    this._gameState[g.P2Hand] = "";
    this._gameState[g.P2Deck] = "";
    this._gameState[g.P2CharArray] = "";
    this._gameState[g.P2ResourcesState] = "0 0";
    this._gameState[g.P2ResourcesArray] = "";
    this._gameState[g.P2Discard] = "";
    this._gameState[g.P2ClassState] = "0 0 0 0 0 0 0 0 DOWN 0 -1 0 0 0 0 0 0 -1 0 0 0 0 NA 0 0 0 - -1 0 0 0 0 0 0 - 0 0 0 0 0 0 0 0 - - 0 -1 0 0 0 0 0 - 0 0 0 0 0 -1 0 - 0 0 - 0 0 0 - -1 0 0 -";
    this._gameState[g.P2CharDisplay] = "";
    this._gameState[g.P2CardStats] = "";
    this._gameState[g.P2TurnStats] = "0 0 0 0 0 0 0 0 0 0 0 0";
    this._gameState[g.P2AlliesArray] = "";
    this._gameState[g.P2Settings] = "0 1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 4 0 0 0 0 0";
    this._gameState[g.Winner] = "0";
    this._gameState[g.FirstPlayer] = "1";
    this._gameState[g.CurrentPlayer] = "1";
    this._gameState[g.CurrentRound] = "1";
    this._gameState[g.Turn] = "M 1";
    this._gameState[g.CombatChain] = "";
    this._gameState[g.CombatChainState] = "0 -1 0 0 0 0 0 GY NA 0 0 0 0 0 0 0 NA 0 0 -1 -1 NA 0 0 0 -1 0 0 0 0 - 0 0 0 0 0 NA -";
    this._gameState[g.CurrentTurnEffects] = "";
    this._gameState[g.CurrentTurnEffectsFromCombat] = "";
    this._gameState[g.NextTurnEffects] = "";
    this._gameState[g.DecisionQueue] = "";
    this._gameState[g.DqVars] = "";
    this._gameState[g.DqState] = "0 M 1 - - - 0 0 -1";
    this._gameState[g.Layers] = "";
    this._gameState[g.LayerPriority] = "0 0";
    this._gameState[g.MainPlayer] = "1";
    this._gameState[g.LastPlayed] = "";
    this._gameState[g.ChainLink] = "0";
    this._gameState[g.ChainLinkSummary] = "";
    this._gameState[g.UniqueIDCounter] = "200";
    this._gameState[g.InGameStatus] = "1";
    this._gameState[g.InitiativePlayer] = "1";
    this._gameState[g.InitiativeTaken] = "0";

    return this;
  }

  public AddBase(player: number, cardID: string) {
    this._gameState[player === 1 ? g.P1CharArray : g.P2CharArray] = `${cardID} 2 0 0 0 1 0 0 0 2 0`;
    this._gameState[player === 1 ? g.P1CharDisplay : g.P2CharDisplay] = cardID;

    return this;
  }

  public AddLeader(player: number, cardID: string, deployed: boolean = false, exhaustedLeaderSide: boolean = false) {
    if(!deployed) {
      this._gameState[player === 1 ? g.P1CharArray : g.P2CharArray] += ` ${cardID} ${exhaustedLeaderSide ? "1" : "2"} 0 0 0 1 0 0 0 2 0`;
    }

    this._gameState[player === 1 ? g.P1CharDisplay : g.P2CharDisplay] += (' ' + cardID);

    return this;
  }

  public AddCardToHand(player: number, cardID: string) {
    const index = player === 1 ? g.P1Hand : g.P2Hand;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
    }
    this._gameState[index] += cardID;

    return this;
  }

  public AddCardToDeck(player: number, cardID: string, times: number = 1) {
    const index = player === 1 ? g.P1Deck : g.P2Deck;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
    }
    for(let i = 0; i < times; ++i) {
      this._gameState[index] += cardID;
      if(i < times - 1) {
        this._gameState[index] += ' ';
      }
    }

    return this;
  }

  public AddCardToDiscard(player: number, cardID: string, from: string = 'PLAY', roundDiscarded: number = 0, modififer = '-', times: number = 1) {
    const index = player === 1 ? g.P1Discard : g.P2Discard;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
      for(let i = 0; i < times; ++i) {
        this._gameState[index] += `${cardID} ${modififer} ${from} ${roundDiscarded}`;
        if(i < times - 1) {
          this._gameState[index] += ' ';
        }
      }

      return this;
    }
  }

  public AddResource(player: number, cardID: string, ready: boolean = true, stealSource: number = -1) {
    const index = player === 1 ? g.P1ResourcesArray : g.P2ResourcesArray;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
    }
    this._gameState[index] += `${cardID} DOWN 1 0 ${ready ? "0" : "1"} ${this._uniqueIdCounter++} ${stealSource}`;

    return this;
  }

  public FillResources(player: number, cardID: string, times: number) {
    const index = player === 1 ? g.P1ResourcesArray : g.P2ResourcesArray;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
    }
    for(let i = 0; i < times; ++i) {
      this._gameState[index] += `${cardID} DOWN 1 0 0 ${this._uniqueIdCounter++} -1`;
      if(i < times - 1) {
        this._gameState[index] += ' ';
      }
    }

    return this;
  }

  public AddUnit(player: number, cardID: string, ready: boolean = true,
      damage: number = 0, subcards = "-", owner = player, carbonite = false, numUses = 1,
      turnsInPlay = 0, numAttacks = 0, cloned = false, healed = false, arenaOverride = "NA")
  {
    const index = player === 1 ? g.P1AlliesArray : g.P2AlliesArray;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
    }
    this._gameState[index] += (
      `${cardID} ${ready ? "2" : "1"} ${damage} ${carbonite ? "1" : "0"} ${subcards} ${this._uniqueIdCounter++} 0 0 `
      + `${numUses} 0 ${numAttacks} ${owner} ${turnsInPlay} ${cloned ? "1" : "0"} ${healed ? "1" : "0"} ${arenaOverride} 0`
    );

    return this;
  }

  public SetClassStatePiece(player: number, piece: number, value: string) {
    const index = player === 1 ? g.P1ClassState : g.P2ClassState;
    const pieces = this._gameState[index].split(' ');
    pieces[piece] = value;
    this._gameState[index] = pieces.join(' ');

    return this;
  }

  public SetBasesDamage(damage: string) {
    if(damage.split(' ').length !== 2) {
      throw new Error('Damage must be in the format "N N"');
    }
    this._gameState[g.BaseHealths] = damage;

    return this;
  }

  public GetTopDeck(player: number, position: number = 1) {
    return this._gameState[player === 1 ? g.P1Deck : g.P2Deck].split(' ')[position - 1];
  }

  public GetBottomDeck(player: number, position: number = 1) {
    const deck = this._gameState[player === 1 ? g.P1Deck : g.P2Deck].split(' ');
    return deck[deck.length - position];
  }

  public GetNextUniqueID() {
    return this._uniqueIdCounter++;
  }

  public GetAuthKey(player: number) {
    return this._gameState[player === 1 ? g.P1AuthKey : g.P2AuthKey];
  }

  public SetAuthKey(player: number, authKey: string) {
    this._gameState[player === 1 ? g.P1AuthKey : g.P2AuthKey] = authKey;

    return this;
  }
}