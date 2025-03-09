import {promises as fsp} from 'fs';
import { browser, NightwatchAPI } from 'nightwatch';
import { cards } from './cards';

export var player1Window = '';
export var player2Window = '';
export var gameName = '';

export function setPlayer1Window(window: string) {
  player1Window = window;
}
export function setPlayer2Window(window: string) {
  player2Window = window;
}

export function setGameName(name: string) {
  gameName = name;
}

export const com = {
    BeginTestCallback: async () => await browser.window.switchTo(player1Window).refresh(),
    LoginButton: 'div.nav-bar-user li:nth-of-type(2) a.NavBarItem',
    BugReportData: 'body > div:nth-of-type(2)',
    GameLog: 'div#gamelog',
    GameChat: 'input#chatText',
    DeckInput: 'input#fabdb',
    CreateGameButton: 'input.create-game-button',
    InviteLink: 'input.invite-link',
    JoinGameButton: 'input.JoinGame_Button',
    ReadyButton: 'input.GameLobby_Button[value="Ready"]',
    GoFirstButton: 'input.GameLobby_Button[value="Go First"]',
    StartButton: 'input.GameLobby_Button[value="Start"]',
    LobbySetupContent: 'div#setup-content p',
    MyHand: 'div#myHand',
    MyHandDivs: 'div#myHand span a',
    TheirHand: "div#theirHand",
    TheirHandDivs: "div#theirHand div",
    MyDiscard: 'div.my-discard',
    MyDiscardPopup: 'div#myDiscardPopup',
    MyDiscardCard(index: number) { return `div#myDiscardPopup div:nth-of-type(2) a:nth-of-type(${index}) img.cardImage`},
    MyDiscardCount: 'div.my-discard a div:nth-last-of-type(1)',
    MyDiscardEmpty: 'div.my-discard.my-discard-empty',
    TheirDiscardCount: 'div.their-discard a div:nth-last-of-type(1)',
    TheirDiscardEmpty: 'div.their-discard div.their-discard-empty',
    HandCard(index: number) { return `div#myHand span:nth-of-type(${index}) a`; },
    HandCardImg(index: number) { return `div#myHand span:nth-of-type(${index}) img`; },
    CheckboxPopup: 'div#MULTICHOOSE',
    Checkbox(index: number, table: number = 1) { return `table:nth-of-type(${table}) td:nth-of-type(${index}) > label`; },
    PassButton: 'span.pass-label',
    ClaimButton: 'button.claimButton',
    SubmitButton: 'input[type="button"]',
    MultiChoicePopup: 'div#BUTTONINPUT',
    YesNoButton(choice: "YES"|"NO") { return `div#mainDiv button:nth-of-type(${choice === "YES" ? 1 : 2})`; },
    PilotOrUnitButton(choice:"Pilot"|"Unit") { return `div#BUTTONINPUT div button:nth-of-type(${choice === "Pilot" ? 1 : 2})`; },
    ChooseButton(index: number, choice: number) { return `div > table > tbody > tr > td:nth-of-type(${index}) button:nth-of-type(${choice})`; },
    InHandTopBottom(index: number, choice: number) { return `div#HANDTOPBOTTOM > div > table tr:nth-of-type(2) td:nth-of-type(${index}) span:nth-of-type(${choice}) button`; },
    ButtonMultiChoice(index: number) { return `div#BUTTONINPUT div button:nth-of-type(${index})`; },
    TriggerLayerButton(index: number) { return `div#INSTANT div div.tiles-wrapper div:nth-of-type(${index + 1}) span input`},
    MultizoneImage(index: number) { return `div#CHOOSEMULTIZONE div div a:nth-of-type(${index}) img`; },
    ModalOption(index: number) { return `div#CHOOSEOPTION div div.card-container div:nth-of-type(${index})`; },
    Base(player: number) { return `span#P${player}BASE a`; },
    Leader(player: number) { return `span#P${player}LEADER a`; },
    LeaderExhaustDiv(player: number) { return `span#P${player}LEADER a div`; },
    AllyGroundUnit(index: number, exhausted: boolean = false) { return `div.groundAlliesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    AllySpaceUnit(index: number, exhausted: boolean = false) { return `div.spaceAlliesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    EnemyGroundUnit(index: number, exhausted: boolean = false) { return `div.groundEnemiesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    EnemySpaceUnit(index: number, exhausted: boolean = false) { return `div.spaceEnemiesContainer div:nth-of-type(${index})${exhausted ? '.exhausted' : ''} a`; },
    UniqueIdSelector(uniqueId: number) { return `div#unique-${uniqueId} a`; },
    UniqueIdExhausted(uniqueId: number) { return `div#unique-${uniqueId}.exhausted`; },
    //these count backwards where the last is subcards if any,
    //then Attack, then Defense, then damage if any,
    //then tokens like Sentinel, Shield, Clone if any
    UnitDivPiece(linkSelector: string, index: number) { return `${linkSelector} div:nth-last-of-type(${index})`; },
    UnitImg(linkSelector: string) { return `${linkSelector} img`; },
    PlayerPickSpan: 'span.playerpick-span',
    MyResources: 'div.my-resources div.resources span',
    TheirResources: 'div.their-resources div.resources span',
    ResourcePopupImgOption(index: number) { return `div#myResourcePopup div:nth-of-type(2) a:nth-of-type(${index}) img`; },
    ResourcePopupCloseButton: 'div#myResourcePopup div:nth-of-type(1) div img',
    MyBaseDamage: 'span.base-my-dmg',
    TheirBaseDamage: 'span.base-their-dmg',
    ClaimVictoryButton: 'button[title=claimVictoryButton]',
  }

export const p = {
  Move: 150,
  CheckBox: 250,
  ButtonPress: 350,
  WaitForEffect: 500,
  WaitToBegin: 1_500,
  WaitToChooseTarget: 800,
  Debug: 300_000,
  Indefinite: 1_000_000_000,
}

export const src = {
  SentinelToken: 'url("./Images/SentinelToken.png") 0% 0% / contain no-repeat',
  ShieldToken: 'url("./Images/ShieldToken.png") 0% 0% / contain no-repeat',
  CloneToken: 'url("./Images/CloneToken.png") 0% 0% / contain no-repeat',
  DamageGradient: 'linear-gradient(90deg, rgba(255, 0, 0, 0) 0%, rgba(255, 0, 0, 0.9) 50%, rgb(255, 0, 0) 100%), linear-gradient(270deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 45%, rgba(0, 0, 0, 0) 100%)',
  NotPlayableBorderUnit: 'border: 2px solid transparent; height: 96px; width: 96px; position: relative; border-radius: 10px;',
  NotPlayableBorderHand: 'border-radius: 8px; border: 1px solid transparent; height: 96px; width: 96px; position: relative;',
  Concat(cardID: string) { return 'http://localhost:8080/Arena/concat/' + cardID + '.webp'; },
}

export const customAsserts = {
  AllyUnitDivPieceIsOverlay: (browser: NightwatchAPI, arena: 'GROUND'|'SPACE', unit: number, divPiece: number) =>
    browser.assert.attributeEquals(com.UnitDivPiece(arena == 'GROUND'
      ? com.AllyGroundUnit(unit)
      : com.AllySpaceUnit(unit) , divPiece), 'class', 'overlay'),
  EnemyUnitDivPieceIsOverlay: (browser: NightwatchAPI, arena: 'GROUND'|'SPACE', unit: number, divPiece: number) =>
    browser.assert.attributeEquals(com.UnitDivPiece(arena == 'GROUND'
      ? com.EnemyGroundUnit(unit)
      : com.EnemySpaceUnit(unit) , divPiece), 'class', 'overlay'),
  UnitIsNotPlayable: (browser: NightwatchAPI, selector: string) => browser.assert.attributeEquals(com.UnitImg(selector), 'style', src.NotPlayableBorderUnit),
  HandCardIsNotPlayable: (browser: NightwatchAPI, card: number) => browser.assert.attributeEquals(com.HandCardImg(card), 'style', src.NotPlayableBorderHand),
  UnitIs: (browser: NightwatchAPI, cardID: string, selector: string) => browser.assert.attributeEquals(com.UnitImg(selector), 'src', src.Concat(cardID)),
  LeaderEpicActionUsed: (browser: NightwatchAPI, player: number) => browser.assert.attributeEquals(com.Leader(player) + ' img:nth-of-type(2)', 'src', 'http://localhost:8080/Arena/Images/ExhaustToken.png'),
  //Twilight of the Republic
  AllyGroundUnitIsBattleDroid: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(unit)), 'src', src.Concat(cards.TWI.BattleDroid)),
  EnemyGroundUnitIsBattleDroid: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.EnemyGroundUnit(unit)), 'src', src.Concat(cards.TWI.BattleDroid)),
  AllyGroundUnitIsCloneTrooper: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.AllyGroundUnit(unit)), 'src', src.Concat(cards.TWI.CloneTrooper)),
  EnemyGroundUnitIsCloneTrooper: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.EnemyGroundUnit(unit)), 'src', src.Concat(cards.TWI.CloneTrooper)),
  //Jump to Lightspeed
  AllySpaceUnitIsXWing: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.AllySpaceUnit(unit)), 'src', src.Concat(cards.JTL.XWing)),
  EnemySpaceUnitIsXWing: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.EnemySpaceUnit(unit)), 'src', src.Concat(cards.JTL.XWing)),
  AllySpaceUnitIsTieFighter: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.AllySpaceUnit(unit)), 'src', src.Concat(cards.JTL.TieFighter)),
  EnemySpaceUnitIsTieFighter: (browser: NightwatchAPI, unit: number) =>
    browser.assert.attributeEquals(com.UnitImg(com.EnemySpaceUnit(unit)), 'src', src.Concat(cards.JTL.TieFighter)),

}

