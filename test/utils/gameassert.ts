import { NightwatchAPI } from "nightwatch";
import { GamePlay } from "./gameplay";
import { com, src } from "./util";

export class GameAssert {
  private _gamePlay: GamePlay;

  public constructor(gamePlay: GamePlay) {
    this._gamePlay = gamePlay;
  }

  public RunAsync() {
    return this._gamePlay.RunAsync();
  }

  ElementPresent(selector: string) {
    this._gamePlay.___BrowsertAssert().elementPresent(selector);

    return this;
  }

  public MyBaseDamageEquals(damage: string) {
    this._gamePlay.___BrowsertAssert().textEquals(com.MyBaseDamage, damage);

    return this;
  }

  public TheirBaseDamageEquals(damage: string) {
    this._gamePlay.___BrowsertAssert().textEquals(com.TheirBaseDamage, damage);

    return this;
  }

  public MyLeaderIsThere() {
    this.ElementPresent(com.Leader(this._gamePlay.CurrentPlayer()));

    return this;
  }

  public TheirLeaderIsThere() {
    this.ElementPresent(com.Leader(this._gamePlay.CurrentPlayer() == 1 ? 2 : 1));

    return this;
  }

  public MyLeaderIsExhausted() {
    this._gamePlay.___BrowsertAssert()
      .attributeContains(com.LeaderExhaustDiv(this._gamePlay.CurrentPlayer()), 'style', 'visibility: visible');

    return this;
  }

  public TheirLeaderIsExhausted() {
    this._gamePlay.___BrowsertAssert()
      .attributeContains(com.LeaderExhaustDiv(this._gamePlay.CurrentPlayer() == 1 ? 2 : 1), 'style', 'visibility: visible');

    return this;
  }

  public MyLeaderIsReady() {
    this._gamePlay.___BrowsertAssert()
      .attributeContains(com.LeaderExhaustDiv(this._gamePlay.CurrentPlayer()), 'style', 'visibility: hidden');

    return this;
  }

  public TheirLeaderIsReady() {
    this._gamePlay.___BrowsertAssert()
      .attributeContains(com.LeaderExhaustDiv(this._gamePlay.CurrentPlayer() == 1 ? 2 : 1), 'style', 'visibility: hidden');

    return this;
  }

  public MyLeaderHasUsedEpicAction() {
    this._gamePlay.___BrowsertAssert()
      .attributeEquals(com.Leader(this._gamePlay.CurrentPlayer()) + ' img:nth-of-type(2)', 'src', 'http://localhost:8080/Arena/Images/ExhaustToken.png')

    return this;
  }

  public TheirLeaderHasUsedEpicAction() {
    this._gamePlay.___BrowsertAssert()
      .attributeEquals(com.Leader(this._gamePlay.CurrentPlayer() == 1 ? 2 : 1) + ' img:nth-of-type(2)', 'src', 'http://localhost:8080/Arena/Images/ExhaustToken.png')

    return this;
  }

  public MyLeaderStillHasEpicAction() {
    this._gamePlay.___BrowsertAssert()
      .not.elementPresent(com.Leader(this._gamePlay.CurrentPlayer()) + ' img:nth-of-type(2)');

    return this;
  }

  public TheirLeaderStillHasEpicAction() {
    this._gamePlay.___BrowsertAssert()
      .not.elementPresent(com.Leader(this._gamePlay.CurrentPlayer() == 1 ? 2 : 1) + ' img:nth-of-type(2)');

    return this;
  }

  public MyHandSizeIs(size: number) {
    this._gamePlay.___BrowsertAssert().elementsCount(com.MyHandDivs, size);

    return this;
  }

  public TheirHandSizeIs(size: number) {
    this._gamePlay.___BrowsertAssert().elementsCount(com.TheirHandDivs, size);

    return this;
  }

