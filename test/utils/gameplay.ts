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

  public RunAsync() {
    return this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect);
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
    this._asyncBrowser.pause(p.WaitForEffect)
      .window.switchTo(this._currentPlayer == 1 ? player1Window : player2Window).refresh();

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

  public WaitForTheirGroundUnit(position: number = 1) {
    this.WaitFor(com.EnemyGroundUnit(position));

    return this;
  }

  public WaitForTheirSpaceUnit(position: number = 1) {
    this.WaitFor(com.EnemySpaceUnit(position));

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

  public WaitForCheckboxes() {
    this.WaitFor(com.CheckboxPopup);

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
    this._asyncBrowser.pause(p.WaitForEffect);

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

  ClickCheckbox(position: number) {
    this.Click(com.Checkbox(position))._asyncBrowser.pause(p.CheckBox);

    return this;
  }

  public ClickMyBaseDmgInc(times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageIncrement(com.Base(this._currentPlayer)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickMyBaseDmgDec(times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageDecrement(com.Base(this._currentPlayer)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickTheirBaseDmgInc(times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageIncrement(com.Base(this._currentPlayer == 1 ? 2 : 1)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickTheirBaseDmgDec(times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageDecrement(com.Base(this._currentPlayer == 1 ? 2 : 1)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickMyGroundUnitDmgInc(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageIncrement(com.AllyGroundUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickMyGroundUnitDmgDec(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageDecrement(com.AllyGroundUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickMySpaceUnitDmgInc(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageIncrement(com.AllySpaceUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickMySpaceUnitDmgDec(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageDecrement(com.AllySpaceUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickTheirGroundUnitDmgInc(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageIncrement(com.EnemyGroundUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickTheirGroundUnitDmgDec(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageDecrement(com.EnemyGroundUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickTheirSpaceUnitDmgInc(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageIncrement(com.EnemySpaceUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickTheirSpaceUnitDmgDec(position: number, times: number = 1) {
    for(let i = 0; i < times; i++) {
      this.Click(com.DamageDecrement(com.EnemySpaceUnit(position)))._asyncBrowser.pause(p.ButtonPress);
    }

    return this;
  }

  public ClickMyDiscard() {
    this.Click(com.MyDiscard)._asyncBrowser.pause(p.ButtonPress);

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

  public TargetMyDiscard() {
    this.Target(com.MyDiscard);

    return this;
  }
  //Core Actions
  public Pass() {
    this._asyncBrowser.moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect);
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

  public Confirm() {
    this.Click(com.ConfirmButton)._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect);

    return this;
  }

  public Ok() {
    this.Click(com.OkButtonPopup)._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect);

    return this;
  }

  public ChooseYourself() {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YourselfOrOpponentButton("Yourself")).pause(p.ButtonPress)
    ;

    return this;
  }

  public ChooseOpponent() {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.YourselfOrOpponentButton("Opponent")).pause(p.ButtonPress)
    ;

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

  public MultiChoiceButton(choice: number) {
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

  public ChooseMultiImg(position: number) {
    this.Click(com.MultizoneImage(position))._asyncBrowser.pause(p.ButtonPress);

    return this;
  }

  public ChooseModalOption(position: number) {
    this.Click(com.ModalOption(position))._asyncBrowser.pause(p.ButtonPress);

    return this;
  }

  public Submit() {
    this._asyncBrowser
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.SubmitButton).pause(p.ButtonPress)
    ;

    return this;
  }
  //Aliases
  public PlayFromHand(position: number) {
    return this.ClickHandCard(position);
  }

  public Check(position: number) {
    return this.ClickCheckbox(position);
  }

  public AttackWithMyGroundUnit(position: number) {
    return this.ClickMyGroundUnit(position);
  }

  public AttackWithMySpaceUnit(position: number) {
    return this.ClickMySpaceUnit(position);
  }

  public OpenMyDiscard() {
    return this.TargetMyDiscard();
  }
  //Assertions
  public Assert() {
    return this._assert;
  }

  public ___BrowsertAssert() {
    return this._asyncBrowser.assert;
  }
}