export const g = {
  BaseHealths: 0,
  P1Hand: 1,
  P1Deck: 2,
  P1CharArray: 3,
  P1ResourcesState: 4,
  P1ResourcesArray: 5,
  P1Discard: 8,
  P1ClassState: 11,
  P1CharDisplay: 13,
  P1CardStats: 14,
  P1TurnStats: 15,
  P1AlliesArray: 16,
  P1Settings: 18,
  P2Hand: 19,
  P2Deck: 20,
  P2CharArray: 21,
  P2ResourcesState: 22,
  P2ResourcesArray: 23,
  P2Discard: 26,
  P2ClassState: 29,
  P2CharDisplay: 31,
  P2CardStats: 32,
  P2TurnStats: 33,
  P2AlliesArray: 34,
  P2Settings: 36,
  Winner: 38,
  FirstPlayer: 39,
  CurrentPlayer: 40,
  CurrentRound: 41,
  Turn: 42,
  //ActionPoints: 43,
  CombatChain: 44,
  CombatChainState: 45,
  CurrentTurnEffects: 46,
  CurrentTurnEffectsFromCombat: 47,
  NextTurnEffects: 48,
  DecisionQueue: 49,
  DqVars: 50,
  DqState: 51,
  Layers: 52,
  LayerPriority: 53,
  MainPlayer: 54,
  LastPlayed: 55,
  ChainLink: 56,
  ChainLinkSummary: 57,
  P1AuthKey: 58,
  P2AuthKey: 59,
  UniqueIDCounter: 60,
  InGameStatus: 61,
  CurrentPlayerActivity: 63,
  P1TotalTime: 66,
  P2TotalTime: 67,
  LastUpdateTime: 68,
  InitiativePlayer: 72,
  InitiativeTaken: 73,
}