  public MyHandCardIs(position: number, text: string) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.HandCardImg(position), 'alt', text);

    return this;
  }

  public MyHandCardImgSrcEquals(position: number, text: string) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.HandCardImg(position), 'src', src.Concat(text));

    return this;
  }

  public MyHandCardIsNotPlayable(position: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.HandCardImg(position), 'style', src.NotPlayableBorderHand);

    return this;
  }

  public MyGroundUnitIsThere(position: number, exhausted: boolean = false) {
    this.ElementPresent(com.AllyGroundUnit(position, exhausted));

    return this;
  }

  public MySpaceUnitIsThere(position: number, exhausted: boolean = false) {
    this.ElementPresent(com.AllySpaceUnit(position, exhausted));

    return this;
  }

  public MyGroundUnitIsNotExhausted(position: number) {
    this.ElementNotPresent(com.AllyGroundUnit(position, true));

    return this;
  }

  public MySpaceUnitIsNotExhausted(position: number) {
    this.ElementNotPresent(com.AllySpaceUnit(position, true));

    return this;
  }

  public TheirGroundUnitIsThere(position: number, exhausted: boolean = false) {
    this.ElementPresent(com.EnemyGroundUnit(position, exhausted));

    return this;
  }

  public TheirSpaceUnitIsThere(position: number, exhausted: boolean = false) {
    this.ElementPresent(com.EnemySpaceUnit(position, exhausted));

    return this;
  }

  public TheirGroundUnitIsNotExhausted(position: number) {
    this.ElementNotPresent(com.EnemyGroundUnit(position, true));

    return this;
  }

  public TheirSpaceUnitIsNotExhausted(position: number) {
    this.ElementNotPresent(com.EnemySpaceUnit(position, true));

    return this;
  }

  ElementNotPresent(selector: string) {
    this._gamePlay.___BrowsertAssert().not.elementPresent(selector);

    return this;
  }

  public IHaveNoGroundUnits() {
    this.ElementNotPresent(com.AllyGroundUnit(1));

    return this;
  }

  public IHaveNoSpaceUnits() {
    this.ElementNotPresent(com.AllySpaceUnit(1));

    return this;
  }

  public TheyHaveNoGroundUnits() {
    this.ElementNotPresent(com.EnemyGroundUnit(1));

    return this;
  }

  public TheyHaveNoSpaceUnits() {
    this.ElementNotPresent(com.EnemySpaceUnit(1));

    return this;
  }

  public WeHaveNoGroundUnits() {
    this.ElementNotPresent(com.AllyGroundUnit(1));
    this.ElementNotPresent(com.EnemyGroundUnit(1));

    return this;
  }

  public WeHaveNoSpaceUnits() {
    this.ElementNotPresent(com.AllySpaceUnit(1));
    this.ElementNotPresent(com.EnemySpaceUnit(1));

    return this;
  }

  public WeHaveNoUnits() {
    this.WeHaveNoGroundUnits();
    this.WeHaveNoSpaceUnits();

    return this;
  }

  public MyGroundUnitIsGone(position: number) {
    this.ElementNotPresent(com.AllyGroundUnit(position));

    return this;
  }

  public MySpaceUnitIsGone(position: number) {
    this.ElementNotPresent(com.AllySpaceUnit(position));

    return this;
  }

  public TheirGroundUnitIsGone(position: number) {
    this.ElementNotPresent(com.EnemyGroundUnit(position));

    return this;
  }

  public TheirSpaceUnitIsGone(position: number) {
    this.ElementNotPresent(com.EnemySpaceUnit(position));

    return this;
  }


  TextEquals(selector: string, text: string) {
    this._gamePlay.___BrowsertAssert().textEquals(selector, text);

    return this;
  }

  public MyGroundUnitPieceEquals(position: number, piece: number, text: string) {
    this.TextEquals(com.UnitDivPiece(com.AllyGroundUnit(position), piece), text);

    return this;
  }

  public MyGroundUnitPieceIsOverlay(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitDivPiece(com.AllyGroundUnit(position), piece), 'class', 'overlay');

    return this;
  }

  public MySpaceUnitPieceEquals(position: number, piece: number, text: string) {
    this.TextEquals(com.UnitDivPiece(com.AllySpaceUnit(position), piece), text);

    return this;
  }

  public MySpaceUnitPieceIsOverlay(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitDivPiece(com.AllySpaceUnit(position), piece), 'class', 'overlay');

    return this;
  }

  public TheirGroundUnitPieceEquals(position: number, piece: number, text: string) {
    this.TextEquals(com.UnitDivPiece(com.EnemyGroundUnit(position), piece), text);

    return this;
  }

  public TheirGroundUnitPieceIsOverlay(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitDivPiece(com.EnemyGroundUnit(position), piece), 'class', 'overlay');

    return this;
  }

  public TheirSpaceUnitPieceEquals(position: number, piece: number, text: string) {
    this.TextEquals(com.UnitDivPiece(com.EnemySpaceUnit(position), piece), text);

    return this;
  }

  public TheirSpaceUnitPieceIsOverlay(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitDivPiece(com.EnemySpaceUnit(position), piece), 'class', 'overlay');

    return this;
  }

  public MyGroundUnitPieceIsSentinelToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.AllyGroundUnit(position), piece), 'style', src.SentinelToken)

    return this;
  }

  public MyGroundUnitPieceIsShieldToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.AllyGroundUnit(position), piece), 'style', src.ShieldToken)

    return this;
  }

  public MySpaceUnitPieceIsSentinelToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.AllySpaceUnit(position), piece), 'style', src.SentinelToken)

    return this;
  }

  public MySpaceUnitPieceIsShieldToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.AllySpaceUnit(position), piece), 'style', src.ShieldToken)

    return this;
  }

  public TheirGroundUnitPieceIsSentinelToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.EnemyGroundUnit(position), piece), 'style', src.SentinelToken)

    return this;
  }

  public TheirGroundUnitPieceIsShieldToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.EnemyGroundUnit(position), piece), 'style', src.ShieldToken)

    return this;
  }

  public TheirSpaceUnitPieceIsSentinelToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.EnemySpaceUnit(position), piece), 'style', src.SentinelToken)

    return this;
  }

  public TheirSpaceUnitPieceIsShieldToken(position: number, piece: number) {
    this._gamePlay.___BrowsertAssert().attributeContains(com.UnitDivPiece(com.EnemySpaceUnit(position), piece), 'style', src.ShieldToken)

    return this;
  }

  public MyResourcesEquals(text: string) {
    this.TextEquals(com.MyResources, text);

    return this;
  }

  public TheirResourcesEquals(text: string) {
    this.TextEquals(com.TheirResources, text);

    return this;
  }

  public MyHandIsEmpty() {
    this.ElementNotPresent(com.MyHandDivs);

    return this;
  }

  public TheirHandIsEmpty() {
    this.ElementNotPresent(com.TheirHandDivs);

    return this;
  }

  public MyDiscardIsEmpty() {
    this.ElementPresent(com.MyDiscardEmpty);

    return this;
  }

  public TheirDiscardIsEmpty() {
    this.ElementPresent(com.TheirDiscardEmpty);

    return this;
  }

  public MyDiscardCountEquals(count: number) {
    this.TextEquals(com.MyDiscardCount, count.toString());

    return this;
  }

  public TheirDiscardCountEquals(count: number) {
    this.TextEquals(com.TheirDiscardCount, count.toString());

    return this;
  }

  public MyDiscardCardIs(position: number, text: string) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.MyDiscardCard(position), 'src', src.Concat(text));

    return this;
  }

  public MyGroundUnitIsNotPlayable(position: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitImg(com.AllyGroundUnit(position)), 'style', src.NotPlayableBorderUnit);

    return this;
  }

  public MySpaceUnitIsNotPlayable(position: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitImg(com.AllySpaceUnit(position)), 'style', src.NotPlayableBorderUnit);

    return this;
  }

  public TheirGroundUnitIsNotPlayable(position: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitImg(com.EnemyGroundUnit(position)), 'style', src.NotPlayableBorderUnit);

    return this;
  }

  public TheirSpaceUnitIsNotPlayable(position: number) {
    this._gamePlay.___BrowsertAssert().attributeEquals(com.UnitImg(com.EnemySpaceUnit(position)), 'style', src.NotPlayableBorderUnit);

    return this;
  }

  public PlayerPickSpanTextEquals(text: string) {
    this.TextEquals(com.PlayerPickSpan, text);

    return this;
  }

  public NoMultiChoicePopup() {
    this.ElementNotPresent(com.MultiChoicePopup);

    return this;
  }

  public static async LastLogEqualsAsync(browser: NightwatchAPI, text: string, last: number = 1) {
    const lastLog = (await browser.getText(com.GameLog)).split('\n').slice(-1*last)[0];
    browser.assert.equal(lastLog, text);
  }
}