import fsp from 'fs/promises';
import fs from 'fs';
import {
  cs,
  g,
  lt
} from './util';
import { SubcardBuilder } from './subcardbuilder';

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

  public static GameExists(game: string) {
    return fs.existsSync(`${process.env.SWUONLINE_ROOT_PATH || '../SWUOnline'}/Games/${game}/gamestate.txt`);
  }

  public SubcardBuilder() {
    return this._subcardBuilder;
  }

  public async LoadGameStateLinesAsync() {
    const data = await fsp.readFile(`${process.env.SWUONLINE_ROOT_PATH || '../SWUOnline'}/Games/${this._gameName}/gamestate.txt`, 'ascii');
    this._gameState = data.split('\r\n');
  }

  public async WriteBeginTurnAsync() {
    await fsp.writeFile(`${process.env.SWUONLINE_ROOT_PATH || '../SWUOnline'}/Games/${this._gameName}/beginTurnGamestate.txt`, this._gameState.join('\r\n'), 'ascii');
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
    this._gameState[g.P1ClassState] = this.NewClassState();
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
    this._gameState[g.P2ClassState] = this.NewClassState();
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

  NewClassState() {
    const arr:string[] = [];
    arr[cs.NumVillainyPlayed] = '0';
    arr[cs.PlayedAsUpgrade] = '0';
    arr[cs.AtksWWeapon] = '0';
    arr[cs.NumNonTokenVehicleAttacks] = '0';
    arr[cs.DamagePrevention] = '0';
    arr[cs.CardsDrawn] = '0';
    arr[cs.DamageTaken] = '0';
    arr[cs.NumActionsPlayed] = '0';
    arr[8] = '0';
    arr[cs.CharacterIndex] = '0';
    arr[cs.PlayIndex] = '-1';
    arr[cs.NumNonAttackCards] = '0';
    arr[cs.CachedCharacterLevel] = '0';
    arr[cs.PreparationCounters] = '0';
    arr[cs.NextNAACardGoAgain] = '0';
    arr[cs.NumAlliesDestroyed] = '0';
    arr[cs.NumWhenDefeatedPlayed] = '0';
    arr[cs.ResolvingLayerUniqueID] = '-1';
    arr[cs.NumCreaturesPlayed] = '0';
    arr[cs.ArcaneDamageTaken] = '0';
    arr[cs.NextNAAInstant] = '0';
    arr[cs.NextDamagePrevented] = '0';
    arr[cs.LastAttack] = "NA";
    arr[cs.NumLeftPlay] = '0';
    arr[cs.NumUsesLeaderUpgrade1] = '1';
    arr[cs.NumUsesLeaderUpgrade2] = '1';
    arr[cs.AfterPlayedBy] = "-";
    arr[cs.PlayCCIndex] = '-1';
    arr[cs.NumAttackCards] = '0';
    arr[cs.NumPlayedFromBanish] = '0';
    arr[cs.NumAttacks] = '0';
    arr[cs.DieRoll] = '0';
    arr[cs.NumMandalorianAttacks] = '0';
    arr[cs.SeparatistUnitsThatAttacked] = "-";
    arr[cs.NumFighterAttacks] = '0';
    arr[cs.LayerTarget] = "-";
    arr[cs.NumSwordAttacks] = '0';
    arr[cs.HitsWithWeapon] = '0';
    arr[cs.ArcaneDamagePrevention] = '0';
    arr[cs.DynCostResolved] = '0';
    arr[cs.CardsEnteredGY] = '0';
    arr[cs.HighestRoll] = '0';
    arr[cs.NumMelodyPlayed] = '0';
    arr[cs.NumAuras] = '0';
    arr[cs.AbilityIndex] = "-";
    arr[cs.AdditionalCosts] = "-";
    arr[cs.NumRedPlayed] = '0';
    arr[cs.PlayUniqueID] = '-1';
    arr[cs.NumPhantasmAADestroyed] = '0';
    arr[cs.NumEventsPlayed] = '0';
    arr[cs.AlluvionUsed] = '0';
    arr[cs.MaxQuellUsed] = '0';
    arr[cs.DamageDealt] = '0';
    arr[cs.ArcaneTargetsSelected] = "-";
    arr[cs.NumDragonAttacks] = '0';
    arr[cs.NumIllusionistAttacks] = '0';
    arr[cs.LastDynCost] = '0';
    arr[cs.NumIllusionistActionCardAttacks] = '0';
    arr[cs.ArcaneDamageDealt] = '0';
    arr[cs.LayerPlayIndex] = '-1';
    arr[cs.NumCardsPlayed] = '0';
    arr[cs.NamesOfCardsPlayed] = "-";
    arr[cs.NumFirstOrderPlayed] = '0';
    arr[cs.PlayedAsInstant] = '0';
    arr[cs.CachedLeader1EpicAction] = "0";
    arr[cs.CachedLeader2EpicAction] = "0";
    arr[cs.HitsWithSword] = '0';
    arr[cs.NumClonesPlayed] = '0';
    arr[cs.UnitsThatAttackedBase] = "-";
    arr[cs.OppIndex] = '-1';
    arr[cs.OppCardActive] = '0';
    arr[cs.PlayedWithExploit] = '0';
    arr[cs.AlliesDestroyed] = "-";
    arr[cs.NumBountyHuntersPlayed] = '0';
    arr[cs.NumPilotsPlayed] = '0';

    return arr.join(' ');
  }

  public AddBase(player: number, cardID: string, epicActionUsed: boolean = false, theForceIsWithYou: boolean = false) {
    const uniqueId = `P${player}BASE`;
    this._gameState[player === 1 ? g.P1CharArray : g.P2CharArray] = `${cardID} ${epicActionUsed ? 0 : 2} 0 ${uniqueId} ${theForceIsWithYou ? 1 : 0} 1 0 0 0 2 0`;
    this._gameState[player === 1 ? g.P1CharDisplay : g.P2CharDisplay] = cardID;

    return this;
  }

  public AddLeader(player: number, cardID: string, deployed: boolean = false, exhaustedLeaderSide: boolean = false) {
    if(!deployed) {
      const uniqueId = `P${player}LEADER`;
      this._gameState[player === 1 ? g.P1CharArray : g.P2CharArray] += ` ${cardID} ${exhaustedLeaderSide ? "1" : "2"} 0 ${uniqueId} 0 1 0 0 0 2 0`;
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
    }
    for(let i = 0; i < times; ++i) {
      this._gameState[index] += `${cardID} ${modififer} ${from} ${roundDiscarded}`;
      if(i < times - 1) {
        this._gameState[index] += ' ';
      }
    }

    return this;
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

  public AddUnit(player: number, cardID: string, epicAction: boolean = false, ready: boolean = true,
      damage: number = 0, subcards = "-", owner = player, carbonite = false, numUses = 1,
      turnsInPlay = 0, numAttacks = 0, cloned = false, healed = false, arenaOverride = "NA")
  {
    const index = player === 1 ? g.P1AlliesArray : g.P2AlliesArray;
    if(this._gameState[index] !== '') {
      this._gameState[index] += ' ';
    }
    this._gameState[index] += (
      `${cardID} ${ready ? "2" : "1"} ${damage} ${carbonite ? "1" : "0"} ${subcards} ${this._uniqueIdCounter++} 0 0 `
      + `${numUses} 0 ${numAttacks} ${owner} ${turnsInPlay} ${cloned ? "1" : "0"} ${healed ? "1" : "0"} ${arenaOverride} ${epicAction ? "1" : "0"}`
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

  public AddCurrentTurnEffect(cardID: string, player: number, uniqueId: string = "-", numUses: number = 1, lastingType: number = lt.Phase) {
    if(this._gameState[g.CurrentTurnEffects] !== '') {
      this._gameState[g.CurrentTurnEffects] += ' ';
    }
    this._gameState[g.CurrentTurnEffects] += `${cardID} ${player} ${uniqueId} ${numUses} ${lastingType}`;

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