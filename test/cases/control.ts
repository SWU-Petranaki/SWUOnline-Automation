import { cards } from '../utils/cards';
import { GameState } from '../utils/gamestate';
import {
  com, p,
  player1Window, player2Window,
  gameName,
  src,
  customAsserts
} from '../utils/util';

export const ControlCases = {
  'Control: Traitorous enemy joins my side': async function () {
  //arrange
  const gameState = new GameState(gameName);
  await gameState.LoadGameStateLinesAsync();
  await gameState.ResetGameStateLines()
    .AddBase(1, cards.SOR.ECL)
    .AddLeader(1, cards.SOR.SabineLeader)
    .AddBase(2, cards.SOR.ECL)
    .AddLeader(2, cards.SOR.SabineLeader)
    .FillResources(1, cards.SOR.BFMarine, 5)
    .AddCardToHand(1, cards.SOR.Traitorous)
    .AddUnit(1, cards.SOR.SabineUnit, false)
    .AddUnit(2, cards.SOR.CraftySmuggler, true, 0,
      gameState.SubcardBuilder().AddShield(2).Build())
    .FlushAsync(com.BeginTestCallback)
  ;
  //act
  await browser
    .waitForElementPresent(com.MyHand)
    .moveToElement(com.GameChat, 0, 0).pause(p.Move)
    .click(com.HandCard(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    .click(com.EnemyGroundUnit(1))
    .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
  ;
  //assert
  await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
  await browser.assert.elementPresent(com.AllyGroundUnit(2));
  await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), 'TRAITOROUS');
  },
  'Control: Traitorous enemy returns when upgrade defeated': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 1)
      .AddCardToHand(1, cards.SOR.Confiscate)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DSStormTrooper, true, 0,
        gameState.SubcardBuilder().AddExperience(2, 8).Build())
      .AddUnit(2, cards.SOR.CraftySmuggler, true, 0,
        gameState.SubcardBuilder().AddShield(2).AddUpgrade(cards.SOR.Traitorous, 2).Build(), 1)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(2))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
      .click(com.ChooseButton(2, 1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(2));
    await browser.assert.elementPresent(com.AllyGroundUnit(2));
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '2');
  },
  'Control: Change of Heart returns at end': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ChopperBase)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 6)
      .AddCardToHand(1, cards.SOR.ChangeOfHeart)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DarthVader)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.elementPresent(com.AllyGroundUnit(2));
    //pass turn
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.ClaimButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.ClaimButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    await browser.window.switchTo(player1Window).refresh()
      .waitForElementPresent(com.PassButton)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.PassButton).pause(p.ButtonPress)
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.elementPresent(com.EnemyGroundUnit(1));
    await browser.assert.not.elementPresent(com.AllyGroundUnit(2));
  },
  'Control: Mercenary Gunship both players can take control': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 4)
      .FillResources(2, cards.SOR.BFMarine, 4)
      .AddUnit(2, cards.SHD.MercenaryGunship)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementPresent(com.AllySpaceUnit(1));
    //act
    await browser.window.switchTo(player2Window).refresh()
      .waitForElementPresent(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.EnemySpaceUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.not.elementPresent(com.EnemySpaceUnit(1));
    await browser.assert.elementPresent(com.AllySpaceUnit(1));
  },
  'Control: Choose Sides on opponent': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.SOR.SabineLeader)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.SOR.SabineLeader)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .AddCardToHand(1, cards.SHD.ChooseSides)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(1, cards.SOR.DSStormTrooper)
      .AddUnit(2, cards.SOR.DarthVader)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
      .click(com.EnemyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitForEffect)
    ;
    //assert
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(1), 2), '1');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 1), '5');
    await browser.assert.textEquals(com.UnitDivPiece(com.AllyGroundUnit(2), 2), '7');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 1), '3');
    await browser.assert.textEquals(com.UnitDivPiece(com.EnemyGroundUnit(1), 2), '1');
  },
  'Control: Choose Sides cant choose piloted leader units': async function () {
    //arrange
    const gameState = new GameState(gameName);
    await gameState.LoadGameStateLinesAsync();
    await gameState.ResetGameStateLines()
      .AddBase(1, cards.SOR.ECL)
      .AddLeader(1, cards.JTL.HanSoloLeader, true)
      .AddBase(2, cards.SOR.ECL)
      .AddLeader(2, cards.JTL.AsajjLeader, true)
      .FillResources(1, cards.SOR.BFMarine, 7)
      .AddCardToHand(1, cards.SHD.ChooseSides)
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(1, cards.SOR.Snowspeeder, false, 0,
        gameState.SubcardBuilder().AddUpgrade(cards.SOR.SabineLeaderUnit, 1, true).Build())
      .AddUnit(1, cards.SOR.Snowspeeder)
      .AddUnit(2, cards.SOR.TieLnFighter)
      .AddUnit(2, cards.SOR.TieLnFighter, false, 0,
        gameState.SubcardBuilder().AddPilot(cards.JTL.AsajjLeaderUnit, 1, true).Build())
      .AddUnit(2, cards.SOR.TieLnFighter)
      .FlushAsync(com.BeginTestCallback)
    ;
    //act
    await browser
      .waitForElementPresent(com.MyHand)
      .moveToElement(com.GameChat, 0, 0).pause(p.Move)
      .click(com.HandCard(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.AllyGroundUnit(2));
    //act
    await browser.click(com.AllyGroundUnit(1))
      .moveToElement(com.GameChat, 0, 0).pause(p.WaitToChooseTarget)
    ;
    //assert
    await customAsserts.UnitIsNotPlayable(browser, com.EnemySpaceUnit(2));
  }
}