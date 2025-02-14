import { cards } from '../../utils/cards';
import { GameState } from '../../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName
} from '../../utils/util';

const GideonHaskGameStateAsync = async () => {
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .SetBasesDamage("4 9")
    .AddBase(1, cards.SOR.ECL)
    .AddLeader(1, cards.SOR.KrennicLeader, true)
    .AddBase(2, cards.SOR.ChopperBase)
    .AddLeader(2, cards.SOR.SabineLeader)
    .AddResource(2, cards.SOR.CraftySmuggler)
    .AddCardToHand(2, cards.SHD.DaringRaid)
    .AddUnit(1, cards.SOR.KrennicLeaderUnit, true)
    .AddUnit(1, cards.SOR.GideonHask, false, false, 3)
    .AddUnit(2, cards.SOR.DSStormTrooper)
    .FlushAsync(com.BeginTestCallback)
  ;
}


export const SpecificSORCases = {
  'Gideon Hask: traded from enemy unit': async function () {
    //arrange
    await GideonHaskGameStateAsync();
    //act
    await browser
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
  },
  'Gideon Hask: opponent pings self': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await GideonHaskGameStateAsync();
    //act
    await browser
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), 'EXPERIENCE');
  },
  'Gideon Hask: pinged to death': process.env.FULL_REGRESSION !== "true" ? '' : async function () {
    //arrange
    await GideonHaskGameStateAsync();
    //act
    await browser
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
    ;

    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;

    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '2');
  },
}