export const cs = {//copied from Constants.php
  NumVillainyPlayed: 0,
  PlayedAsUpgrade: 1,
  AtksWWeapon: 2,
  NumNonTokenVehicleAttacks: 3,
  DamagePrevention: 4,
  CardsDrawn: 5,
  DamageTaken: 6,
  NumActionsPlayed: 7,
  //ArsenalFacing: 8,//Deprecated
  CharacterIndex: 9,
  PlayIndex: 10,
  NumNonAttackCards: 11,
  CachedCharacterLevel: 12,
  PreparationCounters: 13,
  NextNAACardGoAgain: 14,
  NumAlliesDestroyed: 15,
  NumWhenDefeatedPlayed: 16,
  ResolvingLayerUniqueID: 17,
  NextWizardNAAInstant: 18,
  ArcaneDamageTaken: 19,
  NextNAAInstant: 20,
  NextDamagePrevented: 21,
  LastAttack: 22,
  NumLeftPlay: 23,
  NumUsesLeaderUpgrade1: 24,
  NumUsesLeaderUpgrade2: 25,
  AfterPlayedBy: 26,
  PlayCCIndex: 27,
  NumAttackCards: 28, //Played or blocked
  NumPlayedFromBanish: 29,
  NumAttacks: 30,
  DieRoll: 31,
  NumMandalorianAttacks: 32,
  NumFighterAttacks: 33,
  LayerTarget: 34,
  NumSwordAttacks: 35,
  HitsWithWeapon: 36,
  ArcaneDamagePrevention: 37,
  DynCostResolved: 38,
  CardsEnteredGY: 39,
  HighestRoll: 40,
  NumMelodyPlayed: 41,
  NumAuras: 42,
  AbilityIndex: 43,
  AdditionalCosts: 44,
  NumRedPlayed: 45,
  PlayUniqueID: 46,
  NumPhantasmAADestroyed: 47,
  NumEventsPlayed: 48,
  AlluvionUsed: 49,
  MaxQuellUsed: 50,
  DamageDealt: 51, //Only includes damage dealt by the hero. CR 2.1 8.2.8f If an ally deals damage, the controlling player and their hero are not considered to have dealt damage.
  ArcaneTargetsSelected: 52,
  NumDragonAttacks: 53,
  NumIllusionistAttacks: 54,
  LastDynCost: 55,
  NumIllusionistActionCardAttacks: 56,
  ArcaneDamageDealt: 57,
  LayerPlayIndex: 58,
  NumCardsPlayed: 59, //Amulet of Ignition
  NamesOfCardsPlayed: 60, //Amulet of Echoes
  NumFirstOrderPlayed: 61,
  PlayedAsInstant: 62, //If the card was played as an instant -- some things like banish we lose memory of as soon as it is removed from the zone
  CachedLeader1EpicAction: 63,
  CachedLeader2EpicAction: 64,
  HitsWithSword: 65,
  NumClonesPlayed: 66,
  UnitsThatAttackedBase: 67,
  OppIndex: 68,
  OppCardActive: 69,
  PlayedWithExploit: 70,
  SeparatistUnitsThatAttacked: 71,
  AlliesDestroyed: 72, // List of allies (CardID) destroyed concatenated with a comma
  NumBountyHuntersPlayed: 73,
  NumPilotsPlayed: 74,
}
