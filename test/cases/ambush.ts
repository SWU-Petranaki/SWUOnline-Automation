import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../utils/util';

export const AmbushCases = {
  'Ambush: ECL Sabine Ping Shield': async function () {
  //arrange
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .AddBase(1, cards.SOR.ECL)
    .AddLeader(1, cards.SOR.SabineLeader)
    .AddBase(2, cards.SOR.ECL)
    .AddLeader(2, cards.SOR.SabineLeader)
    .FillResources(1, cards.SOR.BFMarine, 2)
    .AddCardToHand(1, cards.SOR.SabineUnit)
    .AddUnit(1, cards.SOR.SabineUnit, false)
    .AddUnit(2, cards.SOR.CraftySmuggler, true, 0,
      gameState.SubcardBuilder().AddShield(2).Build())
    .FlushAsync(com.BeginTestCallback)
  ;
  //act
  await browser
    .waitForElementPresent(com.MyHand)
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.Base(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.HandCard(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.AllyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    .click(com.YesNoButton("YES")).pause(p.ButtonPress)
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
  ;
  //assert
  await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
  await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 3), '2');
  },
  'Ambush: Rukh into Krayt Dragon with ECL': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.MoffTarkinLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 5)
      .AddCardToHand(1, cards.SOR.Rukh)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser.waitForElementPresent(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.Base(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
      .click(com.YesNoButton("YES")).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 3), '5');
  },
  'Ambush: Rukh into Krayt Dragon with TI': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.MoffTarkinLeader)
      .AddBase(2, cards.SOR.KestroCity)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.SOR.Rukh)
      .AddCardToHand(1, cards.SHD.TimelyIntervention)
      .AddUnit(2, cards.SHD.KraytDragon)
      .FlushAsync(com.BeginTestCallback)

    await browser.waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.TriggerLayerButton(1)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.TriggerLayerButton(3)).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .click(com.YesNoButton("YES")).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.assert.not.elementPresent(com.AllyGroundUnit(1));
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
  },
}