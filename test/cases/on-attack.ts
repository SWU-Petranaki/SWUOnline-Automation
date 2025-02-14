import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  cs,
  src,
  customAsserts
} from '../utils/util';

export const OnAttackCases = {
  'OnAttack: Enfys Nest TWI bounce': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .AddUnit(1, cards.TWI.EnfysNest)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '5');
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 1);
  },
  'OnAttack: Enfys Nest TWI cant bounce piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .AddCardToHand(2, cards.SOR.Waylay)
      .AddUnit(1, cards.TWI.EnfysNest, true, false, 0,
        gameState.SubcardBuilder().AddExperience(1, 1).Build())
      .AddUnit(2, cards.SOR.TieLnFighter, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '6');
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementsCount(com.TheirHandDivs, 1);
  },
  'OnAttack: Avenger cant defeat piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.KrennicLeader)
      .AddBase(2, cards.SOR.ChopperBase)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .AddUnit(1, cards.SOR.Avenger)
      .AddUnit(2, cards.SOR.AllianceXWing, false, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.TheirBaseDamage, '8');
    await browser.assert.elementPresent(com.EnemySpaceUnit(1));
  },
  'OnAttack: Outer Rim Headhunter cant exhaust piloted leader unit': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.HanSoloLeader, true)
      .AddUnit(1, cards.SOR.OuterRimHH, true, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.BFMarine)
      .AddUnit(2, cards.JTL.XWing, true, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 2, true).Build())
      .AddUnit(2, cards.JTL.XWing)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.AllySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.Base(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(1));
  }
}