import { cards } from '@utils/cards';
import { GamePlay } from '@utils/gameplay';
import { GameState } from '@utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  cs,
  src,
  customAsserts
} from '@utils/util';

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
      .AddUnit(1, cards.TWI.EnfysNest, false, true, 0,
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
      .AddUnit(1, cards.SOR.OuterRimHH, false, true, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.HanSoloLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.BFMarine)
      .AddUnit(2, cards.JTL.XWing, false, true, 0,
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
  },
  Rebel_Assault_Sabine_interactions: async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .SetBasesDamage("12 2")
      .AddBase(1, cards.generic.BlueForceBase, false, true)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.generic.GreenForceBase)
      .AddLeader(2, cards.JTL.LukeLeader)
      .FillResources(1, cards.SOR.BFMarine, 12)
      .FillResources(2, cards.SOR.BFMarine, 12)
      .AddCardToDeck(1, cards.SOR.Avenger)
      .AddCardToDeck(2, cards.SOR.BFMarine, 3)
      .AddCardToHand(1, cards.SOR.RebelAssault)
      .AddUnit(1, cards.JTL.SabinesMP)
      .AddUnit(2, cards.JTL.SabinesMP)
      .AddUnit(2, cards.SOR.BFMarine)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    const gameplay = new GamePlay(browser);
    await gameplay
      .WaitForMyLeader().ClickMyLeader().MultiChoiceButton(2)
      .SwitchPlayerWindow().ClaimInitiative()
      .SwitchPlayerWindow().PlayFromHand(1).TargetMyGroundUnit(1).TargetTheirGroundUnit(1).Pass()
      .TargetTheirSpaceUnit(1).Pass().TargetTheirBase()
      .RunAsync()
    ;
    //assert
    gameplay.Assert()
      .TheyHaveNoGroundUnits().TheyHaveNoSpaceUnits()
      .IHaveNoSpaceUnits().MyGroundUnitIsThere(1, true)
      .MyGroundUnitPieceEquals(1, 3, "3")
      .MyBaseDamageEquals("12")
      .TheirBaseDamageEquals("4")
      .RunAsync()
    ;
  }
}