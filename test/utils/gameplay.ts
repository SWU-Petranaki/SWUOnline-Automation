import { Awaitable, NightwatchAPI } from "nightwatch";

import {
  com,
  p,
  player1Window, player2Window,
} from '../utils/util';
import { GameAssert } from "./gameassert";

export class GamePlay {
  private _assert: GameAssert = new GameAssert(this);
  private _asyncBrowser: Awaitable<NightwatchAPI, undefined>;
  private _currentPlayer: number;

  public constructor(browser: NightwatchAPI) {
    if(player1Window == '' || player2Window == '') {
      throw new Error('player1 and player2 window handles not set');
    }

    this._asyncBrowser = browser.waitForElementPresent(com.MyHand).pause(p.Move);
    this._currentPlayer = 1;
  }

  public async RunAsync() {
    return await this._asyncBrowser.pause(p.WaitForEffect);
  }

  public ___Debug() {
    this._asyncBrowser.pause(p.Debug);

    return this;
  }

  public ___LongPause() {
    this._asyncBrowser.pause(p.Indefinite);

    return this;
  }
  //Window switch and waits
  public CurrentPlayer() {
    return this._currentPlayer
  }

  public SwitchPlayerWindow() {
    this._currentPlayer = this._currentPlayer == 1 ? 2 : 1;
    this._asyncBrowser.window
      .switchTo(this._currentPlayer == 1 ? player1Window : player2Window)
      .refresh();

    return this;
  }

  WaitFor(selector: string) {
    this._asyncBrowser
      .waitForElementPresent(selector);

    return this;
  }

  public WaitForMyBase() {
    this.WaitFor(com.Base(this._currentPlayer));

    return this;
  }

  public WaitForMyLeader() {
    this.WaitFor(com.Leader(this._currentPlayer));

    return this;
  }

  public WaitForMyHand() {
    this.WaitFor(com.MyHand);

    return this;
  }

  public WaitForMyGroundUnit(position: number = 1) {
    this.WaitFor(com.AllyGroundUnit(position));

    return this;
  }

  public WaitForMySpaceUnit(position: number = 1) {
    this.WaitFor(com.AllySpaceUnit(position));

    return this;
  }

  public WaitForMyUnit(arena:"GROUND"|"SPACE", position: number = 1) {
    this.WaitFor(arena == "GROUND" ? com.AllyGroundUnit(position) : com.AllySpaceUnit(position));

    return this;
  }

  public WaitForPassButton() {
    this.WaitFor(com.PassButton);

    return this;
  }

  public WaitForClaimButton() {
    this.WaitFor(com.ClaimButton);

    return this;
  }
  //Clicks
  Click(selector: string) {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.Move).click(selector);

    return this;
  }

  public ClickMyBase() {
    this.Click(com.Base(this._currentPlayer));

    return this;
  }

  public ClickTheirBase() {
    this.Click(com.Base(this._currentPlayer == 1 ? 2 : 1));

    return this;
  }

  public ClickMyLeader() {
    this.Click(com.Leader(this._currentPlayer));

    return this;
  }

  public ClickHandCard(position: number) {
    this.Click(com.HandCard(position));

    return this;
  }

  public ClickMyGroundUnit(position: number) {
    this.Click(com.AllyGroundUnit(position));

    return this;
  }

  public ClickTheirGroundUnit(position: number) {
    this.Click(com.EnemyGroundUnit(position));

    return this;
  }

  public ClickMySpaceUnit(position: number) {
    this.Click(com.AllySpaceUnit(position));

    return this;
  }

  public ClickTheirSpaceUnit(position: number) {
    this.Click(com.EnemySpaceUnit(position));

    return this;
  }

  public ClickLayerTile(position: number) {
    this.Click(com.TriggerLayerButton(position))._asyncBrowser.pause(p.ButtonPress);

    return this;
  }

  //Targets
  Target(selector: string) {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget).click(selector);

    return this;
  }

  public TargetMyBase() {
    this.Target(com.Base(this._currentPlayer));

    return this;
  }

  public TargetTheirBase() {
    this.Target(com.Base(this._currentPlayer == 1 ? 2 : 1));

    return this;
  }

  public TargetMyHandCard(position: number) {
    this.Target(com.HandCard(position));

    return this;
  }

  public TargetMyGroundUnit(position: number) {
    this.Target(com.AllyGroundUnit(position));

    return this;
  }

  public TargetTheirGroundUnit(position: number) {
    this.Target(com.EnemyGroundUnit(position));

    return this;
  }

  public TargetMySpaceUnit(position: number) {
    this.Target(com.AllySpaceUnit(position));

    return this;
  }

  public TargetTheirSpaceUnit(position: number) {
    this.Target(com.EnemySpaceUnit(position));

    return this;
  }
  //Core Actions
  public Pass() {
    this.Click(com.PassButton)._asyncBrowser.pause(p.ButtonPress);

    return this;
  }

  public PassTurn() {
    this.Pass()._asyncBrowser.moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect);

    return this;
  }

  public ClaimInitiative() {
    this.Click(com.ClaimButton)._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect);

    return this;
  }

  public ChooseYes() {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton("YES")).pause(p.ButtonPress)
    ;

    return this;
  }

  public ChooseNo() {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YesNoButton("NO")).pause(p.ButtonPress)
    ;

    return this;
  }

  public MultichoiceButton(choice: number) {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ButtonMultiChoice(choice)).pause(p.ButtonPress)
    ;

    return this;
  }

  public ChooseButton(index: number, choice: number) {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(index, choice)).pause(p.ButtonPress)
    ;

    return this;
  }

  public Submit() {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.SubmitButton).pause(p.ButtonPress)
    ;

    return this;
  }

  public WaitForAnimation() {
    this._asyncBrowser.pause(p.WaitForEffect);

    return this;
  }

  //Assertions
  public Assert() {
    return this._assert;
  }

  public ___BrowsertAssert() {
    return this._asyncBrowser.assert;
  }
}